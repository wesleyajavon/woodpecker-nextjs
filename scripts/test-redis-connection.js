/**
 * Test Redis connection for Woodpecker Cache System
 * Run with: node scripts/test-redis-connection.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Simple Redis client creation for testing
const { Redis } = require('@upstash/redis');

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('❌ Missing Redis environment variables!');
  console.error('Please add to .env.local:');
  console.error('UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io');
  console.error('UPSTASH_REDIS_REST_TOKEN=your-redis-token');
  process.exit(1);
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function testRedisConnection() {
  console.log('🔗 Testing Redis connection...');
  
  try {
    // Try to ping Redis
    await redis.ping();
    console.log('✅ Redis connection successful!');
    
    // Try to set and get a test value
    await redis.set('woodpecker:test:connection', 'Hello from Woodpecker!');
    const testValue = await redis.get('woodpecker:test:connection');
    
    if (testValue === 'Hello from Woodpecker!') {
      console.log('✅ Redis read/write operations working!');
      
      // Clean up test value
      await redis.del('woodpecker:test:connection');
      console.log('✅ Redis operations completed successfully!');
      
      process.exit(0);
    } else {
      console.log('❌ Redis read operation failed - unexpected value');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.error('');
    console.error('Please check:');
    console.error('1. UPSTASH_REDIS_REST_URL is correct');
    console.error('2. UPSTASH_REDIS_REST_TOKEN is correct');
    console.error('3. Your Upstash database is active');
    console.error('4. Your environment variables are loaded');
    
    process.exit(1);
  }
}

// Run the test
testRedisConnection();
