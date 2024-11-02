'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import pb from '@/lib/pocketbase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations } from '@/lib/i18n/translations'

export default function LoginPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await pb.collection('users').authWithPassword(
        formData.email,
        formData.password
      );

      window.location.href = '/'
    } catch (error: any) {
      console.error('Login error:', error)
      setError(t.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
          >
            {language === 'en' ? t.switchToJapanese : t.switchToEnglish}
          </Button>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t.login}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t.email}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t.password}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t.processing : t.login}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {t.noAccount}
          </Link>
        </div>
      </div>
    </div>
  )
}
