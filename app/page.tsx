import BookGrid from '@/components/BookGrid';
import { Book } from '@/types/book';

async function getBooks() {
  const res = await fetch('http://localhost:3000/api/books', {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch books')
  }
  return res.json()
}

export default async function Home() {
  const books = await getBooks()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">本の一覧</h1>
        </div>
        <BookGrid books={books} />
      </div>
    </div>
  );
}
