import { S3Client } from '@aws-sdk/client-s3'

// Configuration AWS S3
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Configuration du bucket
export const S3_CONFIG = {
  bucketName: process.env.AWS_S3_BUCKET_NAME!,
  region: process.env.AWS_REGION || 'us-east-1',
  
  // Dossiers pour organiser les fichiers
  folders: {
    BEATS: {
      MASTERS: 'beats/masters',
      STEMS: 'beats/stems',
      PREVIEWS: 'beats/previews', // Optionnel, on peut garder Cloudinary
      ARTWORKS: 'beats/artworks'  // Optionnel, on peut garder Cloudinary
    }
  },
  
  // Limites de taille (en bytes)
  limits: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxStemsSize: 1 * 1024 * 1024 * 1024, // 1GB pour les stems
  },
  
  // Types de fichiers autorisés
  allowedTypes: {
    audio: ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/flac'],
    zip: ['application/zip', 'application/x-zip-compressed'],
  },
  
  // URLs publiques
  getPublicUrl: (key: string) => {
    return `https://${S3_CONFIG.bucketName}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`
  }
}

// Types pour les uploads S3
export interface S3UploadResult {
  key: string
  url: string
  bucket: string
  size: number
  contentType: string
}

export interface S3UploadOptions {
  folder: string
  fileName: string
  contentType: string
  metadata?: Record<string, string>
}
