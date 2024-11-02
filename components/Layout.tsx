"use client";

import { BookOpen, BookPlus, Library, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations } from '@/lib/i18n/translations'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  // ログイン・サインアップ画面ではサイドバーを表示しない
  if (['/login', '/signup'].includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">{t.bookshelf}</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              >
                {language === 'en' ? '日本語' : 'English'}
              </Button>
              <span className="text-sm">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.logout}</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* サイドバー */}
        <aside className="w-64 border-r bg-gray-50 fixed left-0 h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <Link
              href="/"
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                pathname === "/" ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Library className="h-5 w-5" />
              <span>{t.bookList}</span>
            </Link>
            <Link
              href="/add-book"
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                pathname === "/add-book" ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <BookPlus className="h-5 w-5" />
              <span>{t.addBook}</span>
            </Link>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
