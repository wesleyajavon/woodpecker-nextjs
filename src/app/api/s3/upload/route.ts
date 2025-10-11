import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { s3Service } from '@/lib/s3-service'
import { S3_CONFIG } from '@/lib/aws-s3'

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string
    const beatId = formData.get('beatId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    if (!folder) {
      return NextResponse.json(
        { error: 'Dossier de destination requis' },
        { status: 400 }
      )
    }

    // Vérification de la taille du fichier
    if (file.size > S3_CONFIG.limits.maxFileSize) {
      return NextResponse.json(
        { 
          error: 'Fichier trop volumineux',
          message: `La taille du fichier (${(file.size / 1024 / 1024).toFixed(2)}MB) dépasse la limite autorisée (${S3_CONFIG.limits.maxFileSize / 1024 / 1024}MB)`,
          maxSize: `${S3_CONFIG.limits.maxFileSize / 1024 / 1024}MB`
        },
        { status: 413 }
      )
    }

    // Vérification du type de fichier
    const allowedTypes = [...S3_CONFIG.allowedTypes.audio, ...S3_CONFIG.allowedTypes.zip]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Conversion du fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload vers S3
    const uploadResult = await s3Service.uploadFile(buffer, {
      folder,
      fileName: file.name,
      contentType: file.type,
      metadata: {
        beatId: beatId || 'unknown',
        uploadedBy: session.user.email,
        originalSize: file.size.toString()
      }
    })

    return NextResponse.json({
      success: true,
      data: uploadResult
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload S3:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'upload',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Génération d'URL signée pour upload direct
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    const contentType = searchParams.get('contentType')
    const folder = searchParams.get('folder')
    const beatId = searchParams.get('beatId')

    if (!fileName || !contentType || !folder) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Génération de l'URL signée
    const presignedData = await s3Service.generatePresignedUploadUrl({
      folder,
      fileName,
      contentType,
      metadata: {
        beatId: beatId || 'unknown',
        uploadedBy: session.user.email
      }
    })

    return NextResponse.json({
      success: true,
      data: presignedData
    })

  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL signée:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'URL',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Configuration pour les gros fichiers
export const config = {
  maxDuration: 300, // 5 minutes
}
