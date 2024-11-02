import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import pb from '@/lib/pocketbase';

export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const record = await pb.collection('books').getOne(id);
    if (!record?.pdf_path) {
      return NextResponse.json(
        { error: 'PDFが見つかりません' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', record.pdf_path);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${path.basename(record.pdf_path)}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'ファイルのダウンロードに失敗しました' },
      { status: 500 }
    );
  }
}
