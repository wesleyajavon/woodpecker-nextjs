import { prisma } from '@/lib/prisma'
import { Order, CreateOrderInput, UpdateOrderInput, OrderFilters, OrderSortOptions } from '@/types/order'

export class OrderService {
  // Create a new order
  static async createOrder(data: CreateOrderInput): Promise<Order> {
    return await prisma.order.create({
      data: {
        ...data,
        totalAmount: new Decimal(data.totalAmount),
        currency: data.currency || 'EUR',
        licenseType: data.licenseType || 'NON_EXCLUSIVE',
        usageRights: data.usageRights || []
      },
      include: {
        beat: true
      }
    })
  }

  // Get all orders with optional filters and sorting
  static async getOrders(
    filters: OrderFilters = {},
    sort: OrderSortOptions = { field: 'createdAt', order: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<{ orders: Order[]; total: number; totalPages: number }> {
    const where: any = {}

    // Apply filters
    if (filters.customerEmail) {
      where.customerEmail = { contains: filters.customerEmail, mode: 'insensitive' }
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.licenseType) {
      where.licenseType = filters.licenseType
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
      if (filters.dateTo) where.createdAt.lte = filters.dateTo
    }

    if (filters.beatId) {
      where.beatId = filters.beatId
    }

    // Get total count
    const total = await prisma.order.count({ where })

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where,
      orderBy: { [sort.field]: sort.order },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        beat: true
      }
    })

    const totalPages = Math.ceil(total / limit)

    return {
      orders,
      total,
      totalPages
    }
  }

  // Get a single order by ID
  static async getOrderById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        beat: true
      }
    })
  }

  // Get orders by customer email
  static async getOrdersByCustomer(email: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
      include: {
        beat: true
      }
    })
  }

  // Update order status
  static async updateOrderStatus(id: string, status: string): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: { 
        status: status as any,
        ...(status === 'PAID' ? { paidAt: new Date() } : {})
      },
      include: {
        beat: true
      }
    })
  }

  // Update order payment information
  static async updateOrderPayment(
    id: string, 
    paymentMethod: string, 
    paymentId: string
  ): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: {
        paymentMethod,
        paymentId,
        status: 'PAID',
        paidAt: new Date()
      },
      include: {
        beat: true
      }
    })
  }

  // Update order
  static async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data,
      include: {
        beat: true
      }
    })
  }

  // Cancel order
  static async cancelOrder(id: string): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        beat: true
      }
    })
  }

  // Refund order
  static async refundOrder(id: string): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: { status: 'REFUNDED' },
      include: {
        beat: true
      }
    })
  }

  // Get order statistics
  static async getOrderStats() {
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      where: { status: { in: ['PAID', 'COMPLETED'] } },
      _sum: { totalAmount: true }
    })
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })
    const completedOrders = await prisma.order.count({
      where: { status: { in: ['PAID', 'COMPLETED'] } }
    })

    // Revenue by month (last 12 months)
    const monthlyRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      where: { 
        status: { in: ['PAID', 'COMPLETED'] },
        createdAt: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
      },
      _sum: { totalAmount: true }
    })

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      completedOrders,
      monthlyRevenue
    }
  }

  // Get orders by beat (for analytics)
  static async getOrdersByBeat(beatId: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { beatId },
      orderBy: { createdAt: 'desc' },
      include: {
        beat: true
      }
    })
  }

  // Check if customer has already purchased a beat
  static async hasCustomerPurchasedBeat(
    customerEmail: string, 
    beatId: string
  ): Promise<boolean> {
    const order = await prisma.order.findFirst({
      where: {
        customerEmail,
        beatId,
        status: { in: ['PAID', 'COMPLETED'] }
      }
    })
    return !!order
  }
}

// Import Decimal from Prisma
import { Decimal } from '@prisma/client/runtime/library'
