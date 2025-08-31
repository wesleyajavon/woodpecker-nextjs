#!/usr/bin/env tsx

import Stripe from 'stripe'

async function main() {
  try {
    console.log('🚀 Testing Stripe import...')
    
    // Test that we can create a Stripe instance (this will fail without a key, but that's expected)
    console.log('📦 Creating Stripe instance...')
    
    // This will throw an error, but that's expected - we just want to test the import
    const stripe = new Stripe('sk_test_dummy_key', {
      apiVersion: '2025-08-27.basil',
    })
    
    console.log('✅ Stripe instance created successfully!')
    console.log('✅ Stripe import test passed!')
    
  } catch (error) {
    // We expect this error - it's Stripe complaining about the invalid key
    if (error instanceof Error && error.message.includes('Neither apiKey nor config.authenticator provided')) {
      console.log('✅ Stripe import test passed! (Expected error for invalid key)')
      console.log('📝 Next step: Add your real Stripe secret key to .env.local')
    } else {
      console.error('❌ Unexpected error:', error)
      process.exit(1)
    }
  }
}

main()
