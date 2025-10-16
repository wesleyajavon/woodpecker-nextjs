'use client'

import React from 'react'
import { useCart, useCartActions } from '@/hooks/useCart'

// Composant de test pour vérifier que la migration fonctionne
export function CartMigrationTest() {
  const cart = useCart()
  const { addToCart, clearCart } = useCartActions()

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
        🧪 Test de Migration du Panier
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">État du panier :</h4>
          <div className="text-sm space-y-1">
            <p>Items: <span className="font-mono">{cart.items?.length || 0}</span></p>
            <p>Total items: <span className="font-mono">{cart.totalItems || 0}</span></p>
            <p>Total price: <span className="font-mono">{cart.totalPrice || 0}€</span></p>
            <p>Is open: <span className="font-mono">{cart.isOpen ? 'Oui' : 'Non'}</span></p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Actions disponibles :</h4>
          <div className="text-sm space-y-1">
            <p>addToCart: <span className="font-mono">{typeof addToCart}</span></p>
            <p>clearCart: <span className="font-mono">{typeof clearCart}</span></p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => clearCart()}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Vider le panier
          </button>
        </div>

        <div className="text-xs text-blue-600 dark:text-blue-400">
          <p><strong>Status :</strong> {cart ? '✅ Panier accessible' : '❌ Panier undefined'}</p>
          <p><strong>Migration :</strong> {cart?.totalItems !== undefined ? '✅ Syntaxe correcte' : '❌ Syntaxe incorrecte'}</p>
        </div>
      </div>
    </div>
  )
}
