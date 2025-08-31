import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'
import { UpdateOrderInput } from '@/types/order'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la commande requis' },
        { status: 400 }
      )
    }

    // Récupération de la commande
    const order = await OrderService.getOrderById(id)

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la commande requis' },
        { status: 400 }
      )
    }

    // Validation des données
    const updateData: UpdateOrderInput = {}
    
    if (body.customerName !== undefined) updateData.customerName = body.customerName
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone
    if (body.status !== undefined) updateData.status = body.status
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod
    if (body.paymentId !== undefined) updateData.paymentId = body.paymentId
    if (body.licenseType !== undefined) updateData.licenseType = body.licenseType
    if (body.usageRights !== undefined) updateData.usageRights = body.usageRights

    // Mise à jour de la commande
    const updatedOrder = await OrderService.updateOrder(id, updateData)

    return NextResponse.json({
      success: true,
      message: 'Commande mise à jour avec succès',
      data: updatedOrder
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
