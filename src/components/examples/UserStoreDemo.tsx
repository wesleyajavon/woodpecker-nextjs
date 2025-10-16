'use client'

import React from 'react'
import { useUserStore } from '@/stores/userStore'
import { 
  useUserData, 
  useIsAuthenticated, 
  useUserLoading, 
  useUserActions,
  useIsAdmin,
  useIsPremium 
} from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { User, LogIn, LogOut, Shield, Crown, Loader2 } from 'lucide-react'

// Composant de démonstration du userStore
export function UserStoreDemo() {
  const { user, isAuthenticated, isLoading } = useUserStore()
  const { setUser, setLoading, logout, updateUser } = useUserActions()
  const isAdmin = useIsAdmin()
  const isPremium = useIsPremium()

  // Simulation d'un utilisateur de test
  const mockUser = {
    id: 'test-user-123',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://via.placeholder.com/40',
    role: 'USER' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockAdminUser = {
    ...mockUser,
    id: 'admin-user-456',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN' as const
  }

  const mockPremiumUser = {
    ...mockUser,
    id: 'premium-user-789',
    name: 'Premium User',
    email: 'premium@example.com',
    role: 'PREMIUM' as const
  }

  const handleLogin = async (userType: 'user' | 'admin' | 'premium') => {
    setLoading(true)
    
    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userToLogin = userType === 'admin' ? mockAdminUser : 
                       userType === 'premium' ? mockPremiumUser : mockUser
    
    setUser(userToLogin)
    setLoading(false)
  }

  const handleLogout = () => {
    logout()
  }

  const handleUpdateProfile = () => {
    if (user) {
      updateUser({
        ...user,
        name: `${user.name} (Updated)`,
        updatedAt: new Date()
      })
    }
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
      <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-6">
        👤 UserStore en Action - Gestion des Utilisateurs
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* État de connexion */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            État de Connexion
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p><strong>Connecté:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? 'Oui' : 'Non'}
                </span>
              </p>
              <p><strong>Chargement:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isLoading ? 'En cours...' : 'Terminé'}
                </span>
              </p>
            </div>
            
            {isLoading && (
              <div className="flex items-center text-sm text-gray-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connexion en cours...
              </div>
            )}
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profil Utilisateur
          </h4>
          
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="text-sm">
                <p><strong>Nom:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rôle:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    user.role === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </p>
                <p><strong>Admin:</strong> {isAdmin ? '✅' : '❌'}</p>
                <p><strong>Premium:</strong> {isPremium ? '✅' : '❌'}</p>
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Mettre à jour le profil
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun utilisateur connecté</p>
          )}
        </div>

        {/* Actions de connexion */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm md:col-span-2">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <LogIn className="h-4 w-4 mr-2" />
            Actions de Connexion
          </h4>
          
          <div className="space-y-3">
            {!isAuthenticated ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={() => handleLogin('user')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  Connexion Utilisateur
                </Button>
                <Button 
                  onClick={() => handleLogin('premium')}
                  disabled={isLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Connexion Premium
                </Button>
                <Button 
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Connexion Admin
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* État du store */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          📊 État Actuel du UserStore
        </h5>
        <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
          {JSON.stringify({
            isAuthenticated,
            isLoading,
            user: user ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            } : null,
            isAdmin,
            isPremium
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
