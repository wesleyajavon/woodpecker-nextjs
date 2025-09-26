import { NextRequest, NextResponse } from 'next/server';
import { BeatService } from '@/services/beatService';
import { OrderService } from '@/services/orderService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserIdFromEmail } from '@/lib/userUtils';
import { CloudinaryService } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{
    beatId: string
  }>
}

// GET - Télécharger les stems d'un beat
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const { beatId } = await params;

    if (!beatId) {
      return NextResponse.json(
        { error: 'ID du beat requis' },
        { status: 400 }
      );
    }

    // Récupération du beat
    const beat = await BeatService.getBeatById(beatId);
    if (!beat) {
      return NextResponse.json(
        { error: 'Beat non trouvé' },
        { status: 404 }
      );
    }

    // Vérification que le beat a des stems
    if (!beat.stemsUrl) {
      return NextResponse.json(
        { error: 'Aucun fichier stems disponible pour ce beat' },
        { status: 404 }
      );
    }

    // Vérification des autorisations (l'utilisateur doit avoir acheté le beat)
    const userId = await getUserIdFromEmail(session.user.email);
    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur a acheté ce beat
    const hasPurchased = await OrderService.hasEmailPurchasedBeat(session.user.email, beatId);
    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'Vous devez avoir acheté ce beat pour télécharger les stems' },
        { status: 403 }
      );
    }

    // Génération d'une URL signée pour le téléchargement (valide 30 minutes)
    const downloadUrl = CloudinaryService.generateSignedUrl(
      beat.stemsUrl.split('/').slice(-2).join('/').replace('.zip', ''), // Extraire le public_id
      30, // 30 minutes
      {
        format: 'zip',
        quality: 'auto:best'
      },
      'raw'
    );

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      beatTitle: beat.title
    });

  } catch (error) {
    console.error('Erreur lors du téléchargement des stems:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
