import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { OrderService } from '@/services/orderService'
import { BeatService } from '@/services/beatService'
import { sendOrderConfirmationEmail } from '@/services/orderEmailService'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { LicenseType } from '@/types/cart'
import Stripe from 'stripe'

const prisma = new PrismaClient()

// Type definitions for Stripe webhook events
type StripeCheckoutSession = Stripe.Checkout.Session
type StripePaymentIntent = Stripe.PaymentIntent
type StripeDispute = Stripe.Dispute
type StripeCharge = Stripe.Charge
type StripeLineItem = Stripe.LineItem
type StripePrice = Stripe.Price
type StripeProduct = Stripe.Product

interface OrderStatusUpdateData {
  reason?: string
  cancelledAt?: Date
  failedAt?: Date
  failureCode?: string
  disputedAt?: Date
  disputeId?: string
  disputeReason?: string
  refundedAt?: Date
  refundId?: string
  refundAmount?: number
}

interface OrderItem {
  beatId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderData {
  customerEmail: string
  customerName?: string
  customerPhone?: string
  totalAmount: number
  currency: string
  paymentMethod: string
  paymentId: string
  licenseType: LicenseType
  usageRights: string[]
  beatId: string
  status: string
}

// Helper function to get usage rights based on license type
function getUsageRights(licenseType: string): string[] {
  switch (licenseType) {
    case 'WAV_LEASE':
      return ['WAV/MP3 files', 'Commercial use', 'Streaming', 'Limited distribution']
    case 'TRACKOUT_LEASE':
      return ['WAV/MP3 files', 'Stems', 'Commercial use', 'Streaming', 'Extended distribution']
    case 'UNLIMITED_LEASE':
      return ['WAV/MP3 files', 'Stems', 'Commercial use', 'Streaming', 'Unlimited distribution']
    case 'EXCLUSIVE':
      return ['Exclusive rights', 'WAV/MP3 files', 'Stems', 'Commercial use', 'Streaming', 'Unlimited distribution']
    default:
      return ['WAV/MP3 files', 'Commercial use', 'Streaming']
  }
}

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

    let event: Stripe.Event

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
        await handleSuccessfulPayment(event.data.object as StripeCheckoutSession)
        break
        
      case 'checkout.session.expired':
        await handleExpiredSession(event.data.object as StripeCheckoutSession)
        break
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as StripePaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
        
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object as StripePaymentIntent)
        break
        
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as StripeDispute)
        break
        
      case 'charge.refunded':
        await handleRefunded(event.data.object as StripeCharge)
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

