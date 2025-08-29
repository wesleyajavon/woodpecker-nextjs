import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'

export async function GET(request: NextRequest) {
  try {
    // Récupération des statistiques
    const stats = await OrderService.getOrderStats()

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
