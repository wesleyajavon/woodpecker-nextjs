import { PrismaClient } from '@prisma/client'
import { createBeatStripeProducts } from '../src/lib/stripe'

const prisma = new PrismaClient()

async function migrateStripePrices() {
  try {
    console.log('🚀 Starting Stripe prices migration...')
    
    // Récupérer tous les beats qui n'ont pas encore de priceId Stripe
    const beats = await prisma.beat.findMany({
      where: {
        stripeWavPriceId: null // Utiliser le nouveau champ
      }
    })
    
    console.log(`📊 Found ${beats.length} beats to migrate`)
    
    for (const beat of beats) {
      try {
        console.log(`🎵 Processing beat: ${beat.title}`)
        
        // Créer les produits Stripe (utiliser les nouveaux champs de prix)
        const stripeProducts = await createBeatStripeProducts({
          id: beat.id,
          title: beat.title,
          description: beat.description,
          wavLeasePrice: Number(beat.wavLeasePrice),
          trackoutLeasePrice: Number(beat.trackoutLeasePrice),
          unlimitedLeasePrice: Number(beat.unlimitedLeasePrice)
        })
        
        // Mettre à jour le beat avec les priceId
        await prisma.beat.update({
          where: { id: beat.id },
          data: {
            stripeWavPriceId: stripeProducts.prices.wav,
            stripeTrackoutPriceId: stripeProducts.prices.trackout,
            stripeUnlimitedPriceId: stripeProducts.prices.unlimited
          }
        })
        
        console.log(`✅ Updated beat: ${beat.title}`)
        
        // Pause pour éviter de surcharger Stripe
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Error processing beat ${beat.title}:`, error)
        // Continuer avec le beat suivant
      }
    }
    
    console.log('🎉 Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateStripePrices()
