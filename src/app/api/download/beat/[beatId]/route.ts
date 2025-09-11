import { NextRequest, NextResponse } from 'next/server'
import { CloudinaryService } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    beatId: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { beatId } = await params
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const customerEmail = searchParams.get('customerEmail')
    const type = searchParams.get('type') || 'master' // 'master' ou 'stems'

    if (!beatId || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Beat ID, Order ID et email client requis' },
        { status: 400 }
      )
    }

    // Vérification que la commande existe et appartient au client
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerEmail: customerEmail,
        // status: 'PAID' // Seulement les commandes payées
      },
      include: {
        beat: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée ou non autorisée' },
        { status: 404 }
      )
    }

    // Vérification que le beat correspond
    if (order.beat.id !== beatId) {
      return NextResponse.json(
        { error: 'Beat ne correspond pas à la commande' },
        { status: 400 }
      )
    }

    // Vérification que les URLs Cloudinary existent
    if (!order.beat.fullUrl) {
      return NextResponse.json(
        { error: 'Fichier de beat non disponible' },
        { status: 404 }
      )
    }

    // Extraction des public IDs depuis les URLs Cloudinary
    const extractPublicId = (url: string): string | null => {
      const match = url.match(/\/v\d+\/(.+)\.(mp3|wav|zip)$/)
      return match ? match[1] : null
    }

    const masterPublicId = extractPublicId(order.beat.fullUrl)
    if (!masterPublicId) {
      return NextResponse.json(
        { error: 'URL de beat invalide' },
        { status: 400 }
      )
    }

    const stemsPublicId = order.beat.stemsUrl ? extractPublicId(order.beat.stemsUrl) : null

    // Génération de l'URL de téléchargement appropriée
    let downloadUrl: string
    let filename: string

    if (type === 'stems' && stemsPublicId) {
      downloadUrl = CloudinaryService.generateSignedUrl(stemsPublicId, 30, {
        format: 'zip',
        quality: 'auto:best'
      }, 'raw')
      filename = `${order.beat.title}_stems.zip`
    } else {
      downloadUrl = CloudinaryService.generateSignedUrl(masterPublicId, 30, {
        format: 'wav',
        quality: 'auto:best'
      }, 'video')
      filename = `${order.beat.title}_master.wav`
    }

    // Redirection vers l'URL Cloudinary avec les headers de téléchargement
    const response = NextResponse.redirect(downloadUrl)
    
    // Ajout des headers pour forcer le téléchargement
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    response.headers.set('Content-Type', type === 'stems' ? 'application/zip' : 'audio/wav')
    
    return response

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { beatId } = await params
    const body = await request.json()
    const { orderId, customerEmail } = body

    if (!beatId || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Beat ID, Order ID et email client requis' },
        { status: 400 }
      )
    }

    // Vérification que la commande existe et appartient au client
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerEmail: customerEmail,
        // status: 'PAID' // Seulement les commandes payées
      },
      include: {
        beat: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée ou non autorisée' },
        { status: 404 }
      )
    }

    // Vérification que le beat correspond
    if (order.beat.id !== beatId) {
      return NextResponse.json(
        { error: 'Beat ne correspond pas à la commande' },
        { status: 400 }
      )
    }

    // Vérification que les URLs Cloudinary existent
    if (!order.beat.fullUrl) {
      return NextResponse.json(
        { error: 'Fichier de beat non disponible' },
        { status: 404 }
      )
    }

    // Extraction des public IDs depuis les URLs Cloudinary
    const extractPublicId = (url: string): string | null => {
      const match = url.match(/\/v\d+\/(.+)\.(mp3|wav|zip)$/)
      return match ? match[1] : null
    }

    const masterPublicId = extractPublicId(order.beat.fullUrl)
    if (!masterPublicId) {
      return NextResponse.json(
        { error: 'URL de beat invalide' },
        { status: 400 }
      )
    }

    const stemsPublicId = order.beat.stemsUrl ? extractPublicId(order.beat.stemsUrl) : null

    // Génération des URLs de téléchargement direct
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const downloadUrls = {
      master: `${baseUrl}/api/download/beat/${beatId}?orderId=${orderId}&customerEmail=${encodeURIComponent(customerEmail)}&type=master`,
      stems: stemsPublicId ? `${baseUrl}/api/download/beat/${beatId}?orderId=${orderId}&customerEmail=${encodeURIComponent(customerEmail)}&type=stems` : null,
      expiresAt: new Date(Date.now() + (30 * 60 * 1000)) // 30 minutes
    }

    return NextResponse.json({
      success: true,
      data: {
        beat: {
          id: order.beat.id,
          title: order.beat.title,
          genre: order.beat.genre,
          bpm: order.beat.bpm,
          key: order.beat.key
        },
        downloadUrls: {
          master: downloadUrls.master,
          stems: downloadUrls.stems,
          expiresAt: downloadUrls.expiresAt
        },
        order: {
          id: order.id,
          licenseType: order.licenseType,
          totalAmount: order.totalAmount
        }
      }
    })

  } catch (error) {
    console.error('Erreur lors de la génération des URLs de téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

