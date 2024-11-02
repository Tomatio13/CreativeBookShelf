'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import pb from '@/lib/pocketbase'

const AuthContext = createContext<{
  user: any
  signOut: () => Promise<void>
}>({
  user: null,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pocketbaseの認証状態を監視
    pb.authStore.onChange((token, model) => {
      setUser(model)
      if (!model && !['/login', '/signup'].includes(pathname)) {
        router.push('/login')
      }
    })

    // 初期認証状態の確認
    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          setUser(pb.authStore.model)
        } else if (!['/login', '/signup'].includes(pathname)) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const signOut = async () => {
    pb.authStore.clear()
    router.push('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
