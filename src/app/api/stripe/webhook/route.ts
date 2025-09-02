import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { OrderService } from '@/services/orderService'
import { BeatService } from '@/services/beatService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    let event

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    console.log('Received webhook event:', event.type)
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        console.log('Payment successful for session:', session.id)
        console.log('Session details:', {
          id: session.id,
          customer_email: session.customer_email,
          amount_total: session.amount_total,
          currency: session.currency
        })
        
        try {
          // Retrieve the full session details from Stripe
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'line_items.data.price.product']
          })

          if (!fullSession.line_items?.data[0]) {
            console.error('No line items found in session:', session.id)
            break
          }

          const lineItem = fullSession.line_items.data[0]
          const price = lineItem.price
          const product = price?.product

          if (!product || typeof product === 'string' || product.deleted) {
            console.error('Invalid or deleted product data in session:', session.id)
            break
          }

          // Get the beat ID from the product metadata
          console.log('Product metadata:', product.metadata)
          const beatId = product.metadata?.beat_id
          if (!beatId) {
            console.error('No beat_id found in product metadata:', product.id)
            console.error('Available metadata keys:', Object.keys(product.metadata || {}))
            break
          }
          
          console.log('Found beat_id:', beatId)

          // Get the beat details
          const beat = await BeatService.getBeatById(beatId)
          if (!beat) {
            console.error('Beat not found:', beatId)
            break
          }

          // Create the order in the database
          const orderData = {
            customerEmail: fullSession.customer_email || fullSession.customer_details?.email || 'unknown@example.com',
            customerName: fullSession.customer_details?.name || undefined,
            customerPhone: fullSession.customer_details?.phone || undefined,
            totalAmount: (fullSession.amount_total || 0) / 100, // Convert from cents
            currency: fullSession.currency?.toUpperCase() || 'EUR',
            paymentMethod: 'card',
            paymentId: session.id,
            licenseType: beat.isExclusive ? 'EXCLUSIVE' as const : 'NON_EXCLUSIVE' as const,
            usageRights: beat.isExclusive 
              ? ['Exclusive rights', 'Commercial use', 'Streaming', 'Distribution']
              : ['Non-exclusive rights', 'Commercial use', 'Streaming'],
            beatId: beatId
          }

          const order = await OrderService.createOrder(orderData)
          console.log('Order created successfully:', order.id)

        } catch (error) {
          console.error('Error processing checkout session:', error)
        }
        
        break
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        break
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
