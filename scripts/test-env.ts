#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

async function main() {
  try {
    console.log('🚀 Testing environment variables...')
    
    console.log('📋 Environment variables:')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0)
    console.log('STRIPE_PUBLISHABLE_KEY exists:', !!process.env.STRIPE_PUBLISHABLE_KEY)
    
    if (process.env.STRIPE_SECRET_KEY) {
      console.log('✅ STRIPE_SECRET_KEY is loaded!')
      console.log('First 10 chars:', process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...')
    } else {
      console.log('❌ STRIPE_SECRET_KEY is not loaded')
    }
    
    if (process.env.STRIPE_PUBLISHABLE_KEY) {
      console.log('✅ STRIPE_PUBLISHABLE_KEY is loaded!')
      console.log('First 10 chars:', process.env.STRIPE_PUBLISHABLE_KEY.substring(0, 10) + '...')
    } else {
      console.log('❌ STRIPE_PUBLISHABLE_KEY is not loaded')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
