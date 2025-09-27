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

// Interface pour les données d'un beat
interface BeatStripeData {
  id: string
  title: string
  description: string | null
  wavLeasePrice: number
  trackoutLeasePrice: number
  unlimitedLeasePrice: number
}

// Fonction pour créer les 3 produits Stripe pour un beat
export async function createBeatStripeProducts(beat: BeatStripeData) {
  try {
    console.log(`🎵 Creating Stripe products for beat: ${beat.title}`)
    
    // Créer le produit principal
    const product = await stripe.products.create({
      name: beat.title,
      description: beat.description || `Beat: ${beat.title}`,
      metadata: {
        beat_id: beat.id,
        type: 'beat'
      }
    })
    
    console.log(`✅ Created product: ${product.id}`)
    
    // Créer les 3 prix pour chaque type de licence
    const [wavPrice, trackoutPrice, unlimitedPrice] = await Promise.all([
      // WAV Lease
      stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(beat.wavLeasePrice * 100), // Convertir en centimes
        currency: 'eur',
        metadata: {
          beat_id: beat.id,
          license_type: 'WAV_LEASE'
        }
      }),
      
      // Trackout Lease
      stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(beat.trackoutLeasePrice * 100),
        currency: 'eur',
        metadata: {
          beat_id: beat.id,
          license_type: 'TRACKOUT_LEASE'
        }
      }),
      
      // Unlimited Lease
      stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(beat.unlimitedLeasePrice * 100),
        currency: 'eur',
        metadata: {
          beat_id: beat.id,
          license_type: 'UNLIMITED_LEASE'
        }
      })
    ])
    
    console.log(`✅ Created prices: WAV=${wavPrice.id}, Trackout=${trackoutPrice.id}, Unlimited=${unlimitedPrice.id}`)
    
    return {
      productId: product.id,
      prices: {
        wav: wavPrice.id,
        trackout: trackoutPrice.id,
        unlimited: unlimitedPrice.id
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating Stripe products:', error)
    throw error
  }
}

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
  wavLeasePrice: number
  trackoutLeasePrice: number
  unlimitedLeasePrice: number
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
    // const priceAmount: number
    
    // if (beat.isExclusive) {
    //   // Exclusive beats are more expensive
    //   priceAmount = 9999 // €99.99
    // } else if (beat.featured) {
    //   // Featured beats get premium pricing
    //   priceAmount = 4999 // €49.99
    // } else {
    //   // Regular beats use the database price or default
     const priceAmount = Math.round((Number(beat.wavLeasePrice) || 29.99) * 100)
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

// Helper function to create a checkout session with license information
// Fonction pour créer une session de checkout avec priceId
export async function createCheckoutSessionWithPriceId(params: {
  priceId: string;
  beatId: string;
  licenseType: string;
  beatTitle: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    const { priceId, beatId, licenseType, beatTitle, successUrl, cancelUrl } = params;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Utiliser le priceId existant
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        beat_id: beatId,
        license_type: licenseType,
        beat_title: beatTitle,
      },
    })

    return session
  } catch (error) {
    console.error('❌ Error creating checkout session with priceId:', error)
    throw error
  }
}

// Fonction pour créer une session de checkout avec licence (fallback avec price_data)
export async function createCheckoutSessionWithLicense(params: {
  beatId: string;
  licenseType: string;
  beatTitle: string;
  price: number;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    const { beatId, licenseType, beatTitle, price, successUrl, cancelUrl } = params;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${beatTitle} - ${licenseType.replace('_', ' ')}`,
              description: `Beat license: ${licenseType.replace('_', ' ')}`,
              metadata: {
                beat_id: beatId,
                license_type: licenseType,
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        beat_id: beatId,
        license_type: licenseType,
        beat_title: beatTitle,
        price: price.toString(),
      },
    })

    return session
  } catch (error) {
    console.error('❌ Error creating checkout session with license:', error)
    throw error
  }
}

// Helper function to create a multi-item checkout session
export async function createMultiItemCheckoutSession(
  items: Array<{ priceId: string; quantity: number; beatTitle: string }>,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const lineItems = items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        item_count: items.length.toString(),
        items: JSON.stringify(items.map(item => ({
          priceId: item.priceId,
          quantity: item.quantity,
          title: item.beatTitle
        }))),
      },
    })

    return session
  } catch (error) {
    console.error('❌ Error creating multi-item checkout session:', error)
    throw error
  }
}
