import multer from 'multer';
import { NextApiRequest } from 'next';
import { FILE_CONFIG } from '@/config/constants';

// Types pour l'upload
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// Configuration du stockage temporaire
const storage = multer.memoryStorage();

// Validation des types de fichiers
const fileFilter = (req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Validation des fichiers audio
  if (file.fieldname === 'audio') {
    if (FILE_CONFIG.allowedAudioFormats.some(format => 
      file.originalname.toLowerCase().endsWith(format)
    )) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier audio non supporté'));
    }
  }
  // Validation des images
  else if (file.fieldname === 'image') {
    if (FILE_CONFIG.allowedImageFormats.some(format => 
      file.originalname.toLowerCase().endsWith(format)
    )) {
      cb(null, true);
    } else {
      cb(new Error('Format d\'image non supporté'));
    }
  }
  // Validation des archives (stems)
  else if (file.fieldname === 'archive') {
    if (FILE_CONFIG.allowedArchiveFormats.some(format => 
      file.originalname.toLowerCase().endsWith(format)
    )) {
      cb(null, true);
    } else {
      cb(new Error('Format d\'archive non supporté'));
    }
  }
  // Fichier non reconnu
  else {
    cb(new Error('Type de fichier non supporté'));
  }
};

// Configuration de Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_CONFIG.maxAudioSize, // Limite par défaut (100MB)
    files: 10 // Maximum 10 fichiers par requête
  }
});

// Configuration spécifique pour les beats
export const beatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_CONFIG.maxAudioSize,
    files: 5
  }
}).fields([
  { name: 'preview', maxCount: 1 },
  { name: 'master', maxCount: 1 },
  { name: 'stems', maxCount: 1 },
  { name: 'artwork', maxCount: 1 }
]);

// Configuration pour l'upload d'artwork
export const artworkUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'artwork') {
      if (FILE_CONFIG.allowedImageFormats.some(format => 
        file.originalname.toLowerCase().endsWith(format)
      )) {
        cb(null, true);
      } else {
        cb(new Error('Format d\'image non supporté'));
      }
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
  limits: {
    fileSize: FILE_CONFIG.maxImageSize,
    files: 1
  }
}).single('artwork');

// Configuration pour l'upload de stems
export const stemsUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'stems') {
      if (FILE_CONFIG.allowedArchiveFormats.some(format => 
        file.originalname.toLowerCase().endsWith(format)
      )) {
        cb(null, true);
      } else {
        cb(new Error('Format d\'archive non supporté'));
      }
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
  limits: {
    fileSize: FILE_CONFIG.maxArchiveSize,
    files: 1
  }
}).single('stems');

// Middleware d'erreur pour Multer
export const handleUploadError = (error: Error | multer.MulterError, req: NextApiRequest, res: { status: (code: number) => { json: (data: unknown) => unknown } }) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux',
        maxSize: FILE_CONFIG.maxAudioSize / (1024 * 1024) + 'MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Trop de fichiers',
        maxFiles: 10
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Champ de fichier inattendu'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      error: error.message
    });
  }
  
  return res.status(500).json({
    error: 'Erreur lors de l\'upload'
  });
};

// Validation des fichiers uploadés
export const validateUploadedFiles = (files: Record<string, { fieldname: string; originalname: string; size: number } | { fieldname: string; originalname: string; size: number }[] | undefined>, requiredFields: string[] = []) => {
  const errors: string[] = [];
  
  // Vérification des champs requis
  for (const field of requiredFields) {
    const fieldFiles = files[field];
    if (!fieldFiles || (Array.isArray(fieldFiles) && fieldFiles.length === 0)) {
      errors.push(`Le champ ${field} est requis`);
    }
  }
  
  // Vérification de la taille des fichiers
  for (const field in files) {
    const fieldFiles = files[field];
    if (fieldFiles) {
      const fileArray = Array.isArray(fieldFiles) ? fieldFiles : [fieldFiles];
      
      for (const file of fileArray) {
        if (file && file.size > FILE_CONFIG.maxAudioSize) {
          errors.push(`Le fichier ${file.originalname} est trop volumineux`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
