// Test simple de configuration AWS S3
// Exécuter avec: node test-aws-config.js

require('dotenv').config()

async function testAWSConfig() {
    console.log('🧪 Test de la configuration AWS S3...')
    
    // Vérifier les variables d'environnement
    const requiredVars = [
        'AWS_REGION',
        'AWS_ACCESS_KEY_ID', 
        'AWS_SECRET_ACCESS_KEY',
        'AWS_S3_BUCKET_NAME'
    ]
    
    console.log('\n📋 Variables d\'environnement:')
    for (const varName of requiredVars) {
        const value = process.env[varName]
        if (value) {
            console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`)
        } else {
            console.log(`❌ ${varName}: MANQUANTE`)
        }
    }
    
    // Test de connexion AWS
    try {
        const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3')
        
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        })
        
        console.log('\n🔗 Test de connexion AWS...')
        const command = new ListBucketsCommand({})
        const response = await s3Client.send(command)
        
        console.log('✅ Connexion AWS réussie!')
        console.log(`📦 Buckets disponibles: ${response.Buckets.length}`)
        
        // Vérifier si notre bucket existe
        const bucketExists = response.Buckets.some(bucket => 
            bucket.Name === process.env.AWS_S3_BUCKET_NAME
        )
        
        if (bucketExists) {
            console.log(`✅ Bucket "${process.env.AWS_S3_BUCKET_NAME}" trouvé!`)
        } else {
            console.log(`❌ Bucket "${process.env.AWS_S3_BUCKET_NAME}" non trouvé`)
        }
        
    } catch (error) {
        console.log('❌ Erreur de connexion AWS:', error.message)
        console.log('💡 Vérifiez vos clés d\'accès et permissions')
    }
}

testAWSConfig()
