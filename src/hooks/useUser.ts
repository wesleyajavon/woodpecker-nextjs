'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export function useUser() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      fetchUserData()
    }
  }, [session, status])

  const fetchUserData = async () => {
    if (!session?.user?.email) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données utilisateur')
      }
      
      const data = await response.json()
      setUserData(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return {
    user: userData,
    session,
    loading: loading || status === 'loading',
    error,
    isAuthenticated: status === 'authenticated',
    refetch: fetchUserData
  }
}







