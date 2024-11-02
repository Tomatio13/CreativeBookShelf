'use client';

import { useState, useEffect } from 'react';
import { BookRecord } from '@/lib/pocketbase';
import pb from '@/lib/pocketbase';
import BookGrid from '@/components/BookGrid';

export function BooksLoader() {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    async function loadBooks() {
      try {
        const records = await pb.collection('books').getFullList<BookRecord>({
          sort: '-created',
        });
        console.log('Loaded books:', records);
        setBooks(records);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    }
    loadBooks();
  }, [lastUpdate]);

  const reloadBooks = () => {
    setLastUpdate(Date.now());
  };

  return <BookGrid books={books} onReload={reloadBooks} />;
} 