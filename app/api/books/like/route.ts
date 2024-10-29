import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Erica_One } from 'next/font/google';

export const dynamic = 'force-dynamic';

// GET: ユーザーがいいねした本のIDリストを取得
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const mode = searchParams.get('mode');

  if (mode === 'count') {
    // 各本のいいね数を取得
    const { data: likes, error } = await supabase
      .from('likes')
      .select('book_id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 手動でカウントを集計
    const countsMap = likes.reduce((acc, curr) => {
      acc[curr.book_id] = (acc[curr.book_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json(countsMap);
  }

  const { data: { session } } = await supabase.auth.getSession();
  

  const { data: likes, error } = await supabase
    .from('likes')
    .select('book_id')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(likes.map(like => like.book_id));
}

// POST: いいねを追加または削除
export async function POST(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  
 

  const { bookId, liked, userId } = await request.json();
  
  if (liked) {
    // いいねを追加
    const { error } = await supabase
      .from('likes')
      .insert([
        {
          book_id: bookId,
          user_id: userId,
        },
      ]);

    if (error) {
      console.log(error.message)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // いいねを削除
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('book_id', bookId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  return NextResponse.json({ success: true });
}
