import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export const dynamic = 'force-dynamic';

interface Like {
  id: string;
  book_id: string;
  user_id: string;
}

// サーバーサイドでのPocketBase URLの設定
const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL?.replace('localhost', 'pocketbase');
if (pocketbaseUrl) {
  pb.baseUrl = pocketbaseUrl;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const mode = searchParams.get('mode');

  if (!user_id && mode !== 'count') {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  try {
    if (mode === 'count') {
      const likes = await pb.collection('likes').getFullList<Like>();
      
      const countsMap = likes.reduce((acc: Record<string, number>, curr: Like) => {
        acc[curr.book_id] = (acc[curr.book_id] || 0) + 1;
        return acc;
      }, {});

      return NextResponse.json(countsMap);
    }

    const likes = await pb.collection('likes').getFullList<Like>({
      filter: `user_id = "${user_id}"`,
    });

    return NextResponse.json(likes.map(like => like.book_id));
  } catch (error) {
    console.error('Error in GET /api/books/like:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { bookId, liked, user_id } = await request.json();
    
    if (liked) {
      await pb.collection('likes').create({
        book_id: bookId,
        user_id: user_id,
      });
    } else {
      const likes = await pb.collection('likes').getFullList<Like>({
        filter: `book_id = "${bookId}" && user_id = "${user_id}"`,
      });
      
      if (likes.length > 0) {
        await pb.collection('likes').delete(likes[0].id);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}
