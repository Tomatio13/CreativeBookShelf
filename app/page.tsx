'use client';

import { BooksLoader } from '@/app/components/BooksLoader';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.bookList}</h1>
        </div>
        <BooksLoader />
      </div>
    </div>
  );
}
