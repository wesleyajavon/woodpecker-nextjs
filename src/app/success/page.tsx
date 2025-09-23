'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, Music, Clock, Tag, Star } from 'lucide-react'
import { Order, MultiItemOrder } from '@/types/order'
import { Beat } from '@/types/beat'
import { useSession } from 'next-auth/react'

interface DownloadUrls {
  master: string
  expiresAt: string
}

interface BeatDownloadUrls {
  beatId: string
  beatTitle: string
  downloadUrls: DownloadUrls
}

interface MultiOrderDownloadData {
  orderId: string
  customerEmail: string
  beats: BeatDownloadUrls[]
  expiresAt: string
}

function SuccessContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [multiOrderDetails, setMultiOrderDetails] = useState<MultiItemOrder | null>(null)
  const [downloadUrls, setDownloadUrls] = useState<DownloadUrls | null>(null)
  const [multiOrderDownloads, setMultiOrderDownloads] = useState<MultiOrderDownloadData | null>(null)
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false)
  const [isMultiItemOrder, setIsMultiItemOrder] = useState(false)

  useEffect(() => {
    if (sessionId) {
      // Try to fetch multi-item order first, then fallback to single order
      const fetchOrderDetails = async () => {
        try {
          // First try multi-item order
          const multiResponse = await fetch(`/api/orders/multi-payment/${sessionId}`)
          
          if (multiResponse.ok) {
            const multiResult = await multiResponse.json()
            if (multiResult.success) {
              setMultiOrderDetails(multiResult.data)
              setIsMultiItemOrder(true)
              setIsLoading(false)
              return
            }
          }

          // Fallback to single order
          const response = await fetch(`/api/orders/payment/${sessionId}`)
          
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              setOrderDetails(result.data)
              setIsMultiItemOrder(false)
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

  const generateMultiOrderDownloadUrls = async () => {
    if (!multiOrderDetails) return

    setIsGeneratingDownload(true)
    try {
      const response = await fetch(`/api/download/multi-order/${multiOrderDetails.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: multiOrderDetails.customerEmail
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMultiOrderDownloads(result.data)
        } else {
          console.error('Failed to generate multi-order download URLs:', result.error)
        }
      } else {
        console.error('Failed to generate multi-order download URLs')
      }
    } catch (error) {
      console.error('Error generating multi-order download URLs:', error)
    } finally {
      setIsGeneratingDownload(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="max-w-md w-full bg-gray-700 rounded-lg shadow-lg p-8 text-center border border-gray-600">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20">
              <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Invalid Session
          </h1>
          <p className="text-gray-300 mb-6">
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

  if (!orderDetails && !multiOrderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="max-w-md w-full bg-gray-700 rounded-lg shadow-lg p-8 text-center border border-gray-600">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-900/20">
              <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-300 mb-6">
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
    <div className="min-h-screen bg-gray-800 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700 rounded-2xl shadow-xl overflow-hidden border border-gray-600"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white mb-6"
            >
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            </motion.div>
        
            <h1 className="text-3xl font-bold text-white mb-4">
          Paiement réussi !
        </h1>
        
            <p className="text-green-100 text-lg">
              {isMultiItemOrder 
                ? `Merci pour votre achat ! Vos ${multiOrderDetails?.items.length || 0} beats sont maintenant disponibles au téléchargement.`
                : 'Merci pour votre achat ! Votre beat est maintenant disponible au téléchargement.'
              }
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {isMultiItemOrder && multiOrderDetails ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Détails de la commande</h2>
                
                <div className="bg-gray-600 rounded-xl p-6 mb-6 border border-gray-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">ID de commande:</span>
                      <p className="text-white font-mono">{multiOrderDetails.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Email:</span>
                      <p className="text-white">{multiOrderDetails.customerEmail}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Montant total:</span>
                      <p className="text-white text-lg font-semibold">€{multiOrderDetails.totalAmount}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Statut:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/20 text-green-300 border border-green-500/30">
                        {multiOrderDetails.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Beats List */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-white">Beats achetés</h3>
                  {multiOrderDetails.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-600 border border-gray-500 rounded-xl p-4 hover:shadow-md hover:shadow-gray-900/20 transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.beat.title}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Music className="h-4 w-4 mr-1" />
                              {item.beat.genre}
                            </span>
                            <span>{(item.beat as Beat).bpm} BPM</span>
                            <span>{(item.beat as Beat).key}</span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {(item.beat as Beat).duration}
                            </span>
                            {(item.beat as Beat).isExclusive && (
                              <span className="flex items-center text-purple-400">
                                <Tag className="h-4 w-4 mr-1" />
                                Exclusive
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">€{(item.unitPrice * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-400">€{item.unitPrice} × {item.quantity}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : orderDetails && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Détails de la commande</h2>
                
                <div className="bg-gray-600 rounded-xl p-6 border border-gray-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">ID de commande:</span>
                      <p className="text-white font-mono">{orderDetails.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Beat:</span>
                      <p className="text-white">{orderDetails.beat.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Montant:</span>
                      <p className="text-white text-lg font-semibold">€{orderDetails.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Statut:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/20 text-green-300 border border-green-500/30">
                        {orderDetails.status}
                      </span>
                    </div>
                  </div>
            </div>
          </div>
        )}

            {/* Download Section */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                <Download className="w-6 h-6 mr-2" />
                Télécharger vos beats
            </h3>
            
              {isMultiItemOrder ? (
                // Multi-item downloads
                !multiOrderDownloads ? (
                  <div className="text-center">
                    <p className="text-blue-300 mb-4">
                      Cliquez sur le bouton ci-dessous pour générer vos liens de téléchargement sécurisés.
                    </p>
                    <button
                      onClick={generateMultiOrderDownloadUrls}
                      disabled={isGeneratingDownload}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {isGeneratingDownload ? 'Génération...' : 'Générer les liens de téléchargement'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-blue-300">
                      Vos liens de téléchargement sont prêts ! Ils expirent dans 30 minutes.
                    </p>
                    
                    <div className="space-y-4">
                      {multiOrderDownloads.beats.map((beatDownload, index) => (
                        <motion.div
                          key={beatDownload.beatId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-600 rounded-lg p-4 border border-blue-500/30"
                        >
                          <h4 className="font-semibold text-white mb-3">{beatDownload.beatTitle}</h4>
                          
                          <div className="space-y-2">
                            <a
                              href={beatDownload.downloadUrls.master}
                              download
                              className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                            >
                              <Download className="w-4 h-4 inline mr-2" />
                              Télécharger le master (WAV)
                            </a>
                            
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="text-xs text-blue-400 text-center">
                      ⏰ Expire le {new Date(multiOrderDownloads.expiresAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )
              ) : (
                // Single item downloads
                !downloadUrls ? (
              <div className="text-center">
                    <p className="text-blue-300 mb-4">
                  Cliquez sur le bouton ci-dessous pour générer vos liens de téléchargement sécurisés.
                </p>
                <button
                  onClick={generateDownloadUrls}
                  disabled={isGeneratingDownload}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isGeneratingDownload ? 'Génération...' : 'Générer les liens de téléchargement'}
                </button>
              </div>
            ) : (
                  <div className="space-y-4">
                    <p className="text-blue-300">
                  Vos liens de téléchargement sont prêts ! Ils expirent dans 30 minutes.
                </p>
                
                <div className="space-y-2">
                  <a
                    href={downloadUrls.master}
                    download
                        className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                  >
                        <Download className="w-4 h-4 inline mr-2" />
                    Télécharger le master (WAV)
                  </a>
                  
                </div>
                
                    <p className="text-xs text-blue-400 text-center">
                  ⏰ Expire le {new Date(downloadUrls.expiresAt).toLocaleString('fr-FR')}
                </p>
              </div>
                )
            )}
          </div>
        
            {/* Action Buttons */}
            <div className={`flex gap-4 ${session ? 'flex-col sm:flex-row' : 'justify-center'}`}>
              <Link 
                href="/beats"
                className={`${session ? 'flex-1' : 'w-full max-w-xs'} bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold`}
              >
                Découvrir d&apos;autres beats
              </Link>
              
              {session && (
                <Link 
                  href="/profile"
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold"
                >
                  Aller au profil
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
