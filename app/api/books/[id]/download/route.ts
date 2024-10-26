import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { openDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await openDb();
  const book = await db.get('SELECT * FROM books WHERE id = ?', params.id);
  
  if (!book || !book.pdfPath) {
    return NextResponse.json(
      { error: 'PDFが見つかりません' },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), 'public', book.pdfPath);
  
  // ファイルの存在確認
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'ファイルが見つかりません' },
      { status: 404 }
    );
  }

  // ファイルを読み込んでレスポンスとして返す
  const fileBuffer = fs.readFileSync(filePath);
  
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${path.basename(book.pdfPath)}"`,
    },
  });
}
