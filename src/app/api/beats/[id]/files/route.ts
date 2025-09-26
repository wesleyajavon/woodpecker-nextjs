import { NextRequest, NextResponse } from 'next/server';
import { BeatService } from '@/services/beatService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserIdFromEmail } from '@/lib/userUtils';
import { CloudinaryService, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Types pour les fichiers uploadés
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface UploadedFiles {
  preview?: MulterFile[];
  master?: MulterFile[];
  artwork?: MulterFile[];
  [key: string]: MulterFile[] | undefined;
}

// PUT - Mettre à jour les fichiers d'un beat
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du beat requis' },
        { status: 400 }
      );
    }

    // Vérification que le beat existe
    const existingBeat = await BeatService.getBeatById(id);
    if (!existingBeat) {
      return NextResponse.json(
        { error: 'Beat non trouvé' },
        { status: 404 }
      );
    }

    // Vérification des autorisations
    const userId = await getUserIdFromEmail(session.user.email);
    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupération des données de la requête
    const formData = await request.formData();
    
    // Extraction des fichiers
    const files: UploadedFiles = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Convertir File en MulterFile
        const multerFile: MulterFile = {
          fieldname: key,
          originalname: value.name,
          encoding: '7bit',
          mimetype: value.type,
          buffer: Buffer.from(await value.arrayBuffer()),
          size: value.size
        };
        
        if (key === 'preview' || key === 'master' || key === 'artwork') {
          if (!files[key]) {
            files[key] = [];
          }
          files[key].push(multerFile);
        }
      }
    }

    // Upload des fichiers vers Cloudinary
    const uploadResults: Record<string, { public_id: string; secure_url: string; resource_type: string }> = {};
    const updateData: Record<string, string> = {};

    try {
      // Upload de la preview
      if (files.preview && files.preview[0]) {
        const previewFile = files.preview[0];
        console.log(`Starting preview update: ${previewFile.originalname} (${previewFile.size} bytes) - will be cropped to 30 seconds`);
        uploadResults.preview = await CloudinaryService.uploadAudio(
          previewFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.PREVIEWS,
          {
            resource_type: 'video',
            format: 'mp3',
            quality: 'auto:low',
            crop_duration: 30 // Couper à 30 secondes pour la preview
          }
        );
        updateData.previewUrl = uploadResults.preview.secure_url;
        console.log('Preview update completed successfully - cropped to 30 seconds');
      }

      // Upload du master (optionnel)
      if (files.master && files.master[0]) {
        const masterFile = files.master[0];
        uploadResults.master = await CloudinaryService.uploadAudio(
          masterFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.MASTERS,
          {
            resource_type: 'video',
            format: 'wav',
            quality: 'auto:best'
          }
        );
        updateData.fullUrl = uploadResults.master.secure_url;
      }

      // Upload de l'artwork (optionnel)
      if (files.artwork && files.artwork[0]) {
        const artworkFile = files.artwork[0];
        uploadResults.artwork = await CloudinaryService.uploadImage(
          artworkFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.ARTWORKS,
          {
            width: 800,
            height: 800,
            crop: 'fill',
            quality: 'auto:best'
          }
        );
        updateData.artworkUrl = uploadResults.artwork.secure_url;
      }


    } catch (uploadError) {
      console.error('Erreur lors de l\'upload vers Cloudinary:', uploadError);
      
      // Nettoyage des fichiers déjà uploadés en cas d'erreur
      for (const result of Object.values(uploadResults)) {
        if (result && result.public_id) {
          try {
            await CloudinaryService.deleteResource(
              result.public_id,
              result.resource_type === 'video' ? 'video' : 'image'
            );
          } catch (cleanupError) {
            console.error('Erreur lors du nettoyage:', cleanupError);
          }
        }
      }

      return NextResponse.json({
        error: 'Échec de l\'upload vers Cloudinary',
        details: uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

    // Mise à jour du beat dans la base de données
    try {
      const updatedBeat = await BeatService.updateBeat(id, updateData);

      return NextResponse.json({
        success: true,
        message: 'Fichiers mis à jour avec succès',
        data: updatedBeat
      }, { status: 200 });

    } catch (dbError) {
      console.error('Erreur lors de la mise à jour du beat:', dbError);
      
      // Nettoyage des fichiers en cas d'erreur de base de données
      for (const result of Object.values(uploadResults)) {
        if (result && result.public_id) {
          try {
            await CloudinaryService.deleteResource(
              result.public_id,
              result.resource_type === 'video' ? 'video' : 'image'
            );
          } catch (cleanupError) {
            console.error('Erreur lors du nettoyage:', cleanupError);
          }
        }
      }

      return NextResponse.json({
        error: 'Échec de la mise à jour du beat',
        details: dbError instanceof Error ? dbError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur générale lors de la mise à jour des fichiers:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
