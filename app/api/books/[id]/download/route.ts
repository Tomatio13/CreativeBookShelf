import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data: book, error } = await supabase
    .from('books')
    .select('pdf_path')
    .eq('id', params.id)
    .single();
  
  if (error || !book?.pdf_path) {
    return NextResponse.json(
      { error: 'PDFが見つかりません' },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), 'public', book.pdf_path);
  
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
      'Content-Disposition': `attachment; filename="${path.basename(book.pdf_path)}"`,
    },
  });
}
