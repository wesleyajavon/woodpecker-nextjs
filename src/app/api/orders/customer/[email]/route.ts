import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'

interface RouteParams {
  params: {
    email: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { email } = params

    if (!email) {
      return NextResponse.json(
        { error: 'Email du client requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Récupération des commandes du client
    const orders = await OrderService.getOrdersByCustomer(email)

    return NextResponse.json({
      success: true,
      data: orders,
      customerEmail: email,
      count: orders.length
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du client:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
