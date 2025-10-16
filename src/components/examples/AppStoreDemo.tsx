'use client'

import React from 'react'
import { useAppStore } from '@/stores'
import { useTranslation, useLanguage, useSetLanguage } from '@/hooks/useApp'
import { Bell, Sidebar, Languages, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Composant de démonstration de l'appStore en actio`
export function AppStoreDemo() {
  const { sidebarOpen, notifications } = useAppStore()
  const { t } = useTranslation()
  const language = useLanguage()
  const setLanguage = useSetLanguage()
  const { toggleSidebar, addNotification, clearNotifications } = useAppStore()

  const handleAddNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: t('common.success'), message: t('common.loading') },
      error: { title: t('common.error'), message: 'Une erreur est survenue' },
      warning: { title: 'Attention', message: 'Ceci est un avertissement' },
      info: { title: 'Information', message: 'Voici une information utile' }
    }

    addNotification({
      type,
      ...messages[type],
      duration: 5000
    })
  }

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
      <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-6">
        🚀 AppStore en Action - Démonstration Complète
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Langue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            Système de Langues
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p><strong>Langue actuelle:</strong> <span className="font-mono uppercase">{language}</span></p>
              <p><strong>Traduction test:</strong> <span className="font-mono">"{t('common.loading')}"</span></p>
            </div>
            
            <Button onClick={toggleLanguage} className="w-full">
              Changer vers {language === 'fr' ? 'EN' : 'FR'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <Sidebar className="h-4 w-4 mr-2" />
            Gestion Sidebar
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p><strong>État:</strong> <span className="font-mono">{sidebarOpen ? 'Ouvert' : 'Fermé'}</span></p>
            </div>
            
            <Button onClick={toggleSidebar} className="w-full">
              {sidebarOpen ? 'Fermer' : 'Ouvrir'} Sidebar
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm md:col-span-2">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Système de Notifications
          </h4>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p><strong>Notifications actives:</strong> <span className="font-mono">{notifications.length}</span></p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                onClick={() => handleAddNotification('success')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                Succès
              </Button>
              <Button 
                onClick={() => handleAddNotification('error')}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                Erreur
              </Button>
              <Button 
                onClick={() => handleAddNotification('warning')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                size="sm"
              >
                Avertissement
              </Button>
              <Button 
                onClick={() => handleAddNotification('info')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                Information
              </Button>
            </div>
            
            {notifications.length > 0 && (
              <Button 
                onClick={clearNotifications}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer toutes les notifications
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* État du store */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          📊 État Actuel du Store
        </h5>
        <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
          {JSON.stringify({
            language,
            sidebarOpen,
            notificationsCount: notifications.length,
            sampleTranslation: t('common.loading')
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
