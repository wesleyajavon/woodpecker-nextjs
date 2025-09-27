'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, Trash2, ArrowRight } from 'lucide-react'
import { useCart, useCartActions } from '@/hooks/useCart'
import { Button } from './ui/Button'
import { Beat } from '@/types/beat'
import { LicenseType } from '@/types/cart'

interface CartSummaryProps {
  onCheckout: () => void
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { cart } = useCart()
  const { clearCart } = useCartActions()
  const [isClearing, setIsClearing] = useState(false)

  // Helper function to get price based on license type
  const getPriceByLicense = (beat: Beat, licenseType: LicenseType): number => {
    switch (licenseType) {
      case 'WAV_LEASE':
        return beat.wavLeasePrice
      case 'TRACKOUT_LEASE':
        return beat.trackoutLeasePrice
      case 'UNLIMITED_LEASE':
        return beat.unlimitedLeasePrice
      default:
        return beat.wavLeasePrice
    }
  }

  // Helper function to get license display name
  const getLicenseDisplayName = (licenseType: LicenseType): string => {
    switch (licenseType) {
      case 'WAV_LEASE':
        return 'WAV Lease'
      case 'TRACKOUT_LEASE':
        return 'Trackout Lease'
      case 'UNLIMITED_LEASE':
        return 'Unlimited Lease'
      default:
        return 'WAV Lease'
    }
  }

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
        className="bg-gray-700 rounded-xl border border-gray-500 p-8 text-center"
      >
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
        <p className="text-gray-300 mb-6">
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
      className="bg-gray-700 rounded-xl border border-gray-500 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Order Summary</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={isClearing}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-500/50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Items Summary */}
      <div className="space-y-3 mb-6">
        {cart.items.map((item) => (
          <div key={`${item.beat.id}-${item.licenseType}`} className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{item.beat.title}</span>
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                  {getLicenseDisplayName(item.licenseType)}
                </span>
              </div>
              <span className="text-gray-400 text-xs">× {item.quantity}</span>
            </div>
            <span className="font-medium text-white">
              €{(getPriceByLicense(item.beat, item.licenseType) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-500 mb-6"></div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Items ({cart.totalItems})</span>
          <span className="text-white">€{cart.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Processing Fee</span>
          <span className="text-white">€0.00</span>
        </div>
        
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">VAT (21%)</span>
          <span className="text-white">€{(cart.totalPrice * 0.21).toFixed(2)}</span>
        </div> */}
        
        <div className="border-t border-gray-500 pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="text-white">Total</span>
            <span className="text-white">
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
      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Secure checkout powered by Stripe
      </p>
    </motion.div>
  )
}
