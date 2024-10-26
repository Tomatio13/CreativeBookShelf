import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string; // 'pdf' または 'cover'
  
  if (!file) {
    return NextResponse.json(
      { error: 'ファイルがありません' },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // ファイルの保存先を決定
  const uploadDir = type === 'pdf' ? 'books' : 'covers';
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', uploadDir, filename);
  
  try {
    await writeFile(filepath, buffer);
    return NextResponse.json({ 
      filename,
      path: `/uploads/${uploadDir}/${filename}` 
    });
  } catch (error) {
    console.error('ファイル保存エラー:', error);
    return NextResponse.json(
      { error: 'ファイルの保存に失敗しました' },
      { status: 500 }
    );
  }
}
