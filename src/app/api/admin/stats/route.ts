import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserIdFromEmail } from '@/lib/userUtils'
import { isUserAdmin } from '@/lib/roleUtils'
import { prisma } from '@/lib/prisma'
import { withUserRateLimit } from '@/lib/rate-limit'

// Fonction pour récupérer les visiteurs actifs des 96 dernières heures
async function getActiveVisitors() {
  try {
    // Calculer la date de début (96 heures = 4 jours)
    const fourDaysAgo = new Date()
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
    
    // Pour l'instant, on retourne une valeur simulée
    // En production, vous devrez utiliser l'API Vercel Analytics
    // ou implémenter votre propre système de tracking
    const mockActiveVisitors = Math.floor(Math.random() * 500) + 100
    
    return mockActiveVisitors
  } catch (error) {
    console.error('Erreur lors de la récupération des visiteurs actifs:', error)
    return 0
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérification du rate limiting pour les routes admin
    const rateLimitResult = await withUserRateLimit(request, 'ADMIN')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

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
      uniqueCustomers,
      activeVisitors
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
      }),
      
      // Visiteurs actifs des 96 dernières heures
      getActiveVisitors()
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalBeats,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        uniqueCustomers: uniqueCustomers.length,
        activeVisitors,
        // Valeurs simulées pour les changements (à remplacer par de vrais calculs plus tard)
        beatsChange: Math.floor(Math.random() * 20) + 5, // 5-25% d'augmentation
        ordersChange: Math.floor(Math.random() * 30) + 10, // 10-40% d'augmentation
        revenueChange: Math.floor(Math.random() * 25) + 8, // 8-33% d'augmentation
        visitorsChange: Math.floor(Math.random() * 15) + 3 // 3-18% d'augmentation
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
