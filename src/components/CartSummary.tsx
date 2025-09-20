'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, Trash2, ArrowRight } from 'lucide-react'
import { useCart, useCartActions } from '@/hooks/useCart'
import { Button } from './ui/Button'

interface CartSummaryProps {
  onCheckout: () => void
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { cart } = useCart()
  const { clearCart } = useCartActions()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }

  if (cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-8 text-center"
      >
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">
          Add some beats to get started with your music production journey!
        </p>
        <Button
          onClick={() => window.location.href = '/beats'}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Browse Beats
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={isClearing}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Items Summary */}
      <div className="space-y-3 mb-6">
        {cart.items.map((item) => (
          <div key={item.beat.id} className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <span className="font-medium text-gray-900">{item.beat.title}</span>
              <span className="text-gray-500 ml-2">× {item.quantity}</span>
            </div>
            <span className="font-medium text-gray-900">
              €{(item.beat.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Items ({cart.totalItems})</span>
          <span className="text-gray-900">€{cart.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Processing Fee</span>
          <span className="text-gray-900">€0.00</span>
        </div>
        
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">VAT (21%)</span>
          <span className="text-gray-900">€{(cart.totalPrice * 0.21).toFixed(2)}</span>
        </div> */}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              {/* €{(cart.totalPrice * 1.21).toFixed(2)} */}
              €{cart.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Proceed to Checkout
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center mt-4">
        🔒 Secure checkout powered by Stripe
      </p>
    </motion.div>
  )
}
