import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSessionWithLicense, createCheckoutSessionWithPriceId } from '@/lib/stripe'
import { LicenseType } from '@/types/cart'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { beatId, licenseType, beatTitle, price, successUrl, cancelUrl, priceId } = body

    console.log('🔍 Checkout API received:', { beatId, licenseType, beatTitle, price, priceId })

    if (!beatId || !licenseType || !successUrl || !cancelUrl) {
      console.log('❌ Missing required fields:', { beatId: !!beatId, licenseType: !!licenseType, successUrl: !!successUrl, cancelUrl: !!cancelUrl })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let session
    let actualPrice = price

    // Si priceId est fourni mais pas de price, récupérer le prix depuis Stripe
    if (priceId && !price) {
      try {
        const stripePrice = await stripe.prices.retrieve(priceId)
        actualPrice = (stripePrice.unit_amount || 0) / 100
        console.log('🔍 Retrieved price from Stripe:', actualPrice)
      } catch (error) {
        console.error('❌ Error retrieving price from Stripe:', error)
        return NextResponse.json(
          { error: 'Invalid price ID' },
          { status: 400 }
        )
      }
    }

    // Créer une commande PENDING avant la session Stripe
    const pendingOrder = await prisma.order.create({
      data: {
        customerEmail: 'pending@checkout.com', // Sera mis à jour par le webhook
        totalAmount: actualPrice,
        currency: 'EUR',
        paymentMethod: 'card',
        paymentId: 'pending', // Sera mis à jour par le webhook
        licenseType: licenseType as LicenseType,
        usageRights: [], // Sera mis à jour par le webhook
        beatId: beatId,
        status: OrderStatus.PENDING
      }
    })

    console.log('✅ Created PENDING order:', pendingOrder.id)

    if (priceId) {
      // Utiliser la nouvelle méthode avec priceId
      session = await createCheckoutSessionWithPriceId({
        priceId,
        beatId,
        licenseType: licenseType as LicenseType,
        beatTitle,
        successUrl,
        cancelUrl,
        orderId: pendingOrder.id // Passer l'ID de la commande
      })
    } else {
      // Fallback: utiliser l'ancienne méthode avec price_data
      if (!price) {
        return NextResponse.json(
          { error: 'Price is required when priceId is not provided' },
          { status: 400 }
        )
      }
      
      session = await createCheckoutSessionWithLicense({
        beatId,
        licenseType: licenseType as LicenseType,
        beatTitle,
        price,
        successUrl,
        cancelUrl,
        orderId: pendingOrder.id // Passer l'ID de la commande
      })
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}






