'use client'

import { useUserStore } from '@/stores/userStore'
import { User } from '@prisma/client'

// Hook principal pour accéder au store utilisateur
export function useUser() {
  return useUserStore()
}

// Hook pour obtenir les données utilisateur
export function useUserData(): User | null {
  return useUserStore(state => state.user)
}

// Hook pour vérifier l'authentification
export function useIsAuthenticated(): boolean {
  return useUserStore(state => state.isAuthenticated)
}

// Hook pour l'état de chargement
export function useUserLoading(): boolean {
  return useUserStore(state => state.isLoading)
}

// Hook pour les actions utilisateur
export function useUserActions() {
  const setUser = useUserStore(state => state.setUser)
  const setLoading = useUserStore(state => state.setLoading)
  const logout = useUserStore(state => state.logout)
  const updateUser = useUserStore(state => state.updateUser)

  return {
    setUser,
    setLoading,
    logout,
    updateUser
  }
}

// Hook pour définir l'utilisateur
export function useSetUser() {
  return useUserStore(state => state.setUser)
}

// Hook pour définir l'état de chargement
export function useSetLoading() {
  return useUserStore(state => state.setLoading)
}

// Hook pour la déconnexion
export function useLogout() {
  return useUserStore(state => state.logout)
}

// Hook pour mettre à jour l'utilisateur
export function useUpdateUser() {
  return useUserStore(state => state.updateUser)
}

// Hook pour obtenir les informations de profil
export function useUserProfile() {
  const user = useUserStore(state => state.user)
  
  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
    role: user?.role,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt
  }
}

// Hook pour vérifier si l'utilisateur est admin
export function useIsAdmin(): boolean {
  const user = useUserStore(state => state.user)
  return user?.role === 'ADMIN'
}

// Hook pour vérifier si l'utilisateur est premium
export function useIsPremium(): boolean {
  const user = useUserStore(state => state.user)
  return user?.role === 'PREMIUM'
}