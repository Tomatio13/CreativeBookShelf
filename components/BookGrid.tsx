"use client";

import { Book } from '@/types/book';
import { Heart, Download } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SearchBar from './SearchBar';
import { useAuth } from './AuthProvider';

interface BookGridProps {
  books: Book[];
}

// デフォルトのカバー画像のパスを設定
const DEFAULT_COVER_IMAGE = '/covers/default-cover.jpg';

export default function BookGrid({ books }: BookGridProps) {
  const { user } = useAuth();
  const [likedBooks, setLikedBooks] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // いいね数を取得する関数
  const fetchLikeCounts = async () => {
    try {
      const response = await fetch('/api/books/like?mode=count');
      const counts = await response.json();
      setLikeCounts(counts);
    } catch (error) {
      console.error('Failed to fetch like counts:', error);
    }
  };

  // 初期読み込み時にいいね情報を取得
  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/books/like?userId=${user.id}`);
        const likedBookIds = await response.json();
        setLikedBooks(new Set(likedBookIds));
      } catch (error) {
        console.error('Failed to fetch likes:', error);
      }
    };
    
    fetchLikes();
    fetchLikeCounts(); // いいね数も取得
  }, [user]);

  const toggleLike = async (bookId: number) => {
    if (!user) return;

    try {
      const newLiked = !likedBooks.has(bookId);
      
      await fetch('/api/books/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookId, 
          liked: newLiked,
          userId: user.id
        }),
      });
      
      setLikedBooks(prev => {
        const newSet = new Set(prev);
        if (newLiked) {
          newSet.add(bookId);
        } else {
          newSet.delete(bookId);
        }
        return newSet;
      });

      // いいねを更新した後、カウントも更新
      setLikeCounts(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || 0) + (newLiked ? 1 : -1)
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // 検索クエリに基づいて本をフィルタリング
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">検索結果が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4]">
                <Image
                  src={book.cover_image ? book.cover_image : DEFAULT_COVER_IMAGE}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <div className="flex justify-end gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleLike(book.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          likedBooks.has(book.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                    <span className="text-sm text-gray-500">
                      {likeCounts[book.id] || 0}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(book.pdf_path || '', '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
