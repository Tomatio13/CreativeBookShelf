import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
// 動的APIルートの設定を追加
export const dynamic = 'force-dynamic'
// GET: 全ての本を取得
export async function GET() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(books);
}

// POST: 新しい本を追加
export async function POST(request: Request) {
  try {
    const { title, author, coverImage, description, pdfPath } = await request.json();

    // 必須フィールドの検証
    if (!title || !author) {
      return NextResponse.json(
        { error: 'タイトルと著者は必須です' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title,
          author,
          cover_image: coverImage,
          description,
          pdf_path: pdfPath,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `データベースエラー: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: '本の登録に失敗しました' },
        { status: 500 }
      );
    }

    console.log('Inserted book:', data); // デバッグ用ログ
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
