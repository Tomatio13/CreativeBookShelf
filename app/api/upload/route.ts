import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

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

    let collectionName;
    switch (type) {
      case 'pdf':
        collectionName = 'book_files';
        break;
      case 'cover':
        collectionName = 'book_covers';
        break;
      case 'wav':
        collectionName = 'book_wav';
        break;
      default:
        return NextResponse.json(
          { error: '不正なファイルタイプです' },
          { status: 400 }
        );
    }

    // FormDataの作成
    const fileData = new FormData();
    fileData.append('file', file);

    try {
      const record = await pb.collection(collectionName).create(fileData);
      const fileUrl = pb.files.getUrl(record, record.file);
      
      return NextResponse.json({ 
        filename: record.id,
        path: fileUrl
      });
    } catch (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }

  } catch (error) {
    console.error('ファイル保存エラー:', error);
    return NextResponse.json(
      { error: 'ファイルの保存に失敗しました' },
      { status: 500 }
    );
  }
}
