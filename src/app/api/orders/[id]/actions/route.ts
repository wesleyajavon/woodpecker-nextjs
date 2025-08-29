import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const { action } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la commande requis' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action requise' },
        { status: 400 }
      )
    }

    let result: any
    let message: string

    // Exécution de l'action demandée
    switch (action) {
      case 'cancel':
        result = await OrderService.cancelOrder(id)
        message = 'Commande annulée avec succès'
        break
        
      case 'refund':
        result = await OrderService.refundOrder(id)
        message = 'Commande remboursée avec succès'
        break
        
      case 'mark-paid':
        result = await OrderService.updateOrderStatus(id, 'PAID')
        message = 'Statut de la commande mis à jour : PAYÉ'
        break
        
      case 'mark-completed':
        result = await OrderService.updateOrderStatus(id, 'COMPLETED')
        message = 'Statut de la commande mis à jour : TERMINÉ'
        break
        
      default:
        return NextResponse.json(
          { error: 'Action non reconnue. Actions disponibles: cancel, refund, mark-paid, mark-completed' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message,
      data: result
    })

  } catch (error) {
    console.error('Erreur lors de l\'exécution de l\'action:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
