#!/usr/bin/env tsx

import { createTestProduct, listProducts } from '../src/lib/stripe'

async function main() {
  try {
    console.log('🚀 Starting Stripe test product creation...')
    
    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY environment variable is not set')
      console.log('Please add your Stripe secret key to your .env.local file')
      console.log('Example: STRIPE_SECRET_KEY=sk_test_your_secret_key_here')
      console.log('')
      console.log('💡 Try running with: STRIPE_SECRET_KEY=your_key_here pnpm run stripe:create-product')
      process.exit(1)
    }

    console.log('✅ STRIPE_SECRET_KEY loaded successfully!')
    console.log('Key length:', process.env.STRIPE_SECRET_KEY.length)
    console.log('First 10 chars:', process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...')

    // Create a test product
    console.log('📦 Creating test product...')
    const { product, price } = await createTestProduct()
    
    console.log('\n🎉 Test product created successfully!')
    console.log('Product ID:', product.id)
    console.log('Price ID:', price.id)
    console.log('Product Name:', product.name)
    console.log('Price:', `€${(price.unit_amount! / 100).toFixed(2)}`)
    
    // List all products to verify
    console.log('\n📋 Listing all products...')
    const products = await listProducts()
    console.log(`Found ${products.length} products:`)
    
    products.forEach((prod) => {
      console.log(`- ${prod.name} (ID: ${prod.id})`)
    })
    
    console.log('\n✅ Script completed successfully!')
    
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

main()
