'use client'

import React, { useState, useEffect } from 'react'
import { clearCartStorage, checkCartStorage, migrateCartData } from '@/utils/cartStorage'

export function CartDebugger() {
  const [storageStatus, setStorageStatus] = useState<{oldCart: boolean, newCart: boolean}>({oldCart: false, newCart: false})
  const [oldCartData, setOldCartData] = useState<string>('')
  const [newCartData, setNewCartData] = useState<string>('')

  useEffect(() => {
    const status = checkCartStorage()
    setStorageStatus(status)
    
    if (typeof window !== 'undefined') {
      setOldCartData(localStorage.getItem('loutsider-cart') || '')
      setNewCartData(localStorage.getItem('loutsider-cart-zustand') || '')
    }
  }, [])

  const handleClearStorage = () => {
    clearCartStorage()
    setStorageStatus({oldCart: false, newCart: false})
    setOldCartData('')
    setNewCartData('')
  }

  const handleMigrateData = () => {
    const success = migrateCartData()
    if (success) {
      const status = checkCartStorage()
      setStorageStatus(status)
      setNewCartData(localStorage.getItem('loutsider-cart-zustand') || '')
    }
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
        🔧 Débogage du Panier
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">État du localStorage :</h4>
          <div className="text-sm space-y-1">
            <p>Ancien système: <span className="font-mono">{storageStatus.oldCart ? '✅ Présent' : '❌ Absent'}</span></p>
            <p>Nouveau système: <span className="font-mono">{storageStatus.newCart ? '✅ Présent' : '❌ Absent'}</span></p>
          </div>
        </div>

        {oldCartData && (
          <div>
            <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Données ancien système :</h4>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
              {oldCartData}
            </pre>
          </div>
        )}

        {newCartData && (
          <div>
            <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Données nouveau système :</h4>
            <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
              {newCartData}
            </pre>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleClearStorage}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Nettoyer localStorage
          </button>
          <button
            onClick={handleMigrateData}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Migrer les données
          </button>
        </div>

        <div className="text-xs text-red-600 dark:text-red-400">
          <p><strong>Note :</strong> Utilisez ces outils si vous rencontrez des erreurs de localStorage.</p>
        </div>
      </div>
    </div>
  )
}
