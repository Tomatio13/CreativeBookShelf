import { BooksLoader } from '@/app/components/BooksLoader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">本の一覧</h1>
        </div>
        <BooksLoader />
      </div>
    </div>
  );
}
