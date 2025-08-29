import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/services/orderService'
import { OrderFilters, OrderSortOptions, CreateOrderInput } from '@/types/order'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Récupération des paramètres de requête
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const customerEmail = searchParams.get('customerEmail') || undefined
    const status = searchParams.get('status') || undefined
    const licenseType = searchParams.get('licenseType') || undefined
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined
    const beatId = searchParams.get('beatId') || undefined
    const sortField = (searchParams.get('sortField') || 'createdAt') as keyof OrderSortOptions['field']
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Validation des paramètres
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Paramètres de pagination invalides' },
        { status: 400 }
      )
    }

    // Construction des filtres
    const filters: OrderFilters = {
      customerEmail,
      status: status as any,
      licenseType: licenseType as any,
      dateFrom,
      dateTo,
      beatId
    }

    // Construction des options de tri
    const sort: OrderSortOptions = {
      field: sortField,
      order: sortOrder
    }

    // Récupération des commandes
    const result = await OrderService.getOrders(filters, sort, page, limit)

    return NextResponse.json({
      success: true,
      data: result.orders,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: page < result.totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    const { customerEmail, totalAmount, beatId } = body
    
    if (!customerEmail || !totalAmount || !beatId) {
      return NextResponse.json(
        { error: 'Email client, montant total et ID du beat sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du montant
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Montant total invalide' },
        { status: 400 }
      )
    }

    // Vérification si le client a déjà acheté ce beat
    const hasPurchased = await OrderService.hasCustomerPurchasedBeat(customerEmail, beatId)
    if (hasPurchased) {
      return NextResponse.json(
        { error: 'Vous avez déjà acheté ce beat' },
        { status: 409 }
      )
    }

    // Création de la commande
    const orderData: CreateOrderInput = {
      customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      totalAmount,
      currency: body.currency || 'EUR',
      paymentMethod: body.paymentMethod,
      paymentId: body.paymentId,
      licenseType: body.licenseType || 'NON_EXCLUSIVE',
      usageRights: body.usageRights || [],
      beatId
    }

    const newOrder = await OrderService.createOrder(orderData)

    return NextResponse.json({
      success: true,
      message: 'Commande créée avec succès',
      data: newOrder
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
