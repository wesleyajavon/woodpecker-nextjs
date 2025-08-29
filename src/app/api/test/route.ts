import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API Woodpecker Beats fonctionne correctement ! 🎵',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      beats: {
        list: '/api/beats',
        byId: '/api/beats/[id]',
        featured: '/api/beats/featured',
        byGenre: '/api/beats/genre/[genre]',
        stats: '/api/beats/stats',
        purchaseCheck: '/api/beats/[id]/purchase-check'
      },
      orders: {
        list: '/api/orders',
        byId: '/api/orders/[id]',
        create: '/api/orders',
        stats: '/api/orders/stats',
        byCustomer: '/api/orders/customer/[email]',
        actions: '/api/orders/[id]/actions'
      }
    }
  })
}
