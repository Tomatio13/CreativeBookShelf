import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: ユーザーがいいねした本のIDリストを取得
export async function GET() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return NextResponse.json([]);
  }

  const { data: likes, error } = await supabase
    .from('likes')
    .select('book_id')
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(likes.map(like => like.book_id));
}

// POST: いいねを追加または削除
export async function POST(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookId, liked } = await request.json();
  
  if (liked) {
    // いいねを追加
    const { error } = await supabase
      .from('likes')
      .insert([
        {
          book_id: bookId,
          user_id: session.user.id,
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // いいねを削除
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('book_id', bookId)
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
  return NextResponse.json({ success: true });
}
