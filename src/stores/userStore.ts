import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name?: string
  email: string
  image?: string
  role: 'USER' | 'ADMIN'
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface UserActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateUser: (updates) => {
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
      },
    }),
    {
      name: 'loutsider-user',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)
