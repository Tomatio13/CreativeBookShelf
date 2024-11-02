import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// PocketBaseのURLを適切に変換する関数
function convertPocketBaseUrl(url: string): string {
  if (!url) return url;
  const publicUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
  return url.replace(pb.baseUrl, publicUrl);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがありません' },
        { status: 400 }
      );
    }

    const collectionName = type === 'pdf' ? 'book_files' : 'book_covers';
    
    const fileData = new FormData();
    fileData.append('file', file);

    const record = await pb.collection(collectionName).create(fileData);

    // URLを適切に変換
    // const fileUrl = convertPocketBaseUrl(pb.files.getUrl(record, record.file));
    const fileUrl = pb.files.getUrl(record, record.file);
    
    return NextResponse.json({ 
      filename: record.id,
      path: fileUrl
    });
  } catch (error) {
    console.error('ファイル保存エラー:', error);
    return NextResponse.json(
      { error: 'ファイルの保存に失敗しました' },
      { status: 500 }
    );
  }
}
