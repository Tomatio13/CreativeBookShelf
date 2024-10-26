"use client";

import { BookPlus, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <div className="w-64 bg-gray-100 p-4">
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
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
