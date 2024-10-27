"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBook() {
  const router = useRouter();
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
    setProgress("本の生成を開始しています...");

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
      const maxRetries = 60; // 10分のタイムアウト（10秒 × 60）

      while (status === "processing" && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒待機
        const statusResponse = await fetch(`/api/ai/task/${task_id}`);
        const statusData = await statusResponse.json();
        status = statusData.status;

        // エラーチェック
        if (statusData.detail) {
          throw new Error(statusData.detail);
        }

        if (status === "failed") {
          throw new Error("本の生成に失敗しました");
        }

        // 進捗状況の更新
        setProgress(`本を生成中です... (${Math.min(Math.round((retryCount + 1) / maxRetries * 100), 95)}%)`);

        if (status === "completed") {
          setProgress("本の生成が完了しました。ファイルを処理中...");
          
          // PDFとカバー画像をダウンロード
          const [pdfResponse, coverResponse] = await Promise.all([
            fetch(`/api/ai/download/${task_id}`),
            fetch(`/api/ai/download-cover/${task_id}`),
          ]);

          const pdfBlob = await pdfResponse.blob();
          const coverBlob = await coverResponse.blob();

          setProgress("ファイルをアップロード中...");

          // ファイルをアップロード
          const pdfFormData = new FormData();
          pdfFormData.append("file", pdfBlob, `${task_id}.pdf`);
          pdfFormData.append("type", "pdf");

          const coverFormData = new FormData();
          coverFormData.append("file", coverBlob, `${task_id}.png`);
          coverFormData.append("type", "cover");

          const [pdfUpload, coverUpload] = await Promise.all([
            fetch("/api/upload", { method: "POST", body: pdfFormData }),
            fetch("/api/upload", { method: "POST", body: coverFormData }),
          ]);

          const [pdfPath, coverPath] = await Promise.all([
            pdfUpload.json(),
            coverUpload.json(),
          ]);

          // 本をデータベースに追加
          try {
            const response = await fetch("/api/books", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: statusData.title,
                author: statusData.author,
                coverImage: coverPath.path,
                description: formData.bookContent,
                pdfPath: pdfPath.path,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || '本の登録に失敗しました');
            }

            const bookData = await response.json();
            console.log('Book added successfully:', bookData);

            router.push("/");
          } catch (error) {
            console.error("Error adding book to database:", error);
            setError(error instanceof Error ? error.message : "本の登録に失敗しました");
            setIsLoading(false);
            setProgress("");
            return; // エラーが発生した場合は処理を中断
          }

        }

        retryCount++;
      }

      if (retryCount >= maxRetries) {
        throw new Error("タイムアウトしました（10分経過）。もう一度お試しください。");
      }

    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">本の追加</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <p>{error}</p>
          <p className="mt-2 text-sm">
            もう一度生成をお試しください。問題が解決しない場合は、入力内容を変更してみてください。
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
          <label className="block mb-2">本の概要</label>
          <Textarea
            value={formData.bookContent}
            onChange={(e) => setFormData({ ...formData, bookContent: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2">想定読者</label>
          <Textarea
            value={formData.targetReaders}
            onChange={(e) => setFormData({ ...formData, targetReaders: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2">想定ページ数</label>
          <Input
            type="number"
            value={formData.nPages}
            onChange={(e) => setFormData({ ...formData, nPages: Number(e.target.value) })}
            min="1"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "生成中..." : "本を生成"}
        </Button>
      </form>
    </div>
  );
}
