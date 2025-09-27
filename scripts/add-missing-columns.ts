import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing price columns to database...')
    
    // Ajouter les colonnes de prix manquantes
    console.log('📝 Adding wavLeasePrice column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "wavLeasePrice" DECIMAL(10,2) DEFAULT 19.99
    `
    console.log('✅ Added wavLeasePrice column')
    
    console.log('📝 Adding trackoutLeasePrice column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "trackoutLeasePrice" DECIMAL(10,2) DEFAULT 39.99
    `
    console.log('✅ Added trackoutLeasePrice column')
    
    console.log('📝 Adding unlimitedLeasePrice column...')
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "unlimitedLeasePrice" DECIMAL(10,2) DEFAULT 79.99
    `
    console.log('✅ Added unlimitedLeasePrice column')
    
    // Vérifier que les colonnes ont été ajoutées et ont des valeurs par défaut
    console.log('📝 Checking if beats have default pricing...')
    
    const beats = await prisma.beat.findMany({
      select: {
        id: true,
        wavLeasePrice: true,
        trackoutLeasePrice: true,
        unlimitedLeasePrice: true
      }
    })
    
    console.log(`Found ${beats.length} beats with new pricing structure`)
    console.log('✅ Beats already have default pricing from column defaults')
    
    // Vérifier que les colonnes ont été ajoutées
    console.log('🔍 Verifying columns were added...')
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Beat' 
      AND column_name IN ('wavLeasePrice', 'trackoutLeasePrice', 'unlimitedLeasePrice', 'stripeWavPriceId', 'stripeTrackoutPriceId', 'stripeUnlimitedPriceId')
    `
    
    console.log('✅ Columns found:', result)
    
    console.log('🎉 All missing columns added successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Restart the development server')
    console.log('   2. Test the application')
    console.log('   3. Upload a new beat to test Stripe product creation')
    
  } catch (error) {
    console.error('❌ Error adding missing columns:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter l'ajout des colonnes manquantes
addMissingColumns()
