'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/types/order'

interface DownloadUrls {
  master: string
  stems?: string
  expiresAt: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [downloadUrls, setDownloadUrls] = useState<DownloadUrls | null>(null)
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false)

  useEffect(() => {
    if (sessionId) {
      // Fetch real order details from the database using the session ID
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/orders/payment/${sessionId}`)
          
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              setOrderDetails(result.data)
            } else {
              console.error('Failed to fetch order:', result.error)
            }
          } else {
            console.error('Failed to fetch order details')
          }
        } catch (error) {
          console.error('Error fetching order details:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrderDetails()
    } else {
      setIsLoading(false)
    }
  }, [sessionId])

  const generateDownloadUrls = async () => {
    if (!orderDetails) return

    setIsGeneratingDownload(true)
    try {
      const response = await fetch(`/api/download/beat/${orderDetails.beat.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderDetails.id,
          customerEmail: orderDetails.customerEmail
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setDownloadUrls(result.data.downloadUrls)
        } else {
          console.error('Failed to generate download URLs:', result.error)
        }
      } else {
        console.error('Failed to generate download URLs')
      }
    } catch (error) {
      console.error('Error generating download URLs:', error)
    } finally {
      setIsGeneratingDownload(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Session
          </h1>
          <p className="text-gray-600 mb-6">
            No session ID found. Please complete your purchase to access this page.
          </p>
          <Link 
            href="/beats"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Beats
          </Link>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find your order details. This might be because the payment is still processing.
          </p>
          <div className="space-y-3">
            <Link 
              href="/beats"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Beats
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement réussi !
        </h1>
        
        <p className="text-gray-600 mb-6">
          Merci pour votre achat ! Votre beat est maintenant disponible au téléchargement.
        </p>
        
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Détails de la commande</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">ID de commande:</span> {orderDetails.id}</p>
              <p><span className="font-medium">Beat:</span> {orderDetails.beat.title}</p>
              <p><span className="font-medium">Montant:</span> €{orderDetails.totalAmount.toFixed(2)}</p>
              <p><span className="font-medium">Statut:</span> {orderDetails.status}</p>
              <p><span className="font-medium">Licence:</span> {orderDetails.licenseType}</p>
            </div>
          </div>
        )}

        {/* Section de téléchargement */}
        {orderDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger votre beat
            </h3>
            
            {!downloadUrls ? (
              <div className="text-center">
                <p className="text-sm text-blue-700 mb-3">
                  Cliquez sur le bouton ci-dessous pour générer vos liens de téléchargement sécurisés.
                </p>
                <button
                  onClick={generateDownloadUrls}
                  disabled={isGeneratingDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingDownload ? 'Génération...' : 'Générer les liens de téléchargement'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-blue-700">
                  Vos liens de téléchargement sont prêts ! Ils expirent dans 30 minutes.
                </p>
                
                <div className="space-y-2">
                  <a
                    href={downloadUrls.master}
                    download
                    className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                    </svg>
                    Télécharger le master (WAV)
                  </a>
                  
                  {downloadUrls.stems && (
                    <a
                      href={downloadUrls.stems}
                      download
                      className="block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-center"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                      </svg>
                      Télécharger les stems (ZIP)
                    </a>
                  )}
                </div>
                
                <p className="text-xs text-blue-600">
                  ⏰ Expire le {new Date(downloadUrls.expiresAt).toLocaleString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          <Link 
            href="/beats"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Découvrir d&apos;autres beats
          </Link>
          
          <Link 
            href="/profile"
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Aller au profil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
