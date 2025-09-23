import { NextRequest, NextResponse } from 'next/server';
import { validateUploadedFiles } from '@/lib/upload';
import { CloudinaryService, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';
import { BeatService } from '@/services/beatService';
import { CreateBeatInput } from '@/types/beat';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserIdFromEmail } from '@/lib/userUtils';

// Types pour les fichiers uploadés via Multer
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
  [key: string]: MulterFile[] | undefined;
}



export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Récupération de l'ID utilisateur
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
    const fields: Record<string, string> = {};
    
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
        
        if (key === 'preview' || key === 'master') {
          if (!files[key]) {
            files[key] = [];
          }
          files[key].push(multerFile);
        }
      } else {
        fields[key] = value;
      }
    }

    // Validation des fichiers
    const validation = validateUploadedFiles(files, ['preview']);
    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Validation des fichiers échouée',
        details: validation.errors
      }, { status: 400 });
    }

    // Upload des fichiers vers Cloudinary
    const uploadResults: Record<string, { public_id: string; secure_url: string; resource_type: string; duration?: number }> = {};

    try {
      // Upload de la preview
      if (files.preview && files.preview[0]) {
        const previewFile = files.preview[0];
        console.log(`Starting preview upload: ${previewFile.originalname} (${previewFile.size} bytes) - will be cropped to 30 seconds`);
        console.log('Upload options:', {
          resource_type: 'video',
          format: 'mp3',
          quality: 'auto:low',
          crop_duration: 30
        });
        
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
        
        console.log('Preview upload result:', {
          public_id: uploadResults.preview.public_id,
          secure_url: uploadResults.preview.secure_url,
          duration: uploadResults.preview.duration
        });
      }

      // Upload du master (optionnel)
      if (files.master && files.master[0]) {
        const masterFile = files.master[0];
        console.log(`Starting master upload: ${masterFile.originalname} (${masterFile.size} bytes)`);
        uploadResults.master = await CloudinaryService.uploadAudio(
          masterFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.MASTERS,
          {
            resource_type: 'video',
            format: 'wav',
            quality: 'auto:best'
          }
        );
        console.log('Master upload completed successfully');
      }


    } catch (uploadError) {
      console.error('Erreur lors de l\'upload vers Cloudinary:', uploadError);
      console.error('Type d\'erreur:', typeof uploadError);
      console.error('Message d\'erreur:', uploadError instanceof Error ? uploadError.message : 'Unknown error');
      console.error('Stack trace:', uploadError instanceof Error ? uploadError.stack : 'No stack trace');
      
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
        details: uploadError instanceof Error ? uploadError.message : 'Erreur inconnue',
        type: typeof uploadError
      }, { status: 500 });
    }

    // Création du beat dans la base de données
    try {
      const beatData: CreateBeatInput = {
        title: fields.title,
        description: fields.description,
        genre: fields.genre,
        bpm: parseInt(fields.bpm),
        key: fields.key,
        duration: fields.duration,
        price: parseFloat(fields.price),
        tags: fields.tags ? JSON.parse(fields.tags) : [],
        previewUrl: uploadResults.preview?.secure_url,
        fullUrl: uploadResults.master?.secure_url,
        isExclusive: fields.isExclusive === 'true',
        featured: fields.featured === 'true'
      };

      const newBeat = await BeatService.createBeat(beatData, userId);

      return NextResponse.json({
        success: true,
        message: 'Beat uploadé avec succès',
        data: {
          beat: newBeat,
          uploads: uploadResults
        }
      }, { status: 201 });

    } catch (dbError) {
      console.error('Erreur lors de la création du beat:', dbError);
      
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
        error: 'Échec de la création du beat',
        details: dbError instanceof Error ? dbError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur générale lors de l\'upload:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// Configuration pour gérer les gros fichiers
export const config = {
  maxDuration: 300, // 5 minutes pour les gros fichiers audio
};
