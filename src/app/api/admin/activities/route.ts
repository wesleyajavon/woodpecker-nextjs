import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { isUserAdmin } from '@/lib/roleUtils'
import { withRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // Vérification du rate limiting
    const rateLimitResult = await withRateLimit(request, 'READ')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    // Vérification de l'authentification et des droits admin
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const isAdmin = await isUserAdmin(session.user.email)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé - Droits administrateur requis' },
        { status: 403 }
      )
    }

    // Données simulées pour les activités admin
    const mockActivities = [
      {
        id: 1,
        action: 'beatUploaded',
        beat: 'Dark Trap Beat #247',
        time: '2 minutes',
        type: 'upload' as const
      },
      {
        id: 2,
        action: 'orderCompleted',
        beat: 'Synthwave Dreams',
        time: '15 minutes',
        type: 'order' as const
      },
      {
        id: 3,
        action: 'beatEdited',
        beat: 'Hip Hop Instrumental',
        time: '1 hour',
        type: 'edit' as const
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockActivities
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des activités admin:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}