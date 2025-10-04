import { NextRequest, NextResponse } from 'next/server';
import { UpstashCacheManager, logCacheStats, withFAQCache, withLicenseCache, withPrivacyCache } from '@/lib/cache-upstash';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  try {
    switch (action) {
      case 'stats':
        const stats = await UpstashCacheManager.getCacheStats();
        await logCacheStats();
        
        return NextResponse.json({
          success: true,
          action: 'stats',
          data: stats,
          timestamp: new Date().toISOString()
        });
      
      case 'test-faq':
        const faqData = await withFAQCache(
          { test: true },
          async () => {
            // Simule des données FAQ
            return {
              faq: [
                { id: '1', question: 'Test FAQ Question', answer: 'Test FAQ Answer' }
              ],
              fetched: new Date().toISOString()
            };
          }
        );
        
        return NextResponse.json({
          success: true,
          action: 'test-faq',
          data: faqData,
          cacheKey: 'woodpecker:faq:test:true'
        });
      
      case 'test-licenses':
        const licenseData = await withLicenseCache(
          { language: 'fr' },
          async () => {
            // Simule des données de licences
            return {
              licenses: [
                { id: 'wav', name: 'WAV Lease', features: ['Commercial use', '5k copies'] },
                { id: 'trackout', name: 'Trackout Lease', features: ['Stems included', '10k copies'] },
                { id: 'unlimited', name: 'Unlimited Lease', features: ['Unlimited use', 'All features'] }
              ],
              fetched: new Date().toISOString()
            };
          }
        );
        
        return NextResponse.json({
          success: true,
          action: 'test-licenses',
          data: licenseData,
          cacheKey: 'woodpecker:licenses:language:fr'
        });
      
      case 'test-privacy':
        const privacyData = await withPrivacyCache(
          { version: 'latest' },
          async () => {
            // Simule des données de confidentialité
            return {
              sections: [
                { id: 'introduction', title: 'Introduction', content: 'Privacy policy introduction...' },
                { id: 'data-collection', title: 'Data Collection', content: 'How we collect data...' }
              ],
              fetched: new Date().toISOString()
            };
          }
        );
        
        return NextResponse.json({
          success: true,
          action: 'test-privacy',
          data: privacyData,
          cacheKey: 'woodpecker:privacy:version:latest'
        });
      
      case 'clear-static':
        await UpstashCacheManager.invalidateStaticPages();
        
        return NextResponse.json({
          success: true,
          action: 'clear-static',
          message: 'Static pages cache cleared'
        });
      
      case 'clear-all':
        await UpstashCacheManager.clearAll();
        
        return NextResponse.json({
          success: true,
          action: 'clear-all',
          message: 'All cache cleared'
        });
      
      case 'performance-test':
        const start = Date.now();
        
        // Test de performance - premier appel (cache miss)
        const firstCall = await withFAQCache(
          { performance: 'test' },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simule un appel lent
            return {
              message: 'Performance test data',
              timestamp: new Date().toISOString()
            };
          }
        );
        
        const firstCallTime = Date.now() - start;
        
        // Test de performance - deuxième appel (cache hit)
        const secondStart = Date.now();
        const secondCall = await withFAQCache(
          { performance: 'test' },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simule un appel lent
            return {
              message: 'Performance test data',
              timestamp: new Date().toISOString()
            };
          }
        );
        
        const secondCallTime = Date.now() - secondStart;
        
        return NextResponse.json({
          success: true,
          action: 'performance-test',
          data: {
            firstCall: {
              data: firstCall,
              duration: firstCallTime
            },
            secondCall: {
              data: secondCall,
              duration: secondCallTime
            },
            improvement: `${Math.round(((firstCallTime - secondCallTime) / firstCallTime) * 100)}%`
          }
        });
      
      default:
        const cacheSize = await UpstashCacheManager.getCacheSize();
        
        return NextResponse.json({
          success: true,
          message: 'Woodpecker Cache System Active',
          actions: [
            'stats - Get cache statistics',
            'test-faq - Test FAQ caching',
            'test-licenses - Test licenses caching',
            'test-confidentiality - Test privacy caching',
            'clear-static - Clear static pages cache',
            'clear-all - Clear all cache',
            'performance-test - Run performance test'
          ],
          cacheSize,
          timestamp: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('[CACHE TEST ERROR]', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cache test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, key, value, ttl } = body;
    
    switch (action) {
      case 'set':
        if (!key || value === undefined) {
          return NextResponse.json({
            success: false,
            error: 'Key and value are required'
          }, { status: 400 });
        }
        
        await UpstashCacheManager.set(
          `woodpecker:test:${key}`,
          value,
          ttl
        );
        
        return NextResponse.json({
          success: true,
          action: 'set',
          key: `woodpecker:test:${key}`,
          message: 'Value cached successfully'
        });
      
      case 'get':
        if (!key) {
          return NextResponse.json({
            success: false,
            error: 'Key is required'
          }, { status: 400 });
        }
        
        const cachedValue = await UpstashCacheManager.get(`woodpecker:test:${key}`);
        
        return NextResponse.json({
          success: true,
          action: 'get',
          key: `woodpecker:test:${key}`,
          data: cachedValue,
          cached: cachedValue !== null
        });
      
      case 'delete':
        if (!key) {
          return NextResponse.json({
            success: false,
            error: 'Key is required'
          }, { status: 400 });
        }
        
        await UpstashCacheManager.delete(`woodpecker:test:${key}`);
        
        return NextResponse.json({
          success: true,
          action: 'delete',
          key: `woodpecker:test:${key}`,
          message: 'Key deleted successfully'
        });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['set', 'get', 'delete']
        }, { status: 400 });
    }
  } catch (error) {
    console.error('[CACHE POST ERROR]', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cache operation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
