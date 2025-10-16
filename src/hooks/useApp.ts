'use client'

import { useAppStore } from '@/stores/appStore'

// Hook principal pour l'app
export function useApp() {
  return useAppStore()
}

// Hooks spécialisés pour la langue
export function useLanguage() {
  return useAppStore(state => state.language)
}

export function useSetLanguage() {
  return useAppStore(state => state.setLanguage)
}

export function useTranslation() {
  const t = useAppStore(state => state.t)
  return { t }
}

// Hooks spécialisés pour la sidebar
export function useSidebar() {
  return useAppStore(state => state.sidebarOpen)
}

export function useToggleSidebar() {
  return useAppStore(state => state.toggleSidebar)
}

export function useSetSidebarOpen() {
  return useAppStore(state => state.setSidebarOpen)
}

// Hooks spécialisés pour les notifications
export function useNotifications() {
  return useAppStore(state => state.notifications)
}

export function useAddNotification() {
  return useAppStore(state => state.addNotification)
}

export function useRemoveNotification() {
  return useAppStore(state => state.removeNotification)
}

export function useClearNotifications() {
  return useAppStore(state => state.clearNotifications)
}

// Hook combiné pour les actions de notification
export function useNotificationActions() {
  const addNotification = useAppStore(state => state.addNotification)
  const removeNotification = useAppStore(state => state.removeNotification)
  const clearNotifications = useAppStore(state => state.clearNotifications)

  return {
    addNotification,
    removeNotification,
    clearNotifications,
  }
}
