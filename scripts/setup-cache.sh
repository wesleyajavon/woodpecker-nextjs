#!/bin/bash

# 🚀 Woodpecker Redis Cache Setup Script

echo "🚀 Setting up Woodpecker Redis Cache System..."
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo -e "${YELLOW}Please create .env.local with the following variables:${NC}"
    echo ""
    echo "# Redis Cache (Upstash)"
    echo "UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io"
    echo "UPSTASH_REDIS_REST_TOKEN=your-redis-token"
    echo ""
    echo "You can get these from https://console.upstash.com/"
    exit 1
fi

# Check if required environment variables are set
echo -e "${BLUE}📋 Checking environment variables...${NC}"

if grep -q "UPSTASH_REDIS_REST_URL" .env.local && grep -q "UPSTASH_REDIS_REST_TOKEN" .env.local; then
    echo -e "${GREEN}✅ Redis environment variables found${NC}"
else
    echo -e "${RED}❌ Missing Redis environment variables in .env.local${NC}"
    echo -e "${YELLOW}Please add:${NC}"
    echo "UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io**
    echo "UPSTASH_REDIS_REST_TOKEN=your-redis-token"
    exit 1
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if npm list @upstash/redis > /dev/null 2>&1; then
    echo -e "${GREEN}✅ @upstash/redis is installed${NC}"
else
    echo -e "${YELLOW}📦 Installing @upstash/redis...${NC}"
    npm install @upstash/redis --legacy-peer-deps
fi

# Test Redis connection files exist
echo -e "${BLUE}🔗 Checking Redis configuration...${NC}"
if [ -f "src/lib/redis.ts" ]; then
    echo -e "${GREEN}✅ Redis configuration file found${NC}"
else
    echo -e "${RED}❌ Redis configuration file not found${NC}"
    echo -e "${YELLOW}Please ensure src/lib/redis.ts exists${NC}"
    exit 1
fi

if [ -f "src/lib/cache-upstash.ts" ]; then
    echo -e "${GREEN}✅ Cache manager file found${NC}"
else
    echo -e "${RED}❌ Cache manager file not found${NC}"
    exit 1
fi

# Run cache tests
echo -e "${BLUE}🧪 Running cache tests...${NC}"
if npm run dev > /dev/null 2>&1 & 
then
    DEV_PID=$!
    echo "Starting development server..."
    
    # Wait for server to start
    sleep 10
    
    # Run cache tests
    echo "Running cache tests..."
    if curl -s http://localhost:3000/api/test/cache?action=stats | grep -q "success"; 
    then
        echo -e "${GREEN}✅ Cache system is working correctly${NC}"
    else
        echo -e "${RED}❌ Cache tests failed${NC}"
    fi
    
    # Stop development server
    kill $DEV_PID
    
else
    echo -e "${YELLOW}⚠️ Could not test cache automatically${NC}"
    echo -e "${BLUE}You can test manually by running:${NC}"
    echo "npm run dev"
    echo "curl http://localhost:3000/api/test/cache?action=stats"
fi

# Create cache warmup script
echo -e "${BLUE}🔥 Creating cache warmup script...${NC}"
cat > scripts/warmup-cache.js << 'EOF'
#!/usr/bin/env node
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function warmupCache() {
  console.log('🔥 Warming up Woodpecker cache...');
  
  const endpoints = [
    '/api/faq?language=fr',
    '/api/faq?language=fr&category=licenses',
    '/api/faq?language=en&category=payment',
    '/api/licenses?language=fr',
    '/api/licenses?language=en',
    '/api/privacy?language=fr',
    '/api/privacy?language=en'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(BASE_URL + endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Cached: ${endpoint}`);
      } else {
        console.log(`❌ Failed: ${endpoint}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${endpoint} - ${error.message}`);
    }
  }
  
  console.log('🎉 Cache warmup completed!');
}

warmupCache().catch(console.error);
EOF

chmod +x scripts/warmup-cache.js

# Create cache warmup npm script
if ! grep -q "warmup-cache" package.json; then
    echo -e "${BLUE}📝 Adding warmup script to package.json...${NC}"
    # This is a simplified approach - in reality, you might want to use a JSON parser
    echo "Note: You can add 'warmup-cache': 'node scripts/warmup-cache.js' to your package.json scripts"
fi

# Final instructions
echo ""
echo -e "${GREEN}🎉 Woodpecker Redis Cache System Setup Complete!${NC}"
echo "======================================================"
echo ""
echo -e "${BLUE}📚 Available Commands:${NC}"
echo "npm run dev                    - Start development server"
echo "npm run test:cache             - Run cache tests"
echo "node scripts/warmup-cache.js   - Warm up cache"
echo ""
echo -e "${BLUE}🔗 Test Endpoints:${NC}"
echo "GET /api/test/cache?action=stats          - Get cache statistics"
echo "GET /api/test/cache?action=test-faq       - Test FAQ caching"
echo "GET /api/test/cache?action=test-licenses  - Test license caching"
echo "GET /api/test/cache?action=test-privacy   - Test privacy caching"
echo "GET /api/test/cache?action=clear-static   - Clear static cache"
echo ""
echo -e "${BLUE}⚡ Performance Endpoints:${NC}"
echo "GET /api/faq         - Cached FAQ API"
echo "GET /api/licenses    - Cached licenses API"
echo "GET /api/privacy     - Cached privacy API"
echo ""
echo -e "${BLUE}🛠️ Admin Cache Management:${NC}"
echo "GET /api/admin/cache?action=stats     - Detailed cache stats"
echo "POST /api/admin/cache                 - Admin cache operations"
echo ""
echo -e "${YELLOW}📖 Documentation:${NC}"
echo "See CACHE_SYSTEM_DOCUMENTATION.md for detailed usage and configuration."
echo ""
echo -e "${GREEN}✅ Cache system is ready to use!${NC}"
