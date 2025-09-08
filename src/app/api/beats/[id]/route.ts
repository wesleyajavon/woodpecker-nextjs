import { NextRequest, NextResponse } from 'next/server'
import { BeatService } from '@/services/beatService'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserIdFromEmail } from '@/lib/userUtils'
import { isUserAdmin } from '@/lib/roleUtils'

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
        { error: 'ID du beat requis' },
        { status: 400 }
      )
    }

    // Récupération de la session utilisateur
    const session = await getServerSession(authOptions)
    const userId = session?.user?.email ? await getUserIdFromEmail(session.user.email) : undefined
    const isAdmin = session?.user?.email ? await isUserAdmin(session.user.email) : false

    // Récupération du beat (filtré par utilisateur seulement si admin)
    const beat = await BeatService.getBeatById(id, userId || undefined, isAdmin)

    if (!beat) {
      return NextResponse.json(
        { error: 'Beat non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: beat
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du beat:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
