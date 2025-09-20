import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { MultiItemOrder } from '@/types/order'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Find the multi-item order by session ID
    const order = await prisma.multiItemOrder.findFirst({
      where: {
        sessionId: sessionId,
      },
      include: {
        items: {
          include: {
            beat: {
              select: {
                id: true,
                title: true,
                genre: true,
                bpm: true,
                key: true,
                duration: true,
                price: true,
                isExclusive: true,
                featured: true,
                fullUrl: true,
                stemsUrl: true,
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Convert to MultiItemOrder type
    const multiItemOrder: MultiItemOrder = {
      id: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status as any,
      paymentMethod: order.paymentMethod,
      paymentId: order.paymentId,
      paidAt: order.paidAt,
      licenseType: order.licenseType as any,
      usageRights: order.usageRights,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        beatId: item.beatId,
        beat: item.beat,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      sessionId: order.sessionId || undefined,
    }

    return NextResponse.json({
      success: true,
      data: multiItemOrder
    })

  } catch (error) {
    console.error('Error fetching multi-item order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
