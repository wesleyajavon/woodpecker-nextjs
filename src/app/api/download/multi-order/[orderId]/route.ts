import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DownloadUrls {
  master: string
  stems?: string
  expiresAt: string
}

interface BeatDownloadUrls {
  beatId: string
  beatTitle: string
  downloadUrls: DownloadUrls
  hasStems?: boolean
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const { customerEmail } = await request.json()

    if (!orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Order ID and customer email are required' },
        { status: 400 }
      )
    }

    // Find the multi-item order
    const order = await prisma.multiItemOrder.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        customerEmail: true,
        items: {
          select: {
            licenseType: true,
            beat: {
              select: {
                id: true,
                title: true,
                stemsUrl: true
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

    // Verify customer email matches
    if (order.customerEmail !== customerEmail) {
      return NextResponse.json(
        { error: 'Unauthorized access to order' },
        { status: 403 }
      )
    }

    // Generate download URLs for each beat
    const beatDownloadUrls: BeatDownloadUrls[] = []
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now

    for (const item of order.items) {
      const beat = item.beat
      
      // Generate secure download URLs for each beat
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const masterUrl = `${baseUrl}/api/download/beat/${beat.id}?orderId=${orderId}&customerEmail=${encodeURIComponent(customerEmail)}&type=master`
      
      const downloadUrls: DownloadUrls = {
        master: masterUrl,
        expiresAt: expiresAt.toISOString(),
      }
      
      // Add stems URL if license includes stems and stems are available
      if ((item.licenseType === 'TRACKOUT_LEASE' || item.licenseType === 'UNLIMITED_LEASE') && beat.stemsUrl) {
        downloadUrls.stems = `${baseUrl}/api/download/beat/${beat.id}?orderId=${orderId}&customerEmail=${encodeURIComponent(customerEmail)}&type=stems`
        console.log('✅ Generated stems URL for beat:', beat.id, 'license:', item.licenseType)
      }

      beatDownloadUrls.push({
        beatId: beat.id,
        beatTitle: beat.title,
        downloadUrls,
        hasStems: !!beat.stemsUrl && (item.licenseType === 'TRACKOUT_LEASE' || item.licenseType === 'UNLIMITED_LEASE')
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        customerEmail,
        beats: beatDownloadUrls,
        expiresAt: expiresAt.toISOString(),
      }
    })

  } catch (error) {
    console.error('Error generating multi-order download URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate download URLs' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
