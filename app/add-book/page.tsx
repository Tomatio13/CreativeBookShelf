"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function AddBook() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [formData, setFormData] = useState({
    bookContent: "",
    targetReaders: "",
    nPages: 10,
    level: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProgress(t.startingGeneration);

    try {
      const generateResponse = await fetch("/api/ai/generate-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_content: formData.bookContent,
          target_readers: formData.targetReaders,
          n_pages: Number(formData.nPages),
          level: formData.level,
        }),
      });

      const { task_id } = await generateResponse.json();

      let status = "processing";
      let retryCount = 0;
      const maxRetries = 60;

      while (status === "processing" && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        const statusResponse = await fetch(`/api/ai/task/${task_id}`);
        const statusData = await statusResponse.json();
        status = statusData.status;

        if (statusData.detail) {
          throw new Error(statusData.detail);
        }

        if (status === "failed") {
          throw new Error(t.generationError);
        }

        setProgress(t.generatingProgress.replace('{progress}', 
          Math.min(Math.round((retryCount + 1) / maxRetries * 100), 95).toString()
        ));

        if (status === "completed") {
          setProgress(t.generationComplete);
          
          // PDFとカバー画像をダウンロード
          const [pdfResponse, coverResponse] = await Promise.all([
            fetch(`/api/ai/download/${task_id}`),
            fetch(`/api/ai/download-cover/${task_id}`),
          ]);

          const pdfBlob = await pdfResponse.blob();
          const coverBlob = await coverResponse.blob();

          setProgress(t.uploadingFiles);

          // PocketBaseにファイルをアップロード
          const pdfFormData = new FormData();
          pdfFormData.append('file', pdfBlob, `${task_id}.pdf`);
          pdfFormData.append('type', 'pdf');

          const coverFormData = new FormData();
          coverFormData.append('file', coverBlob, `${task_id}.png`);
          coverFormData.append('type', 'cover');

          const [pdfUpload, coverUpload] = await Promise.all([
            fetch("/api/upload", { method: "POST", body: pdfFormData }),
            fetch("/api/upload", { method: "POST", body: coverFormData }),
          ]);

          const [pdfData, coverData] = await Promise.all([
            pdfUpload.json(),
            coverUpload.json(),
          ]);

          // 本をデータベースに追加
          const response = await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: statusData.title,
              author: statusData.author,
              coverImage: coverData.path,
              description: formData.bookContent,
              pdfPath: pdfData.path,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '本の登録に失敗しました');
          }

          const bookData = await response.json();
          console.log('Book added successfully:', bookData);

          // ホームページに戻る前に少し待機（データの反映を待つ）
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          router.push('/');
          router.refresh(); // Next.jsのルーターリフレッシュを追加

        }

        retryCount++;
      }

      if (retryCount >= maxRetries) {
        throw new Error("タイムアウトしました（10分経過）。もう一度お試しください。");
      }

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : t.generationError);
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t.addBookTitle}</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <p>{error}</p>
          <p className="mt-2 text-sm">
            {t.retryMessage}
          </p>
        </div>
      )}

      {progress && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
          <p>{progress}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">{t.bookOverview}</label>
          <Textarea
            value={formData.bookContent}
            onChange={(e) => setFormData({ ...formData, bookContent: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2">{t.targetReaders}</label>
          <Textarea
            value={formData.targetReaders}
            onChange={(e) => setFormData({ ...formData, targetReaders: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2">{t.pageCount}</label>
          <Input
            type="number"
            value={formData.nPages}
            onChange={(e) => setFormData({ ...formData, nPages: Number(e.target.value) })}
            min="1"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t.generating : t.generateBook}
        </Button>
      </form>
    </div>
  );
}
