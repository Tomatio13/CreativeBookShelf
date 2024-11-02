import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from "@/components/Layout";
import AuthProvider from '@/components/AuthProvider';
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookShelf',
  description: 'AI powered book generation system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
