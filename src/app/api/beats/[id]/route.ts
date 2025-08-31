import { NextRequest, NextResponse } from 'next/server'
import { BeatService } from '@/services/beatService'

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

    // Récupération du beat
    const beat = await BeatService.getBeatById(id)

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
