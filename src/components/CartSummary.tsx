'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, Trash2, ArrowRight } from 'lucide-react'
import { useCart, useCartActions } from '@/hooks/useCart'
import { Button } from './ui/Button'
import { Beat } from '@/types/beat'
import { LicenseType } from '@/types/cart'
import { useTranslation } from '@/contexts/LanguageContext'

interface CartSummaryProps {
  onCheckout: () => void
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { cart } = useCart()
  const { clearCart } = useCartActions()
  const [isClearing, setIsClearing] = useState(false)
  const { t } = useTranslation()

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
        return t('licenses.wavLease')
      case 'TRACKOUT_LEASE':
        return t('licenses.trackoutLease')
      case 'UNLIMITED_LEASE':
        return t('licenses.unlimitedLease')
      default:
        return t('licenses.wavLease')
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
        className="bg-card/10 backdrop-blur-lg rounded-xl border border-border/20 p-8 text-center"
      >
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">{t('cart.empty')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('cart.emptyDescriptionShort')}
        </p>
        <Button
          onClick={() => window.location.href = '/beats'}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {t('cart.browseBeat')}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/10 backdrop-blur-lg rounded-xl border border-border/20 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">{t('cart.orderSummary')}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={isClearing}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-500/50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t('cart.clearCart')}
        </Button>
      </div>

      {/* Cart Items Summary */}
      <div className="space-y-3 mb-6">
        {cart.items.map((item) => (
          <div key={`${item.beat.id}-${item.licenseType}`} className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{item.beat.title}</span>
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full">
                  {getLicenseDisplayName(item.licenseType)}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">× {item.quantity}</span>
            </div>
            <span className="font-medium text-foreground">
              €{(getPriceByLicense(item.beat, item.licenseType) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border/20 mb-6"></div>

      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.items')} ({cart.totalItems})</span>
          <span className="text-foreground">€{cart.totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.processingFee')}</span>
          <span className="text-foreground">€0.00</span>
        </div>
        
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">VAT (21%)</span>
          <span className="text-foreground">€{(cart.totalPrice * 0.21).toFixed(2)}</span>
        </div> */}
        
        <div className="border-t border-border/20 pt-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="text-foreground">{t('common.total')}</span>
            <span className="text-foreground">
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
        {t('cart.proceedToCheckout')}
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>

      {/* Security Notice */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        🔒 {t('cart.secureCheckout')}
      </p>
    </motion.div>
  )
}
