import Stripe from 'stripe'
import { config } from 'dotenv'

// Load environment variables if not already loaded
if (!process.env.STRIPE_SECRET_KEY) {
  config({ path: '.env.local' })
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

// Helper function to create a test product
export async function createTestProduct() {
  try {
    // Create a test product
    const product = await stripe.products.create({
      name: 'Test Beat - Midnight Trap',
      description: 'A test beat product for development purposes',
      metadata: {
        genre: 'Trap',
        bpm: '140',
        key: 'C#',
        duration: '3:24',
      },
    })

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2999, // $29.99 in cents
      currency: 'eur',
      metadata: {
        product_id: product.id,
      },
    })

    console.log('✅ Test product created:', {
      productId: product.id,
      priceId: price.id,
      name: product.name,
      price: `€${(price.unit_amount! / 100).toFixed(2)}`,
    })

    return { product, price }
  } catch (error) {
    console.error('❌ Error creating test product:', error)
    throw error
  }
}

// Helper function to create Stripe products for all beats from Prisma
export async function createStripeProductsForAllBeats() {
  try {
    // Dynamic import to avoid build-time issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    console.log('🔄 Fetching beats from database...')
    
    // Fetch all active beats from the database
    const beats = await prisma.beat.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        genre: true,
        bpm: true,
        key: true,
        duration: true,
        price: true,
        tags: true,
        isExclusive: true,
        featured: true,
      }
    })

    console.log(`📊 Found ${beats.length} beats to process`)

    const results = []

    for (const beat of beats) {
      try {
        console.log(`\n🎵 Processing beat: ${beat.title}`)

        // Check if product already exists in Stripe
        const existingProducts = await stripe.products.search({
          query: `name:'${beat.title.replace(/'/g, "\\'")}'`,
        })

        if (existingProducts.data.length > 0) {
          console.log(`⚠️  Product already exists: ${beat.title}`)
          results.push({
            beat: beat.title,
            status: 'skipped',
            reason: 'Product already exists in Stripe',
            existingProductId: existingProducts.data[0].id,
          })
          continue
        }

        // Create Stripe product
        const product = await stripe.products.create({
          name: beat.title,
          description: beat.description || `Beat ${beat.genre} - ${beat.bpm} BPM`,
          metadata: {
            beat_id: beat.id,
            genre: beat.genre,
            bpm: beat.bpm.toString(),
            key: beat.key,
            duration: beat.duration,
            is_exclusive: beat.isExclusive.toString(),
            featured: beat.featured.toString(),
            tags: beat.tags.join(','),
          },
        })

        // Set different prices based on beat characteristics
        let priceAmount: number
        
        if (beat.isExclusive) {
          // Exclusive beats are more expensive
          priceAmount = 9999 // €99.99
        } else if (beat.featured) {
          // Featured beats get premium pricing
          priceAmount = 4999 // €49.99
        } else {
          // Regular beats use the database price or default
          priceAmount = Math.round((Number(beat.price) || 29.99) * 100)
        }

        // Create price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceAmount,
          currency: 'eur',
          metadata: {
            beat_id: beat.id,
            product_id: product.id,
            price_type: beat.isExclusive ? 'exclusive' : beat.featured ? 'featured' : 'regular',
          },
        })

        // Update the beat in the database with the Stripe price ID
        await prisma.beat.update({
          where: { id: beat.id },
          data: { stripePriceId: price.id }
        })

        console.log(`✅ Created product: ${beat.title}`)
        console.log(`   Price: €${(priceAmount / 100).toFixed(2)}`)
        console.log(`   Product ID: ${product.id}`)
        console.log(`   Price ID: ${price.id}`)
        console.log(`   Updated database with Stripe price ID`)

        results.push({
          beat: beat.title,
          status: 'created',
          productId: product.id,
          priceId: price.id,
          price: `€${(priceAmount / 100).toFixed(2)}`,
          priceType: beat.isExclusive ? 'exclusive' : beat.featured ? 'featured' : 'regular',
        })

      } catch (error) {
        console.error(`❌ Error processing beat ${beat.title}:`, error)
        results.push({
          beat: beat.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    await prisma.$disconnect()

    // Summary
    console.log('\n📋 Summary:')
    const created = results.filter(r => r.status === 'created').length
    const skipped = results.filter(r => r.status === 'skipped').length
    const errors = results.filter(r => r.status === 'error').length

    console.log(`✅ Created: ${created}`)
    console.log(`⚠️  Skipped: ${skipped}`)
    console.log(`❌ Errors: ${errors}`)

    return results

  } catch (error) {
    console.error('❌ Error creating Stripe products for beats:', error)
    throw error
  }
}

// Helper function to list all products
export async function listProducts() {
  try {
    const products = await stripe.products.list({
      limit: 100,
    })

    return products.data
  } catch (error) {
    console.error('❌ Error listing products:', error)
    throw error
  }
}

// Helper function to get a product by ID
export async function getProduct(productId: string) {
  try {
    const product = await stripe.products.retrieve(productId)
    return product
  } catch (error) {
    console.error('❌ Error retrieving product:', error)
    throw error
  }
}

// Helper function to create a Stripe product for a single beat
export async function createStripeProductForBeat(beat: {
  id: string
  title: string
  description?: string | null
  genre: string
  bpm: number
  key: string
  duration: string
  price: number
  tags: string[]
  isExclusive: boolean
  featured: boolean
}) {
  try {
    console.log(`🎵 Creating Stripe product for beat: ${beat.title}`)

    // Check if product already exists in Stripe
    const existingProducts = await stripe.products.search({
      query: `name:'${beat.title.replace(/'/g, "\\'")}'`,
    })

    if (existingProducts.data.length > 0) {
      console.log(`⚠️  Product already exists: ${beat.title}`)
      return {
        success: false,
        reason: 'Product already exists in Stripe',
        existingProductId: existingProducts.data[0].id,
      }
    }

    // Create Stripe product
    const product = await stripe.products.create({
      name: beat.title,
      description: beat.description || `Beat ${beat.genre} - ${beat.bpm} BPM`,
      metadata: {
        beat_id: beat.id,
        genre: beat.genre,
        bpm: beat.bpm.toString(),
        key: beat.key,
        duration: beat.duration,
        is_exclusive: beat.isExclusive.toString(),
        featured: beat.featured.toString(),
        tags: beat.tags.join(','),
      },
    })

    // Set different prices based on beat characteristics
    let priceAmount: number
    
    // if (beat.isExclusive) {
    //   // Exclusive beats are more expensive
    //   priceAmount = 9999 // €99.99
    // } else if (beat.featured) {
    //   // Featured beats get premium pricing
    //   priceAmount = 4999 // €49.99
    // } else {
    //   // Regular beats use the database price or default
      priceAmount = Math.round((Number(beat.price) || 29.99) * 100)
    // }

    // Create price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: priceAmount,
      currency: 'eur',
      metadata: {
        beat_id: beat.id,
        product_id: product.id,
        price_type: beat.isExclusive ? 'exclusive' : beat.featured ? 'featured' : 'regular',
      },
    })

    console.log(`✅ Created product: ${beat.title}`)
    console.log(`   Price: €${(priceAmount / 100).toFixed(2)}`)
    console.log(`   Product ID: ${product.id}`)
    console.log(`   Price ID: ${price.id}`)

    return {
      success: true,
      productId: product.id,
      priceId: price.id,
      price: `€${(priceAmount / 100).toFixed(2)}`,
      priceType: beat.isExclusive ? 'exclusive' : beat.featured ? 'featured' : 'regular',
    }

  } catch (error) {
    console.error(`❌ Error creating Stripe product for beat ${beat.title}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Helper function to create a checkout session
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        price_id: priceId,
      },
    })

    return session
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    throw error
  }
}