// Handle successful payment
async function handleSuccessfulPayment(session: StripeCheckoutSession) {
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

          if (!fullSession.line_items?.data || fullSession.line_items.data.length === 0) {
            console.error('No line items found in session:', session.id)
      return
          }

          const lineItems = fullSession.line_items.data
          const isMultiItem = lineItems.length > 1 || fullSession.metadata?.order_id

          if (isMultiItem) {
            await handleMultiItemOrder(fullSession, lineItems)
          } else {
            await handleSingleItemOrder(fullSession, lineItems[0])
          }

  } catch (error) {
    console.error('Error processing checkout session:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Handle expired/cancelled session
async function handleExpiredSession(session: StripeCheckoutSession) {
  console.log('Session expired:', session.id)
  
  try {
    // Update order status to CANCELLED
    await updateOrderStatus(session.id, OrderStatus.CANCELLED, {
      reason: 'Session expired',
      cancelledAt: new Date()
    })
    
    console.log('Order cancelled due to expired session:', session.id)
  } catch (error) {
    console.error('Error handling expired session:', error)
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent: StripePaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    // Find the order by payment ID
    const order = await findOrderByPaymentId(paymentIntent.id)
    
    if (order) {
      await updateOrderStatus(paymentIntent.id, 'FAILED' as OrderStatus, {
        reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        failedAt: new Date(),
        failureCode: paymentIntent.last_payment_error?.code
      })
      
      console.log('Order marked as failed:', order.id)
      
      // Send failure notification email
      try {
        await sendPaymentFailureEmail(order.customerEmail, order.id, paymentIntent.last_payment_error?.message)
      } catch (emailError) {
        console.error('Failed to send failure email:', emailError)
      }
    }
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

// Handle dispute/chargeback
async function handleDisputeCreated(dispute: StripeDispute) {
  console.log('Dispute created:', dispute.id)
  
  try {
    const paymentIntentId = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : dispute.payment_intent?.id
    if (!paymentIntentId) {
      console.error('No payment intent ID found in dispute:', dispute.id)
      return
    }
    
    const order = await findOrderByPaymentId(paymentIntentId)
    
    if (order) {
      await updateOrderStatus(paymentIntentId, 'DISPUTED' as OrderStatus, {
        reason: 'Payment disputed',
        disputedAt: new Date(),
        disputeId: dispute.id,
        disputeReason: dispute.reason
      })
      
      console.log('Order marked as disputed:', order.id)
      
      // Send dispute notification email
      try {
        await sendDisputeNotificationEmail(order.customerEmail, order.id, dispute.reason)
      } catch (emailError) {
        console.error('Failed to send dispute email:', emailError)
      }
    }
  } catch (error) {
    console.error('Error handling dispute:', error)
  }
}

// Handle refund
async function handleRefunded(charge: StripeCharge) {
  console.log('Charge refunded:', charge.id)
  
  try {
    const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id
    if (!paymentIntentId) {
      console.error('No payment intent ID found in charge:', charge.id)
      return
    }
    
    const order = await findOrderByPaymentId(paymentIntentId)
    
    if (order) {
      await updateOrderStatus(paymentIntentId, OrderStatus.REFUNDED, {
        reason: 'Payment refunded',
        refundedAt: new Date(),
        refundId: charge.refunds?.data?.[0]?.id,
        refundAmount: charge.refunds?.data?.[0]?.amount
      })
      
      console.log('Order marked as refunded:', order.id)
      
      // Send refund notification email
      try {
        await sendRefundNotificationEmail(order.customerEmail, order.id, charge.refunds?.data?.[0]?.amount)
      } catch (emailError) {
        console.error('Failed to send refund email:', emailError)
      }
    }
  } catch (error) {
    console.error('Error handling refund:', error)
  }
}

// Helper function to find order by payment ID
async function findOrderByPaymentId(paymentId: string) {
  // Try multi-item order first
  const multiOrder = await prisma.multiItemOrder.findFirst({
    where: { paymentId }
  })
  
  if (multiOrder) {
    return { ...multiOrder, type: 'multi-item' }
  }
  
  // Fallback to single order
  const singleOrder = await prisma.order.findFirst({
    where: { paymentId }
  })
  
  if (singleOrder) {
    return { ...singleOrder, type: 'single' }
  }
  
  return null
}

// Helper function to update order status
async function updateOrderStatus(paymentId: string, status: OrderStatus, additionalData: OrderStatusUpdateData = {}) {
  // Try multi-item order first
  const multiOrder = await prisma.multiItemOrder.findFirst({
    where: { paymentId }
  })
  
  if (multiOrder) {
    await prisma.multiItemOrder.update({
      where: { id: multiOrder.id },
      data: {
        status,
        ...additionalData
      }
    })
    return
  }
  
  // Fallback to single order
  const singleOrder = await prisma.order.findFirst({
    where: { paymentId }
  })
  
  if (singleOrder) {
    await prisma.order.update({
      where: { id: singleOrder.id },
      data: {
        status,
        ...additionalData
      }
    })
  }
}

// Handle multi-item order creation
async function handleMultiItemOrder(fullSession: StripeCheckoutSession, lineItems: StripeLineItem[]) {
            console.log('Processing multi-item order with', lineItems.length, 'items')
            
  // Get order ID from session metadata
  const orderId = fullSession.metadata?.order_id
  console.log('🔍 Multi-item webhook - Order ID from metadata:', orderId)
  
  // Find existing order by order_id from metadata
  let existingOrder = null
  
  if (orderId) {
    existingOrder = await prisma.multiItemOrder.findFirst({
      where: { id: orderId },
      include: { items: true }
    })
    console.log('🔍 Found multi-item order by order_id:', existingOrder?.id)
  }
  
  if (!existingOrder) {
    console.warn('No existing multi-item order found, using fallback creation')
    // Fallback: créer une nouvelle commande (ancien comportement)
    // ... (code existant)
    return
  }
  
  // Update existing order to PAID status
  const orderItems: OrderItem[] = []
            let totalAmount = 0

  // Parse items from metadata to get license types
  const metadataItems = fullSession.metadata?.items ? JSON.parse(fullSession.metadata.items) : []
  console.log('🔍 Metadata items:', metadataItems)

            for (const lineItem of lineItems) {
    const price = lineItem.price as StripePrice
    const product = price?.product as StripeProduct

              if (!product || typeof product === 'string' || product.deleted) {
                console.error('Invalid or deleted product data in line item:', lineItem.id)
                continue
              }

              const beatId = product.metadata?.beat_id
              if (!beatId) {
                console.error('No beat_id found in product metadata:', product.id)
                continue
              }

              const beat = await BeatService.getBeatById(beatId)
              if (!beat) {
                console.error('Beat not found:', beatId)
                continue
              }

              const quantity = lineItem.quantity || 1
              const unitPrice = (price.unit_amount || 0) / 100
              const itemTotal = unitPrice * quantity
              totalAmount += itemTotal

    // Find corresponding metadata item to get license type
    const metadataItem = metadataItems.find((item: any) => item.priceId === price.id)
    const licenseType = metadataItem?.licenseType || 'WAV_LEASE'
    console.log('🔍 Item license type:', licenseType)

              orderItems.push({
                beatId,
                quantity,
                unitPrice,
                totalPrice: itemTotal
              })
            }

            if (orderItems.length === 0) {
              console.error('No valid items found for multi-item order')
    return
            }

  // Update existing order to PAID status
  const updatedOrder = await prisma.multiItemOrder.update({
    where: { id: existingOrder.id },
              data: {
      status: OrderStatus.PAID,
      paidAt: new Date(),
      sessionId: fullSession.id,
      customerEmail: fullSession.customer_email || fullSession.customer_details?.email || existingOrder.customerEmail,
      customerName: fullSession.customer_details?.name || existingOrder.customerName,
      customerPhone: fullSession.customer_details?.phone || existingOrder.customerPhone,
      totalAmount: totalAmount,
                currency: fullSession.currency?.toUpperCase() || 'EUR',
                paymentMethod: 'card',
      // Update items with calculated prices and license types
                items: {
        deleteMany: {}, // Supprimer les anciens items
        create: orderItems.map((item, index) => {
          const metadataItem = metadataItems[index]
          const licenseType = metadataItem?.licenseType || 'WAV_LEASE'
          return {
                    beatId: item.beatId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            licenseType: licenseType
          }
        })
      }
    }
  })

  console.log('Multi-item order updated to PAID status:', updatedOrder.id)

  // Send confirmation email
            try {
              await sendOrderConfirmationEmail(
      updatedOrder.id,
      updatedOrder.customerEmail,
                true // isMultiItem
              )
            } catch (emailError) {
              console.error('Failed to send confirmation email for multi-item order:', emailError)
  }
}

// Handle single-item order creation
async function handleSingleItemOrder(fullSession: StripeCheckoutSession, lineItem: StripeLineItem) {
  const price = lineItem.price as StripePrice
  const product = price?.product as StripeProduct

            if (!product || typeof product === 'string' || product.deleted) {
    console.error('Invalid or deleted product data in session:', fullSession.id)
    return
            }

            // Get the beat ID from the product metadata
            console.log('Product metadata:', product.metadata)
            const beatId = product.metadata?.beat_id
            if (!beatId) {
              console.error('No beat_id found in product metadata:', product.id)
              console.error('Available metadata keys:', Object.keys(product.metadata || {}))
    return
            }
            
            console.log('Found beat_id:', beatId)

            // Get the beat details
            const beat = await BeatService.getBeatById(beatId)
            if (!beat) {
              console.error('Beat not found:', beatId)
    return
            }

            // Get license type from session metadata
            const licenseType = fullSession.metadata?.license_type || 'WAV_LEASE'
  const orderId = fullSession.metadata?.order_id
  
  console.log('🔍 Webhook - License type:', licenseType)
  console.log('🔍 Webhook - Order ID from metadata:', orderId)
  
  // Find existing order by order_id from metadata or by paymentId
  let existingOrder = null
  
  if (orderId) {
    existingOrder = await prisma.order.findFirst({
      where: { id: orderId }
    })
    console.log('🔍 Found order by order_id:', existingOrder?.id)
  }
  
  if (!existingOrder) {
    existingOrder = await prisma.order.findFirst({
      where: { paymentId: fullSession.id }
    })
    console.log('🔍 Found order by paymentId:', existingOrder?.id)
  }

  let order

  if (existingOrder) {
    // Update existing order to PAID status
    order = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        status: OrderStatus.PAID,
        paidAt: new Date(),
        paymentId: fullSession.id, // Mettre à jour le paymentId
        customerEmail: fullSession.customer_email || fullSession.customer_details?.email || existingOrder.customerEmail,
        customerName: fullSession.customer_details?.name || existingOrder.customerName,
        customerPhone: fullSession.customer_details?.phone || existingOrder.customerPhone,
        totalAmount: (fullSession.amount_total || 0) / 100,
        currency: fullSession.currency?.toUpperCase() || 'EUR',
        paymentMethod: 'card',
        licenseType: licenseType as LicenseType,
        usageRights: getUsageRights(licenseType)
      }
    })
    console.log('Order updated to PAID status:', order.id)
  } else {
    // Fallback: create new order if none exists (shouldn't happen in normal flow)
    console.warn('No existing order found for payment ID:', fullSession.id)
    const orderData: OrderData = {
              customerEmail: fullSession.customer_email || fullSession.customer_details?.email || 'unknown@example.com',
              customerName: fullSession.customer_details?.name || undefined,
              customerPhone: fullSession.customer_details?.phone || undefined,
      totalAmount: (fullSession.amount_total || 0) / 100,
              currency: fullSession.currency?.toUpperCase() || 'EUR',
              paymentMethod: 'card',
      paymentId: fullSession.id,
              licenseType: licenseType as LicenseType,
              usageRights: getUsageRights(licenseType),
      beatId: beatId,
      status: OrderStatus.PAID // Create as PAID since payment succeeded
            }

    order = await OrderService.createOrder(orderData)
    console.log('Fallback order created successfully:', order.id)
  }

            // Send confirmation email with download links
            try {
              await sendOrderConfirmationEmail(
                order.id,
                order.customerEmail,
                false // isMultiItem
              )
            } catch (emailError) {
              console.error('Failed to send confirmation email for single order:', emailError)
  }
}

// Email notification functions
async function sendPaymentFailureEmail(email: string, orderId: string, errorMessage?: string) {
  // TODO: Implement payment failure email
  console.log(`Payment failure email would be sent to ${email} for order ${orderId}: ${errorMessage}`)
}

async function sendDisputeNotificationEmail(email: string, orderId: string, reason: string) {
  // TODO: Implement dispute notification email
  console.log(`Dispute notification email would be sent to ${email} for order ${orderId}: ${reason}`)
}

async function sendRefundNotificationEmail(email: string, orderId: string, refundAmount?: number) {
  // TODO: Implement refund notification email
  console.log(`Refund notification email would be sent to ${email} for order ${orderId}: ${refundAmount}`)
}
