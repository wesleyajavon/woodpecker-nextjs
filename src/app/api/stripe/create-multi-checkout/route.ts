import { NextRequest, NextResponse } from 'next/server'
import { createMultiItemCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Success URL and Cancel URL are required' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of items) {
      if (!item.priceId || !item.quantity || !item.beatTitle) {
        return NextResponse.json(
          { error: 'Each item must have priceId, quantity, and beatTitle' },
          { status: 400 }
        )
      }
      
      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Quantity must be greater than 0' },
          { status: 400 }
        )
      }
    }

    // Create multi-item checkout session
    const session = await createMultiItemCheckoutSession(items, successUrl, cancelUrl)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })

  } catch (error) {
    console.error('Error creating multi-item checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
