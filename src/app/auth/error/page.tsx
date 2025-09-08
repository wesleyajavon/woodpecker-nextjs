'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const errorMessages: Record<string, string> = {
  Configuration: 'Il y a un problème avec la configuration du serveur.',
  AccessDenied: 'Vous n\'avez pas l\'autorisation de vous connecter.',
  Verification: 'Le token de vérification a expiré ou a déjà été utilisé.',
  Default: 'Une erreur inattendue s\'est produite.'
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Erreur de connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full"
          >
            Réessayer
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Retour à l&apos;accueil
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-600">
              Code d&apos;erreur: <code className="font-mono">{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Chargement...
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  )
}


