'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return
      }

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            const userRole = data.user?.role
            setIsAdmin(userRole === 'ADMIN')
          } else {
            setIsAdmin(false)
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      }
      
      setLoading(false)
    }

    checkAdminStatus()
  }, [session, status, router])

  if (loading || isAdmin === null) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      )
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Accès refusé
          </h2>
          <p className="text-gray-600">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}




