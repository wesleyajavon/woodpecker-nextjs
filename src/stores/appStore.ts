import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations } from '@/lib/translations'

export type Language = 'fr' | 'en'

interface AppState {
  language: Language
  sidebarOpen: boolean
  notifications: Notification[]
}

interface AppActions {
  setLanguage: (language: Language) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  t: (key: string, params?: Record<string, string | number>) => string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Fonction pour naviguer dans les objets de traduction
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key]
    }
    return undefined
  }, obj) || path
}

// Fonction pour remplacer les paramètres dans les traductions
function replaceParams(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // État initial
      language: 'fr',
      sidebarOpen: false,
      notifications: [],

      // Actions
      setLanguage: (language) => {
        set({ language })
      },

      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification = { ...notification, id }
        set(state => ({ 
          notifications: [...state.notifications, newNotification] 
        }))
        
        // Auto-remove après la durée spécifiée
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration)
        }
      },

      removeNotification: (id) => {
        set(state => ({ 
          notifications: state.notifications.filter(n => n.id !== id) 
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Fonction de traduction
      t: (key: string, params?: Record<string, string | number>) => {
        const { language } = get()
        const translation = translations[language]
        const text = getNestedValue(translation, key)
        return replaceParams(text, params)
      },
    }),
    {
      name: 'loutsider-app',
      partialize: (state) => ({ 
        language: state.language
      }), // ne persiste que la langue
    }
  )
)
