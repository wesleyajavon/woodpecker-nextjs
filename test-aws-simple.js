// Test simple de configuration AWS S3 (sans ListAllMyBuckets)
// Exécuter avec: node test-aws-simple.js

require('dotenv').config()

async function testAWSSimple() {
    console.log('🧪 Test simple de la configuration AWS S3...')
    
    // Vérifier les variables d'environnement
    console.log('\n📋 Variables d\'environnement:')
    console.log(`✅ AWS_REGION: ${process.env.AWS_REGION}`)
    console.log(`✅ AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID}`)
    console.log(`✅ AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '***' : 'MANQUANTE'}`)
    console.log(`✅ AWS_S3_BUCKET_NAME: ${process.env.AWS_S3_BUCKET_NAME}`)
    
    // Test de connexion AWS avec PutObject (plus restrictif)
    try {
        const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
        
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        })
        
        console.log('\n🔗 Test de connexion AWS...')
        
        // Test avec un petit fichier
        const testContent = 'Test de connexion AWS S3'
        const testKey = `test/connection-test-${Date.now()}.txt`
        
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: testKey,
            Body: testContent,
            ContentType: 'text/plain'
        })
        
        await s3Client.send(command)
        
        console.log('✅ Connexion AWS réussie!')
        console.log(`📦 Test upload réussi vers: ${process.env.AWS_S3_BUCKET_NAME}`)
        console.log(`🔑 Clé de test: ${testKey}`)
        
        // Nettoyer le fichier de test
        const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: testKey
        })
        
        await s3Client.send(deleteCommand)
        console.log('🗑️ Fichier de test supprimé')
        
        console.log('\n🎉 Configuration AWS S3 validée!')
        console.log('✅ Vous pouvez maintenant utiliser l\'upload S3 dans votre application')
        
    } catch (error) {
        console.log('❌ Erreur de connexion AWS:', error.message)
        
        if (error.message.includes('AccessDenied')) {
            console.log('💡 Problème de permissions:')
            console.log('   - Vérifiez que vous utilisez les clés de loutsider-s3-user')
            console.log('   - Vérifiez que l\'utilisateur a AmazonS3FullAccess')
        } else if (error.message.includes('NoSuchBucket')) {
            console.log('💡 Bucket non trouvé:')
            console.log('   - Vérifiez le nom du bucket dans AWS_REGION')
            console.log('   - Vérifiez que le bucket existe dans la bonne région')
        } else {
            console.log('💡 Vérifiez vos clés d\'accès et permissions')
        }
    }
}

testAWSSimple()
