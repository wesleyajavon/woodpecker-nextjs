'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Music } from 'lucide-react'
import { useCart, useCartActions } from '@/hooks/useCart'
import CartItem from '@/components/CartItem'
import CartSummary from '@/components/CartSummary'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function CartPage() {
  const { cart } = useCart()
  const { clearCart } = useCartActions()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.items.length === 0) return

    try {
      setIsCheckingOut(true)
      
      // Prepare items for multi-item checkout
      const items = cart.items.map(item => ({
        priceId: item.beat.stripePriceId || item.beat.id,
        quantity: item.quantity,
        beatTitle: item.beat.title,
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
          cancelUrl: `${window.location.origin}/cart`,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/beats">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Beats</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                {cart.totalItems > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.items.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-lg text-gray-600 mb-8">
                Looks like you haven't added any beats to your cart yet. 
                Start building your music collection!
              </p>
              
              <div className="space-y-4">
                <Link href="/beats">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl">
                    <Music className="h-5 w-5 mr-2" />
                    Browse Beats
                  </Button>
                </Link>
                
                <div className="text-sm text-gray-500">
                  Discover our collection of premium beats from talented producers
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({cart.totalItems})
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem key={item.beat.id} item={item} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>
          </div>
        )}
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
  )
}
