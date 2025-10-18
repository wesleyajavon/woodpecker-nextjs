'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/stores/userStore'
import { User } from '@prisma/client'

// Hook pour synchroniser le userStore avec NextAuth
export function useAuthSync() {
  const { data: session, status } = useSession()
  const { setUser, setLoading, logout } = useUserStore()

  // Fonction utilitaire pour convertir null en undefined
  const nullToUndefined = <T>(value: T | null): T | undefined => {
    return value === null ? undefined : value
  }

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (status === 'unauthenticated') {
      setLoading(false)
      logout()
      return
    }

    if (session?.user) {
      // Récupérer le profil complet avec le rôle depuis l'API
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
                const user: User = {
                  id: data.user.id || '',
                  name: nullToUndefined(data.user.name ?? session.user?.name),
                  email: data.user.email || session.user?.email || '',
                  image: data.user.image || session.user?.image || null,
                  role: data.user.role || 'USER',
                  emailVerified: data.user.emailVerified ? new Date(data.user.emailVerified) : null,
                  createdAt: data.user.createdAt ? new Date(data.user.createdAt) : new Date(),
                  updatedAt: data.user.updatedAt ? new Date(data.user.updatedAt) : new Date()
                }
            setUser(user)
          } else {
            // Fallback si l'API échoue
            const user: User = {
              id: '',
              name: session.user?.name || null,
              email: session.user?.email || '',
              image: session.user?.image || null,
              role: 'USER',
              emailVerified: null,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            setUser(user)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          // Fallback en cas d'erreur
          const user: User = {
            id: '',
            name: session.user?.name || null,
            email: session.user?.email || '',
            image: session.user?.image || null,
            role: 'USER',
            emailVerified: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          setUser(user)
        } finally {
          setLoading(false)
        }
      }

      fetchUserProfile()
    }
  }, [session, status, setUser, setLoading, logout])

  return {
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    user: session?.user
  }
}

// Hook pour obtenir l'utilisateur actuel avec synchronisation NextAuth
export function useCurrentUser() {
  const { isAuthenticated, isLoading, user } = useAuthSync()
  const userStore = useUserStore()

  return {
    isAuthenticated: isAuthenticated || userStore.isAuthenticated,
    isLoading: isLoading || userStore.isLoading,
    user: userStore.user || user
  }
}
