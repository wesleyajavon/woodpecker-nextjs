import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function safeMigration() {
  try {
    console.log('🔧 Starting safe database migration...')
    
    // 1. Vérifier l'état actuel de la base de données
    console.log('📊 Checking current database state...')
    
    const beats = await prisma.beat.findMany({
      select: {
        id: true,
        title: true,
        wavLeasePrice: true
      },
      take: 5
    })
    
    console.log(`Found ${beats.length} beats in database`)
    
    // 2. Ajouter les nouveaux champs pour les priceId Stripe (sans casser l'existant)
    console.log('📝 Adding Stripe price ID columns...')
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Beat" 
        ADD COLUMN IF NOT EXISTS "stripeWavPriceId" TEXT
      `
      console.log('✅ Added stripeWavPriceId column')
    } catch (error) {
      console.log('ℹ️ stripeWavPriceId column might already exist')
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Beat" 
        ADD COLUMN IF NOT EXISTS "stripeTrackoutPriceId" TEXT
      `
      console.log('✅ Added stripeTrackoutPriceId column')
    } catch (error) {
      console.log('ℹ️ stripeTrackoutPriceId column might already exist')
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Beat" 
        ADD COLUMN IF NOT EXISTS "stripeUnlimitedPriceId" TEXT
      `
      console.log('✅ Added stripeUnlimitedPriceId column')
    } catch (error) {
      console.log('ℹ️ stripeUnlimitedPriceId column might already exist')
    }
    
    // 3. Vérifier que les colonnes ont été ajoutées
    const beatSample = await prisma.beat.findFirst({
      select: {
        id: true,
        title: true,
        stripeWavPriceId: true,
        stripeTrackoutPriceId: true,
        stripeUnlimitedPriceId: true
      }
    })
    
    if (beatSample) {
      console.log('✅ New columns are accessible:', {
        stripeWavPriceId: beatSample.stripeWavPriceId,
        stripeTrackoutPriceId: beatSample.stripeTrackoutPriceId,
        stripeUnlimitedPriceId: beatSample.stripeUnlimitedPriceId
      })
    }
    
    console.log('🎉 Safe migration completed successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Test uploading a new beat to create Stripe products')
    console.log('   2. Run the migration script for existing beats')
    console.log('   3. Verify the system works end-to-end')
    
  } catch (error) {
    console.error('❌ Error during safe migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration sûre
safeMigration()
