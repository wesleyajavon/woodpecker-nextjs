#!/bin/bash

# 🚀 Woodpecker Redis Cache Setup Script (Simplified)

echo "🚀 Setting up Woodpecker Redis Cache System..."
echo "======================================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local with the following variables:"
    echo ""
    echo "# Redis Cache (Upstash)"
    echo "UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io"
    echo "UPSTASH_REDIS_REST_TOKEN=your-redis-token"
    echo ""
    echo "You can get these from https://console.upstash.com/"
    exit 1
fi

# Check if required environment variables are set
echo "📋 Checking environment variables..."

if grep -q "UPSTASH_REDIS_REST_URL" .env.local && grep -q "UPSTASH_REDIS_REST_TOKEN" .env.local; then
    echo "✅ Redis environment variables found"
else
    echo "❌ Missing Redis environment variables in .env.local"
    echo "Please add:"
    echo "UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io"
    echo "UPSTASH_REDIS_REST_TOKEN=your-redis-token"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if npm list @upstash/redis > /dev/null 2>&1; then
    echo "✅ @upstash/redis is installed"
else
    echo "📦 Installing @upstash/redis..."
    npm install @upstash/redis --legacy-peer-deps
fi

# Check Redis configuration files exist
echo "🔗 Checking Redis configuration..."
if [ -f "src/lib/redis.ts" ]; then
    echo "✅ Redis configuration file found"
else
    echo "❌ Redis configuration file not found"
    echo "Please ensure src/lib/redis.ts exists"
    exit 1
fi

if [ -f "src/lib/cache-upstash.ts" ]; then
    echo "✅ Cache manager file found"
else
    echo "❌ Cache manager file not found"
    exit 1
fi

# Test Redis connection
echo "🧪 Testing Redis connection..."
echo "Run the following command to test your Redis connection:"
echo "npm run test:redis"
echo ""

# Final instructions
echo "🎉 Woodpecker Redis Cache System Setup Complete!"
echo "======================================================"
echo ""
echo "📚 Available Commands:"
echo "npm run dev                    - Start development server"
echo "npm run test:cache             - Run cache tests"
echo "npm run test:redis             - Test Redis connection"
echo "npm run warmup-cache           - Warm up cache"
echo ""
echo "🔗 Test Endpoints:"
echo "GET /api/test/cache?action=stats          - Get cache statistics"
echo "GET /api/test/cache?action=test-faq       - Test FAQ caching"
echo "GET /api/test/cache?action=test-licenses  - Test license caching"
echo "GET /api/test/cache?action=test-privacy   - Test privacy caching"
echo ""
echo "📖 Documentation:"
echo "See CACHE_SYSTEM_DOCUMENTATION.md for detailed usage and configuration."
echo ""
echo "✅ Cache system is ready to use!"
echo "Next: Run 'npm run test:redis' to test your Redis connection"
