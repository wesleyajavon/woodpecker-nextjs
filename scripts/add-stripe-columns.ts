import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addStripeColumns() {
  try {
    console.log('🔧 Adding Stripe price ID columns to database...')
    
    // Ajouter les colonnes pour les priceId Stripe
    console.log('📝 Adding stripeWavPriceId column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeWavPriceId" TEXT
    `
    console.log('✅ Added stripeWavPriceId column')
    
    console.log('📝 Adding stripeTrackoutPriceId column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeTrackoutPriceId" TEXT
    `
    console.log('✅ Added stripeTrackoutPriceId column')
    
    console.log('📝 Adding stripeUnlimitedPriceId column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeUnlimitedPriceId" TEXT
    `
    console.log('✅ Added stripeUnlimitedPriceId column')
    
    // Vérifier que les colonnes ont été ajoutées
    console.log('🔍 Verifying columns were added...')
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Beat' 
      AND column_name IN ('stripeWavPriceId', 'stripeTrackoutPriceId', 'stripeUnlimitedPriceId')
    `
    
    console.log('✅ Columns found:', result)
    
    console.log('🎉 Stripe columns added successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Test the application to ensure it still works')
    console.log('   2. Upload a new beat to test Stripe product creation')
    console.log('   3. Run migration script for existing beats if needed')
    
  } catch (error) {
    console.error('❌ Error adding Stripe columns:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter l'ajout des colonnes
addStripeColumns()
