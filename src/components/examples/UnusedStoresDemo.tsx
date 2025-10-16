'use client'

import React from 'react'
import { useAppStore, useUserStore } from '@/stores'

// Composant de démonstration pour les stores non utilisés
export function UnusedStoresDemo() {
  const appStore = useAppStore()
  const userStore = useUserStore()

  const handleAddNotification = () => {
    appStore.addNotification({
      type: 'success',
      title: 'Notification de test',
      message: 'Ceci est une notification créée avec Zustand !',
      duration: 3000
    })
  }

  const handleThemeChange = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(appStore.theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    appStore.setTheme(nextTheme)
  }

  const handleLanguageChange = () => {
    appStore.setLanguage(appStore.language === 'fr' ? 'en' : 'fr')
  }

  const handleMockUser = () => {
    if (userStore.user) {
      userStore.logout()
    } else {
      userStore.setUser({
        id: 'demo-user',
        name: 'Utilisateur Demo',
        email: 'demo@example.com',
        role: 'USER'
      })
    }
  }

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
        🚀 Stores Zustand Non Utilisés - Démonstration
      </h3>
      
      <div className="space-y-6">
        {/* App Store Demo */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
            🌐 App Store (État Global de l'Application)
          </h4>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Thème:</strong> <span className="font-mono">{appStore.theme}</span></p>
                <p><strong>Langue:</strong> <span className="font-mono">{appStore.language}</span></p>
                <p><strong>Sidebar:</strong> <span className="font-mono">{appStore.sidebarOpen ? 'Ouvert' : 'Fermé'}</span></p>
                <p><strong>Notifications:</strong> <span className="font-mono">{appStore.notifications.length}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleThemeChange}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Changer thème
              </button>
              <button
                onClick={handleLanguageChange}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Changer langue
              </button>
              <button
                onClick={() => appStore.toggleSidebar()}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Toggle sidebar
              </button>
              <button
                onClick={handleAddNotification}
                className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
              >
                Ajouter notification
              </button>
            </div>

            {/* Notifications */}
            {appStore.notifications.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Notifications actives:</h5>
                {appStore.notifications.map(notification => (
                  <div key={notification.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      notification.type === 'success' ? 'bg-green-100 text-green-800' :
                      notification.type === 'error' ? 'bg-red-100 text-red-800' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {notification.type}
                    </span>
                    <span>{notification.title}</span>
                    <button
                      onClick={() => appStore.removeNotification(notification.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => appStore.clearNotifications()}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Effacer toutes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Store Demo */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
            👤 User Store (État Utilisateur)
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p><strong>Authentifié:</strong> <span className="font-mono">{userStore.isAuthenticated ? 'Oui' : 'Non'}</span></p>
              <p><strong>Chargement:</strong> <span className="font-mono">{userStore.isLoading ? 'Oui' : 'Non'}</span></p>
              {userStore.user && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p><strong>Nom:</strong> {userStore.user.name}</p>
                  <p><strong>Email:</strong> {userStore.user.email}</p>
                  <p><strong>Rôle:</strong> {userStore.user.role}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleMockUser}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                {userStore.user ? 'Se déconnecter' : 'Se connecter (demo)'}
              </button>
              <button
                onClick={() => userStore.setLoading(!userStore.isLoading)}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Toggle loading
              </button>
            </div>
          </div>
        </div>

        {/* Explication */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            💡 Pourquoi ces stores ne sont pas utilisés ?
          </h5>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <p><strong>App Store:</strong> Votre app utilise encore LanguageContext et ThemeProvider</p>
            <p><strong>User Store:</strong> Votre app utilise NextAuth pour l'authentification</p>
            <p><strong>Migration possible:</strong> Ces stores peuvent remplacer les systèmes actuels</p>
          </div>
        </div>
      </div>
    </div>
  )
}
