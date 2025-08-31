import { NextRequest, NextResponse } from 'next/server';
import { beatUpload, handleUploadError, validateUploadedFiles } from '@/lib/upload';
import { CloudinaryService, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';
import { BeatService } from '@/services/beatService';
import { CreateBeatInput } from '@/types/beat';

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
  stems?: MulterFile[];
  artwork?: MulterFile[];
  [key: string]: MulterFile[] | undefined;
}

// Configuration pour l'upload de beats
const uploadMiddleware = beatUpload;

export async function POST(request: NextRequest) {
  try {
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
        
        if (key === 'preview' || key === 'master' || key === 'stems' || key === 'artwork') {
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
    const uploadResults: Record<string, { public_id: string; secure_url: string; resource_type: string }> = {};

    try {
      // Upload de la preview
      if (files.preview && files.preview[0]) {
        const previewFile = files.preview[0];
        uploadResults.preview = await CloudinaryService.uploadAudio(
          previewFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.PREVIEWS,
          {
            resource_type: 'video',
            format: 'mp3',
            quality: 'auto:low',
            duration: 30 // 30 secondes pour la preview
          }
        );
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
      }

      // Upload des stems (optionnel)
      if (files.stems && files.stems[0]) {
        const stemsFile = files.stems[0];
        uploadResults.stems = await CloudinaryService.uploadAudio(
          stemsFile.buffer,
          CLOUDINARY_FOLDERS.BEATS.STEMS,
          {
            resource_type: 'raw',
            format: 'zip'
          }
        );
      }

      // Upload de l'artwork (optionnel)
      if (files.artwork && files.artwork[0]) {
        const artworkFile = files.artwork[0];
        uploadResults.artwork = await CloudinaryService.uploadImage(
          artworkFile.buffer,
          CLOUDINARY_FOLDERS.ARTWORK.BEATS,
          {
            width: 800,
            height: 800,
            crop: 'fill',
            quality: 'auto:good'
          }
        );
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
        stemsUrl: uploadResults.stems?.secure_url,
        isExclusive: fields.isExclusive === 'true',
        featured: fields.featured === 'true'
      };

      const newBeat = await BeatService.createBeat(beatData);

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

// Configuration pour gérer les erreurs Multer
export const config = {
  api: {
    bodyParser: false,
  },
};
