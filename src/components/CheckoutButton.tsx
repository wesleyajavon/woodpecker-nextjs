'use client'

import { useState } from 'react'
import { Button } from './ui/Button'

interface CheckoutButtonProps {
  priceId: string
  beatTitle: string
  price: number
  className?: string
  children?: React.ReactNode
  showPrice?: boolean
}

export default function CheckoutButton({ priceId, beatTitle, price, className, children, showPrice = true }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          beatTitle,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/beats`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Loading...' : children || (showPrice ? `Buy Now - €${price.toFixed(2)}` : 'Buy Now')}
    </Button>
  )
}
