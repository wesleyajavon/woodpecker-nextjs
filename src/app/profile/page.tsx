'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Avatar from '@/components/Avatar'
import ProtectedRoute from '@/components/ProtectedRoute'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserProfile()
    }
  }, [session, status])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil')
      }
      
      const data = await response.json()
      setUser(data.user)
      setFormData({
        name: data.user.name || '',
        image: data.user.image || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil')
      }

      const data = await response.json()
      setUser(data.user)
      setSuccess('Profil mis à jour avec succès!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-700 shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Chargement du profil...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-800 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-700 shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <Avatar
                    src={user?.image}
                    name={user?.name ?? ''}
                    email={user?.email}
                    size="xl"
                    showName={false}
                  />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.name || 'Utilisateur'}
                </h1>
                <p className="text-lg text-gray-300 mb-2">{user?.email}</p>
                <p className="text-sm text-gray-400">
                  Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Profile Edit Form */}
              <div className="bg-gray-600 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-6">Modifier le profil</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Nom d&apos;affichage
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
                        placeholder="Votre nom d'affichage"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                        URL de l&apos;avatar
                      </label>
                      <input
                        type="url"
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="mt-2 text-sm text-gray-400">
                        Laissez vide pour utiliser l&apos;avatar par défaut
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="w-full sm:w-auto text-white"
                    >
                      Annuler
                    </Button> */}
                    <Button
                      type="submit"
                      disabled={updating}
                      className="w-full sm:w-auto"
                    >
                      {updating ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Account Information */}
              <div className="bg-gray-600 border border-gray-500 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Informations du compte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-300 mb-1">Email</dt>
                      <dd className="text-sm text-white break-all">{user?.email}</dd>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-300 mb-1">Email vérifié</dt>
                      <dd className="text-sm">
                        {user?.emailVerified ? (
                          <span className="inline-flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Non vérifié
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-300 mb-1">ID utilisateur</dt>
                      <dd className="text-sm text-white font-mono break-all">{user?.id}</dd>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-300 mb-1">Dernière mise à jour</dt>
                      <dd className="text-sm text-white">
                        {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}


