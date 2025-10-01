import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/services/orderEmailService'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, isMultiItem = false } = await request.json()

    if (!orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Order ID and customer email are required' },
        { status: 400 }
      )
    }

    // Verify the order exists and belongs to the customer
    if (isMultiItem) {
      const order = await prisma.multiItemOrder.findFirst({
        where: {
          id: orderId,
          customerEmail: customerEmail
        }
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Multi-item order not found or unauthorized' },
          { status: 404 }
        )
      }
    } else {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerEmail: customerEmail
        }
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found or unauthorized' },
          { status: 404 }
        )
      }
    }

    // Send the confirmation email
    await sendOrderConfirmationEmail(orderId, customerEmail, isMultiItem)

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    })

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
