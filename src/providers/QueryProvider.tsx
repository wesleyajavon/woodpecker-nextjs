'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Temps de cache par défaut
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
            // Retry automatique
            retry: (failureCount, error: any) => {
              // Ne pas retry sur les erreurs 4xx (erreurs client)
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              // Retry jusqu'à 3 fois pour les autres erreurs
              return failureCount < 3
            },
            // Refetch automatique
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false, // Pas de retry pour les mutations par défaut
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
