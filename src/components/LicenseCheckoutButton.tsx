'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Beat } from '@/types/beat'
import { LicenseType } from '@/types/cart'

interface LicenseCheckoutButtonProps {
  beat: Beat
  licenseType: LicenseType
  className?: string
  children?: React.ReactNode
  showPrice?: boolean
}

export default function LicenseCheckoutButton({ 
  beat, 
  licenseType, 
  className, 
  children, 
  showPrice = true 
}: LicenseCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getPrice = (beat: Beat, licenseType: LicenseType): number => {
    switch (licenseType) {
      case 'WAV_LEASE': return beat.wavLeasePrice
      case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
      case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
      default: return beat.wavLeasePrice
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getPriceId = (beat: Beat, licenseType: LicenseType): string | null => {
    switch (licenseType) {
      case 'WAV_LEASE': return beat.stripeWavPriceId || null
      case 'TRACKOUT_LEASE': return beat.stripeTrackoutPriceId || null
      case 'UNLIMITED_LEASE': return beat.stripeUnlimitedPriceId || null
      default: return beat.stripeWavPriceId || null
    }
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      
      const priceId = getPriceId(beat, licenseType)
      
      if (!priceId) {
        // Fallback: utiliser l'ancienne méthode avec price_data
        console.warn('No Stripe priceId found, using fallback method')
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            beatId: beat.id,
            licenseType,
            beatTitle: beat.title,
            price: getPrice(beat, licenseType),
            successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/beats`,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        window.location.href = url
      } else {
        // Utiliser la nouvelle méthode avec priceId
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            beatId: beat.id,
            licenseType,
            beatTitle: beat.title,
            successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/beats`,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create checkout session')
        }

        const { url } = await response.json()
        window.location.href = url
      }
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const price = getPrice(beat, licenseType)

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Chargement...' : children || (showPrice ? `Acheter - ${formatPrice(price)}` : 'Acheter')}
    </Button>
  )
}
