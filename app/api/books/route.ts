import { NextResponse } from 'next/server'
import { openDb } from '@/lib/db'
// 動的APIルートの設定を追加
export const dynamic = 'force-dynamic'
// GET: 全ての本を取得
export async function GET() {
  const db = await openDb()
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      coverImage TEXT,
      description TEXT,
      pdfPath TEXT
    )
  `)
  
  const books = await db.all('SELECT * FROM books')
  return NextResponse.json(books)
}

// POST: 新しい本を追加
export async function POST(request: Request) {
  const db = await openDb()
  const { 
    title, 
    author, 
    coverImage, 
    description, 
    pdfPath
  } = await request.json()
  
  const result = await db.run(
    `INSERT INTO books (
      title, author, coverImage, description, pdfPath
    ) VALUES (?, ?, ?, ?, ?)`,
    [title, author, coverImage, description, pdfPath]
  )
  
  return NextResponse.json({ id: result.lastID })
}
