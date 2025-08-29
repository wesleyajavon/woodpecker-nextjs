// Configuration des variables d'environnement
export const env = {
  // Base de données
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Next.js
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Prisma
  PRISMA_STUDIO_PORT: process.env.PRISMA_STUDIO_PORT || '5555',
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  
  // Validation des variables requises
  validate() {
    const required = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    const missing = required.filter(key => !this[key as keyof typeof this])
    
    if (missing.length > 0) {
      throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`)
    }
  }
}

// Validation au démarrage en production
if (process.env.NODE_ENV === 'production') {
  env.validate()
}
