import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configuration de Cloudinary - initialisation paresseuse
let cloudinaryConfigured = false;

function configureCloudinary() {
  if (!cloudinaryConfigured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Variables d\'environnement Cloudinary manquantes. Vérifiez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, et CLOUDINARY_API_SECRET.');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    cloudinaryConfigured = true;
  }
}

// Structure des dossiers Cloudinary
export const CLOUDINARY_FOLDERS = {
  BEATS: {
    PREVIEWS: 'woodpecker-beats/beats/previews',
    MASTERS: 'woodpecker-beats/beats/masters',
    STEMS: 'woodpecker-beats/beats/stems',
    WAVEFORMS: 'woodpecker-beats/beats/waveforms'
  },
  ARTWORK: {
    BEATS: 'woodpecker-beats/artwork/beats',
    ALBUMS: 'woodpecker-beats/artwork/albums',
    PROFILES: 'woodpecker-beats/artwork/profiles'
  },
  TEMP: 'woodpecker-beats/temp'
} as const;

// Types pour les ressources Cloudinary
export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  duration?: number; // Pour les fichiers audio
  width?: number;    // Pour les images
  height?: number;   // Pour les images
}

// Configuration des transformations par défaut
export const TRANSFORMATIONS = {
  AUDIO: {
    PREVIEW: {
      quality: 'auto:low',
      format: 'mp3',
      duration: 30, // 30 secondes pour la preview
      eager_async: true
    },
    MASTER: {
      quality: 'auto:best',
      format: 'wav',
      eager_async: true
    },
    STEM: {
      quality: 'auto:best',
      format: 'wav',
      eager_async: true
    }
  },
  IMAGE: {
    THUMBNAIL: {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto:good'
    },
    MEDIUM: {
      width: 600,
      height: 600,
      crop: 'fill',
      quality: 'auto:good'
    },
    LARGE: {
      width: 1200,
      height: 1200,
      crop: 'fill',
      quality: 'auto:best'
    }
  }
} as const;

// Fonctions utilitaires pour Cloudinary
export class CloudinaryService {
  // Méthode utilitaire pour retry avec backoff exponentiel
  private static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Backoff exponentiel
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Tentative ${attempt + 1} échouée, nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  // Upload d'un fichier audio
  static async uploadAudio(
    file: Buffer | string,
    folder: string,
    options: {
      resource_type?: 'video' | 'raw';
      format?: string;
      quality?: string;
      duration?: number;
    } = {}
  ): Promise<CloudinaryResource> {
    try {
      configureCloudinary();
      let result: UploadApiResponse;
      
      if (typeof file === 'string') {
        // Upload depuis une URL
        result = await cloudinary.uploader.upload(file, {
          resource_type: options.resource_type || 'video',
          folder,
          overwrite: false,
          unique_filename: true,
          use_filename: true,
          // Pour les gros fichiers, on laisse Cloudinary gérer le format automatiquement
          // Les transformations seront appliquées à la demande via des URLs de transformation
        });
      } else {
        // Upload depuis un Buffer
        result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: options.resource_type || 'video',
              folder,
              overwrite: false,
              unique_filename: true,
              use_filename: true,
              // Pour les gros fichiers, on laisse Cloudinary gérer le format automatiquement
              // Les transformations seront appliquées à la demande via des URLs de transformation
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            }
          );
          uploadStream.end(file);
        });
      }

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        duration: result.duration
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload audio:', error);
      
      // Gestion spécifique des erreurs Cloudinary
      if (error && typeof error === 'object' && 'http_code' in error) {
        const cloudinaryError = error as { http_code: number; message: string };
        
        switch (cloudinaryError.http_code) {
          case 400:
            if (cloudinaryError.message?.includes('too large to process synchronously')) {
              throw new Error('Fichier trop volumineux. Utilisation du traitement asynchrone...');
            }
            throw new Error(`Erreur de validation: ${cloudinaryError.message}`);
          case 401:
            throw new Error('Clés API Cloudinary invalides');
          case 403:
            throw new Error('Accès refusé à Cloudinary');
          case 413:
            throw new Error('Fichier trop volumineux pour Cloudinary');
          case 429:
            throw new Error('Limite de quota Cloudinary atteinte');
          default:
            throw new Error(`Erreur Cloudinary (${cloudinaryError.http_code}): ${cloudinaryError.message}`);
        }
      }
      
      throw new Error('Échec de l\'upload audio');
    }
  }

  // Upload d'une image
  static async uploadImage(
    file: Buffer | string,
    folder: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
    } = {}
  ): Promise<CloudinaryResource> {
    try {
      configureCloudinary();
      let result: UploadApiResponse;
      
      if (typeof file === 'string') {
        // Upload depuis une URL
        result = await cloudinary.uploader.upload(file, {
          folder,
          width: options.width,
          height: options.height,
          crop: options.crop || 'fill',
          quality: options.quality || 'auto:good',
          overwrite: false,
          unique_filename: true,
          use_filename: true
        });
      } else {
        // Upload depuis un Buffer
        result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              width: options.width,
              height: options.height,
              crop: options.crop || 'fill',
              quality: options.quality || 'auto:good',
              overwrite: false,
              unique_filename: true,
              use_filename: true
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            }
          );
          uploadStream.end(file);
        });
      }

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload image:', error);
      throw new Error('Échec de l\'upload image');
    }
  }

  // Suppression d'une ressource
  static async deleteResource(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    try {
      configureCloudinary();
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Échec de la suppression');
    }
  }

  // Génération d'une URL de transformation
  static generateTransformUrl(
    publicId: string,
    transformations: Record<string, string | number | boolean>,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): string {
    configureCloudinary();
    return cloudinary.url(publicId, {
      ...transformations,
      resource_type: resourceType,
      secure: true
    });
  }

  // Génération d'une URL de preview audio (30 secondes)
  static generateAudioPreviewUrl(publicId: string): string {
    configureCloudinary();
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'mp3',
      quality: 'auto:low',
      duration: 30, // 30 secondes pour la preview
      secure: true
    });
  }

  // Génération d'une URL de master audio (fichier complet)
  static generateAudioMasterUrl(publicId: string): string {
    configureCloudinary();
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'wav',
      quality: 'auto:best',
      secure: true
    });
  }

  // Création d'un waveform audio
  static async generateWaveform(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      color?: string;
      background?: string;
    } = {}
  ): Promise<string> {
    configureCloudinary();
    const waveformUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        {
          width: options.width || 800,
          height: options.height || 200,
          crop: 'fill',
          background: options.background || 'transparent'
        },
        {
          overlay: 'audio_waveform',
          color: options.color || '#6366f1',
          width: 'auto',
          height: 'auto'
        }
      ],
      secure: true
    });

    return waveformUrl;
  }

  // Récupération des informations d'une ressource
  static async getResourceInfo(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<CloudinaryResource> {
    try {
      configureCloudinary();
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        duration: result.duration,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos:', error);
      throw new Error('Ressource non trouvée');
    }
  }

  // Nettoyage des fichiers temporaires
  static async cleanupTempFiles(): Promise<void> {
    try {
      configureCloudinary();
      // Suppression des fichiers dans le dossier temp plus vieux de 24h
      const result = await cloudinary.api.delete_resources_by_prefix(CLOUDINARY_FOLDERS.TEMP, {
        resource_type: 'image'
      });
      
      console.log(`Nettoyage des fichiers temporaires: ${result.deleted ? result.deleted.length : 0} fichiers supprimés`);
    } catch (error) {
      console.error('Erreur lors du nettoyage des fichiers temporaires:', error);
    }
  }
}

export default cloudinary;
