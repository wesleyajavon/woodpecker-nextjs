// Script de test pour AWS S3
// Exécuter avec: node test-s3.js

const { s3Service } = require('./src/lib/s3-service')
const fs = require('fs')
const path = require('path')

async function testS3Upload() {
  try {
    console.log('🧪 Test de l\'upload S3...')
    
    // Créer un fichier de test
    const testContent = 'Ceci est un fichier de test pour S3'
    const testBuffer = Buffer.from(testContent, 'utf8')
    
    // Test d'upload
    const result = await s3Service.uploadFile(testBuffer, {
      folder: 'test',
      fileName: 'test-file.txt',
      contentType: 'text/plain',
      metadata: {
        test: 'true',
        uploadedAt: new Date().toISOString()
      }
    })
    
    console.log('✅ Upload réussi!')
    console.log('📁 Clé S3:', result.key)
    console.log('🔗 URL publique:', result.url)
    console.log('📊 Taille:', result.size, 'bytes')
    
    // Test de vérification d'existence
    const exists = await s3Service.fileExists(result.key)
    console.log('🔍 Fichier existe:', exists)
    
    // Test de métadonnées
    const metadata = await s3Service.getFileMetadata(result.key)
    console.log('📋 Métadonnées:', metadata)
    
    // Test de suppression
    await s3Service.deleteFile(result.key)
    console.log('🗑️ Fichier supprimé')
    
    console.log('🎉 Tous les tests sont passés!')
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    console.error('💡 Vérifiez vos variables d\'environnement AWS')
  }
}

// Exécuter le test
testS3Upload()
