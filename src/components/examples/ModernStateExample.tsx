'use client'

import React from 'react'
import { useBeats, useFeaturedBeats } from '@/hooks/queries/useBeats'
import { useCartStore, useAppStore } from '@/stores'
import { useLoading, useError, useModal } from '@/hooks/local'
import BeatCard from '@/components/BeatCard'
import { CartDebugger } from './CartDebugger'
import { CartMigrationTest } from './CartMigrationTest'
import { UnusedStoresDemo } from './UnusedStoresDemo'
import { AppStoreDemo } from './AppStoreDemo'
import { UserStoreDemo } from './UserStoreDemo'
import { UserStoreDebugger } from './UserStoreDebugger'

// Exemple d'utilisation de l'architecture moderne
export function ModernStateExample() {
  // 🏠 État local avec hooks personnalisés
  const { isLoading: localLoading, startLoading, stopLoading } = useLoading()
  const { error, setErrorMessage, clearError } = useError()
  const { isOpen: modalOpen, open: openModal, close: closeModal } = useModal()

  // 🌐 État global UI avec Zustand
  const { language, setLanguage } = useAppStore()
  const { totalItems, totalPrice, clearCart } = useCartStore()

  // 🔁 État serveur avec TanStack Query
  const { 
    data: beats, 
    isLoading: beatsLoading, 
    error: beatsError 
  } = useBeats({ 
    page: 1, 
    limit: 10,
    sortBy: 'newest'
  })

  const { 
    data: featuredBeats, 
    isLoading: featuredLoading 
  } = useFeaturedBeats()

  // Gestion des erreurs
  React.useEffect(() => {
    if (beatsError) {
      setErrorMessage('Erreur lors du chargement des beats')
    }
  }, [beatsError, setErrorMessage])

  const handleLanguageToggle = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  const handleClearCart = () => {
    clearCart()
    openModal()
  }

  if (beatsLoading || featuredLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Architecture Moderne de Gestion d'État</h1>
      
      {/* État global UI */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🌐 État Global UI (Zustand)</h2>
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>✅ Migration terminée :</strong> L'application utilise maintenant entièrement le nouveau système Zustand. 
            Plus d'ancien CartContext !
          </p>
        </div>
        <div className="space-y-2">
          <p>Langue actuelle: <span className="font-mono">{language}</span></p>
          <p>Articles dans le panier: <span className="font-mono">{totalItems}</span></p>
          <p>Total du panier: <span className="font-mono">{totalPrice}€</span></p>
          <div className="space-x-2">
            <button 
              onClick={handleLanguageToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Changer la langue
            </button>
            <button 
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>

      {/* Débogage */}
      <CartDebugger />

      {/* Test de migration */}
      <CartMigrationTest />

      {/* Stores non utilisés */}
      <UnusedStoresDemo />

      {/* AppStore en action */}
      <AppStoreDemo />

      {/* UserStore en action */}
      <UserStoreDemo />

      {/* Debugger UserStore */}
      <UserStoreDebugger />

      {/* État local */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🏠 État Local (useState/useReducer)</h2>
        <div className="space-y-2">
          <p>Chargement local: <span className="font-mono">{localLoading ? 'Oui' : 'Non'}</span></p>
          <p>Erreur: <span className="font-mono">{error || 'Aucune'}</span></p>
          <p>Modal ouverte: <span className="font-mono">{modalOpen ? 'Oui' : 'Non'}</span></p>
          <div className="space-x-2">
            <button 
              onClick={startLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Démarrer chargement
            </button>
            <button 
              onClick={stopLoading}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Arrêter chargement
            </button>
            <button 
              onClick={() => setErrorMessage('Erreur de test')}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Simuler erreur
            </button>
            <button 
              onClick={clearError}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Effacer erreur
            </button>
          </div>
        </div>
      </div>

      {/* État serveur */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔁 État Serveur (TanStack Query)</h2>
        <div className="space-y-4">
          <p>Beats chargés: <span className="font-mono">{beats?.beats?.length || 0}</span></p>
          <p>Beats en vedette: <span className="font-mono">{featuredBeats?.beats?.length || 0}</span></p>
          
          {/* Affichage des beats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beats?.beats?.slice(0, 3).map((beat) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal d'exemple */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Panier vidé !</h3>
            <p className="mb-4">Le panier a été vidé avec succès.</p>
            <button 
              onClick={closeModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
