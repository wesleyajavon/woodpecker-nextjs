import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.fAQCategory.count();
    
    // Test Redis connection (simple test)
    const UpstashCacheManager = (await import('@/lib/cache-upstash')).UpstashCacheManager;
    await UpstashCacheManager.set('health-test', 'ok', 10);
    const test = await UpstashCacheManager.get('health-test');
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      redis: test === 'ok' ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[HEALTH_CHECK_ERROR]', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
