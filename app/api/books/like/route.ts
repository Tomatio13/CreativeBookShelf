import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: ユーザーがいいねした本のIDリストを取得
export async function GET() {
  const db = await openDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id)
    )
  `);
  
  const likes = await db.all('SELECT book_id FROM likes');
  return NextResponse.json(likes.map(like => like.book_id));
}

// POST: いいねを追加または削除
export async function POST(request: Request) {
  const db = await openDb();
  const { bookId, liked } = await request.json();
  
  if (liked) {
    // いいねを追加
    await db.run('INSERT INTO likes (book_id) VALUES (?)', bookId);
  } else {
    // いいねを削除
    await db.run('DELETE FROM likes WHERE book_id = ?', bookId);
  }
  
  return NextResponse.json({ success: true });
}
