import { NextRequest, NextResponse } from 'next/server';
import { withUpstashCache } from '@/lib/cache-upstash';
import { WOODPECKER_CACHE_CONFIG } from '@/lib/cache-upstash';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';

  // Simplified cache key
  const cacheKey = `woodpecker:faq-complete:category:${category}:version:2.0`;

  try {
    console.log(`[FAQ_WORKS_API] Fetching FAQ data from database`);
    console.log(`[FAQ_WORKS_API] Cache key: ${cacheKey}`);

    const data = await withUpstashCache(
      cacheKey,
      async () => {
        // Direct database query
        const faqs = await prisma.fAQItem.findMany({
          where: category ? { category: { slug: category }, isActive: true } : { isActive: true },
          include: { category: true },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
        });

        console.log(`[FAQ_WORKS_API] Found ${faqs.length} FAQs in database`);

        // Return raw data structure
        return {
          faqs: faqs.map(faq => ({
            id: faq.id,
            category: faq.category.slug,
            question: faq.question,
            answer: faq.answer,
            featured: faq.featured,
          })),
          totalCount: faqs.length,
          cached: false, // Will be overridden by cache wrapper
          timestamp: new Date().toISOString(),
        };
      },
      { ttl: WOODPECKER_CACHE_CONFIG.FAQ_DATA }
    );

    console.log(`[FAQ_WORKS_API] Returning ${data?.faqs?.length || 0} FAQ items with cached=${data?.cached || false}`);
    return NextResponse.json(data || { faqs: [], totalCount: 0, error: 'Failed to fetch data' });

  } catch (error) {
    console.error('[FAQ_WORKS_API_ERROR]', error);
    return NextResponse.json({ faqs: [], totalCount: 0, error: 'Failed to fetch data' }, { status: 500 });
  }
}
