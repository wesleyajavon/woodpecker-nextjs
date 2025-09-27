'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart, useCartActions } from '@/hooks/useCart'
import { Beat } from '@/types/beat'
import AddToCartButton from '@/components/AddToCartButton'
import CartItem from '@/components/CartItem'
import CartSummary from '@/components/CartSummary'
import { Button } from '@/components/ui/Button'
import { LicenseType } from '@/types/cart'

// Mock beat data for testing
const mockBeats: Beat[] = [
  {
    id: '1',
    title: 'Dark Trap Beat',
    description: 'A dark and heavy trap beat perfect for rap',
    genre: 'Trap',
    bpm: 140,
    key: 'A minor',
    duration: '3:45',
    wavLeasePrice: 19.99,
    trackoutLeasePrice: 39.99,
    unlimitedLeasePrice: 79.99,
    rating: 4.8,
    reviewCount: 24,
    tags: ['dark', 'trap', 'heavy'],
    stripeWavPriceId: 'price_1Q1234567890abcdef',
    stripeTrackoutPriceId: 'price_1Q1234567890abcdef_trackout',
    stripeUnlimitedPriceId: 'price_1Q1234567890abcdef_unlimited',
    previewUrl: null,
    fullUrl: null,
    isExclusive: true,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Chill Lo-Fi',
    description: 'Relaxing lo-fi beat for studying or relaxing',
    genre: 'Lo-Fi',
    bpm: 85,
    key: 'C major',
    duration: '2:30',
    wavLeasePrice: 19.99,
    trackoutLeasePrice: 39.99,
    unlimitedLeasePrice: 79.99,
    rating: 4.6,
    reviewCount: 18,
    tags: ['chill', 'lo-fi', 'relaxing'],
    stripeWavPriceId: 'price_1Q2345678901bcdefg',
    stripeTrackoutPriceId: 'price_1Q2345678901bcdefg_trackout',
    stripeUnlimitedPriceId: 'price_1Q2345678901bcdefg_unlimited',
    previewUrl: null,
    fullUrl: null,
    isExclusive: false,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Upbeat Pop',
    description: 'Energetic pop beat with catchy melodies',
    genre: 'Pop',
    bpm: 120,
    key: 'G major',
    duration: '3:15',
    wavLeasePrice: 24.99,
    trackoutLeasePrice: 49.99,
    unlimitedLeasePrice: 99.99,
    rating: 4.9,
    reviewCount: 31,
    tags: ['pop', 'upbeat', 'catchy'],
    stripeWavPriceId: 'price_1Q3456789012cdefgh',
    stripeTrackoutPriceId: 'price_1Q3456789012cdefgh_trackout',
    stripeUnlimitedPriceId: 'price_1Q3456789012cdefgh_unlimited',
    previewUrl: null,
    fullUrl: null,
    isExclusive: false,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function CartTestPage() {
  const { cart } = useCart()
  const { clearCart } = useCartActions()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Helper function to get the correct priceId based on license type
  const getPriceIdByLicense = (beat: Beat, licenseType: LicenseType): string | null => {
    switch (licenseType) {
      case 'WAV_LEASE':
        return beat.stripeWavPriceId || null
      case 'TRACKOUT_LEASE':
        return beat.stripeTrackoutPriceId || null
      case 'UNLIMITED_LEASE':
        return beat.stripeUnlimitedPriceId || null
      default:
        return beat.stripeWavPriceId || null
    }
  }

  const handleCheckout = async () => {
    if (cart.items.length === 0) return

    try {
      setIsCheckingOut(true)
      
      // Prepare items for multi-item checkout
      const items = cart.items.map(item => ({
        priceId: getPriceIdByLicense(item.beat, item.licenseType) || item.beat.id,
        quantity: item.quantity,
        beatTitle: item.beat.title,
        licenseType: item.licenseType,
      }))

      // Filter out items without valid price IDs
      const validItems = items.filter(item => item.priceId)
      
      if (validItems.length === 0) {
        throw new Error('No valid items found for checkout')
      }

      const response = await fetch('/api/stripe/create-multi-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: validItems,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart-test`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Clear cart after successful checkout initiation
      clearCart()
      
      // Redirect to Stripe Checkout
      window.location.href = url
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Failed to start checkout: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cart Test Page</h1>
          <p className="text-gray-600 mb-6">
            Test the cart functionality by adding beats and managing your cart
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Items in cart: </span>
              <span className="font-semibold text-purple-600">{cart.totalItems}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Total: </span>
              <span className="font-semibold text-green-600">€{cart.totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={clearCart}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Beats */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Beats</h2>
              <div className="space-y-4">
                {mockBeats.map((beat) => (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {beat.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{beat.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span>{beat.genre}</span>
                          <span>•</span>
                          <span>{beat.bpm} BPM</span>
                          <span>•</span>
                          <span>{beat.key}</span>
                          <span>•</span>
                          <span>{beat.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            €{beat.wavLeasePrice.toFixed(2)}
                          </span>
                          {beat.isExclusive && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                              EXCLUSIVE
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <AddToCartButton
                          beat={beat}
                          licenseType="WAV_LEASE"
                          size="md"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {cart.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 text-center"
                >
                  <div className="text-gray-400 text-4xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 text-sm">
                    Add some beats to see them here!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h3>
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <CartItem key={item.beat.id} item={item} />
                      ))}
                    </div>
                  </div>
                  
                  <CartSummary onCheckout={handleCheckout} />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Checkout</h3>
              <p className="text-gray-600">Please wait while we prepare your order...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
