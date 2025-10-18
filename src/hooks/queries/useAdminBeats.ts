import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Beat } from '@/types/beat'

// Types pour les réponses API admin
interface AdminBeatsResponse {
  success: boolean
  data: Beat[]
  error?: string
}

interface AdminBeatResponse {
  success: boolean
  data: Beat
  error?: string
}

// Clés de requête pour les beats admin
export const adminBeatKeys = {
  all: ['admin', 'beats'] as const,
  lists: () => [...adminBeatKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...adminBeatKeys.lists(), filters] as const,
  details: () => [...adminBeatKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminBeatKeys.details(), id] as const,
}

// Hook pour récupérer tous les beats admin (actifs et inactifs)
export function useAdminBeats(filters: {
  limit?: number
  includeInactive?: boolean
  page?: number
} = {}) {
  return useQuery({
    queryKey: adminBeatKeys.list(filters),
    queryFn: async (): Promise<Beat[]> => {
      const params = new URLSearchParams()
      
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.includeInactive) params.append('includeInactive', 'true')
      if (filters.page) params.append('page', filters.page.toString())

      const response = await fetch(`/api/admin/beats?${params}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des beats admin')
      }
      
      const result: AdminBeatsResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors du chargement des beats')
      }
      
      return result.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour récupérer un beat admin spécifique
export function useAdminBeat(id: string) {
  return useQuery({
    queryKey: adminBeatKeys.detail(id),
    queryFn: async (): Promise<Beat> => {
      const response = await fetch(`/api/admin/beats/${id}`)
      if (!response.ok) {
        throw new Error('Beat admin non trouvé')
      }
      
      const result: AdminBeatResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Beat admin non trouvé')
      }
      
      return result.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour créer un beat admin
export function useCreateAdminBeat() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (beatData: FormData): Promise<Beat> => {
      const response = await fetch('/api/admin/beats', {
        method: 'POST',
        body: beatData,
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la création du beat')
      }
      
      const result: AdminBeatResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la création du beat')
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: adminBeatKeys.lists() })
    },
  })
}

// Hook pour mettre à jour un beat admin
export function useUpdateAdminBeat() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Beat> }): Promise<Beat> => {
      const response = await fetch(`/api/admin/beats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du beat')
      }
      
      const result: AdminBeatResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour du beat')
      }
      
      return result.data
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le cache directement
      queryClient.setQueryData(adminBeatKeys.detail(variables.id), data)
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminBeatKeys.lists() })
    },
  })
}

// Hook pour supprimer un beat admin
export function useDeleteAdminBeat() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/admin/beats/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du beat')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression du beat')
      }
    },
    onSuccess: (_, id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: adminBeatKeys.detail(id) })
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminBeatKeys.lists() })
    },
  })
}

// Hook pour basculer le statut d'un beat (actif/inactif)
export function useToggleBeatStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<Beat> => {
      const response = await fetch(`/api/admin/beats/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })
      if (!response.ok) {
        throw new Error('Erreur lors du changement de statut')
      }
      
      const result: AdminBeatResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors du changement de statut')
      }
      
      return result.data
    },
    onSuccess: (data, variables) => {
      // Mettre à jour le cache directement
      queryClient.setQueryData(adminBeatKeys.detail(variables.id), data)
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: adminBeatKeys.lists() })
    },
  })
}
