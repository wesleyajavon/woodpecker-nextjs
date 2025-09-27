import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSessionWithLicense, createCheckoutSessionWithPriceId } from '@/lib/stripe'
import { LicenseType } from '@/types/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { beatId, licenseType, beatTitle, price, successUrl, cancelUrl, priceId } = body

    if (!beatId || !licenseType || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let session

    if (priceId) {
      // Utiliser la nouvelle méthode avec priceId
      session = await createCheckoutSessionWithPriceId({
        priceId,
        beatId,
        licenseType: licenseType as LicenseType,
        beatTitle,
        successUrl,
        cancelUrl
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
        cancelUrl
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






