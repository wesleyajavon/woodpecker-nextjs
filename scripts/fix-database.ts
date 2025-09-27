import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...')
    
    // 1. Mettre à jour les valeurs NON_EXCLUSIVE vers WAV_LEASE
    console.log('📝 Updating NON_EXCLUSIVE values to WAV_LEASE...')
    
    const orderUpdate = await prisma.$executeRaw`
      UPDATE "Order" 
      SET "licenseType" = 'WAV_LEASE' 
      WHERE "licenseType" = 'NON_EXCLUSIVE'
    `
    console.log(`✅ Updated ${orderUpdate} orders`)
    
    const multiOrderUpdate = await prisma.$executeRaw`
      UPDATE "MultiItemOrder" 
      SET "licenseType" = 'WAV_LEASE' 
      WHERE "licenseType" = 'NON_EXCLUSIVE'
    `
    console.log(`✅ Updated ${multiOrderUpdate} multi-item orders`)
    
    // 2. Ajouter les nouveaux champs pour les priceId Stripe
    console.log('📝 Adding Stripe price ID columns...')
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeWavPriceId" TEXT
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeTrackoutPriceId" TEXT
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeUnlimitedPriceId" TEXT
    `
    
    console.log('✅ Added Stripe price ID columns')
    
    console.log('🎉 Database schema fixed successfully!')
    
  } catch (error) {
    console.error('❌ Error fixing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la correction
fixDatabase()
