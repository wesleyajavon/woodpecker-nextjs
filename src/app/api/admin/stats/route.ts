import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserIdFromEmail } from '@/lib/userUtils'
import { isUserAdmin } from '@/lib/roleUtils'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    // Vérification du rôle admin
    const isAdmin = await isUserAdmin(session.user.email)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle admin requis.' },
        { status: 403 }
      )
    }

    // Récupération de l'ID utilisateur (admin)
    const userId = await getUserIdFromEmail(session.user.email)
    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupération des statistiques
    const [
      totalBeats,
      totalOrders,
      totalRevenue,
      uniqueCustomers
    ] = await Promise.all([
      // Total des beats de l'admin
      prisma.beat.count({
        where: { userId }
      }),
      
      // Total des commandes pour les beats de l'admin
      prisma.order.count({
        where: {
          beat: {
            userId
          }
        }
      }),
      
      // Chiffre d'affaires total (somme des totalAmount)
      prisma.order.aggregate({
        where: {
          beat: {
            userId
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Nombre unique de clients ayant acheté des beats de l'admin
      prisma.order.findMany({
        where: {
          beat: {
            userId
          }
        },
        select: {
          customerEmail: true
        },
        distinct: ['customerEmail']
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalBeats,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        uniqueCustomers: uniqueCustomers.length
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
