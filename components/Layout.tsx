"use client";

import { BookOpen,BookPlus,Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
        <div className="flex items-center justify-center h-full px-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">BookShelf</span>
          </Link>
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
              <span>本の一覧</span>
            </Link>
            <Link
              href="/add-book"
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                pathname === "/add-book" ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <BookPlus className="h-5 w-5" />
              <span>本の追加</span>
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
