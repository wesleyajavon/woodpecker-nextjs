#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createStripeProductsForAllBeats } from '../src/lib/stripe'

async function main() {
  try {
    console.log('🚀 Starting Stripe products creation for all beats...')
    
    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY environment variable is not set')
      console.log('Please add your Stripe secret key to your .env.local file')
      console.log('Example: STRIPE_SECRET_KEY=sk_test_your_secret_key_here')
      console.log('')
      console.log('💡 Try running with: STRIPE_SECRET_KEY=your_key_here pnpm run stripe:create-beats')
      process.exit(1)
    }

    console.log('✅ STRIPE_SECRET_KEY loaded successfully!')
    console.log('Key length:', process.env.STRIPE_SECRET_KEY.length)
    console.log('First 10 chars:', process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...')

    // Create Stripe products for all beats
    console.log('\n📦 Creating Stripe products for all beats...')
    const results = await createStripeProductsForAllBeats()
    
    console.log('\n🎉 Process completed!')
    console.log('\n📋 Detailed Results:')
    
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.beat}`)
      console.log(`   Status: ${result.status}`)
      
      if (result.status === 'created') {
        console.log(`   Product ID: ${result.productId}`)
        console.log(`   Price ID: ${result.priceId}`)
        console.log(`   Price: ${result.price}`)
        console.log(`   Type: ${result.priceType}`)
      } else if (result.status === 'skipped') {
        console.log(`   Reason: ${result.reason}`)
        console.log(`   Existing Product ID: ${result.existingProductId}`)
      } else if (result.status === 'error') {
        console.log(`   Error: ${result.error}`)
      }
    })
    
    console.log('\n✅ Script completed successfully!')
    
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

main()
