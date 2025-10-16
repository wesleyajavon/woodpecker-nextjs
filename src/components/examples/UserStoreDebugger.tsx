'use client'

import React from 'react'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/hooks/useAuthSync'
import { useIsAdmin } from '@/hooks/useUser'

// Composant de débogage pour vérifier l'état du userStore
export function UserStoreDebugger() {
  const userStore = useUserStore()
  const { isAuthenticated, isLoading, user } = useCurrentUser()
  const isAdminFromUser = useIsAdmin()

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
        🐛 UserStore Debugger
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* UserStore direct */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded">
          <h4 className="font-semibold mb-2">UserStore Direct</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              isAuthenticated: userStore.isAuthenticated,
              isLoading: userStore.isLoading,
              user: userStore.user ? {
                id: userStore.user.id,
                name: userStore.user.name,
                email: userStore.user.email,
                role: userStore.user.role
              } : null
            }, null, 2)}
          </pre>
        </div>

        {/* useCurrentUser */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded">
          <h4 className="font-semibold mb-2">useCurrentUser</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              isAuthenticated,
              isLoading,
              user: user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              } : null
            }, null, 2)}
          </pre>
        </div>

        {/* Hooks isAdmin */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded">
          <h4 className="font-semibold mb-2">Hooks isAdmin</h4>
          <div className="space-y-1">
            <p><strong>useIsAdmin:</strong> {isAdminFromUser ? '✅' : '❌'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded">
          <h4 className="font-semibold mb-2">Actions</h4>
          <div className="space-y-2">
            <button 
              onClick={() => {
                console.log('UserStore state:', userStore)
                console.log('Current user:', { isAuthenticated, isLoading, user })
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Log State
            </button>
            <button 
              onClick={() => {
                // Force refresh du profil
                window.location.reload()
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs"
            >
              Refresh Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
