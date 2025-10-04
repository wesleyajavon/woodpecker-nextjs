import { NextRequest, NextResponse } from 'next/server';
import { withUpstashCache } from '@/lib/cache-upstash';
import { WOODPECKER_CACHE_CONFIG } from '@/lib/cache-upstash';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration du cache pour les FAQ
const FAQ_CACHE_CONFIG = {
  ttl: WOODPECKER_CACHE_CONFIG.FAQ_DATA, // 12 hours by default
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'fr';
  const category = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const featuredOnly = searchParams.get('featured') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Generate cache key with all parameters
  const cacheKey = `woodpecker:faq:category:${category}:language:${language}:search:${searchQuery}:featured:${featuredOnly}:page:${page}:limit:${limit}:version:1.0`;

  const data = await withUpstashCache(
    cacheKey,
    async () => {
      console.log(`[FAQ_API] Fetching FAQ data from database for language: ${language}, category: ${category}`);

      try {
        // Build where conditions
        const where: any = {
          isActive: true,
        };

        if (category) {
          where.category = { slug: category };
        }

        if (featuredOnly) {
          where.featured = true;
        }

        if (searchQuery) {
          where.OR = [
            { question: { contains: searchQuery, mode: 'insensitive' } },
            { answer: { contains: searchQuery, mode: 'insensitive' } },
          ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch from database
        const [faqs, totalCount] = await Promise.all([
          prisma.fAQItem.findMany({
            where,
            include: {
              category: true,
            },
            orderBy: [
              { featured: 'desc' },
              { sortOrder: 'asc' },
              { createdAt: 'desc' },
            ],
            skip,
            take: limit,
          }),
          prisma.fAQItem.count({ where }),
        ]);

        const data = {
          faqs: faqs.map(faq => ({
            id: faq.id,
            category: faq.category.slug,
            categoryName: faq.category.displayName,
            question: faq.question,
            answer: faq.answer,
            shortAnswer: faq.shortAnswer,
            featured: faq.featured,
            slug: faq.slug,
          })),
          totalCount,
          filters: {
            category,
            search: searchQuery,
            language,
            featuredOnly,
          },
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: page < Math.ceil(totalCount / limit),
            hasPrev: page > 1,
          },
          cached: false, // Will be set by the cache wrapper
          timestamp: new Date().toISOString(),
        };

        return data;
      } catch (error) {
        console.error('[FAQ_API_ERROR]', error);
        throw error;
      }
    },
    { ttl: FAQ_CACHE_CONFIG.ttl }
  );

  return NextResponse.json(data || { faqs: [], totalCount: 0, error: 'Failed to fetch data' });
}

// Keep the original function for backward compatibility (for test endpoints)
export async function getFaqData(language: string = 'fr') {
  try {
    const faqs = await prisma.fAQItem.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 10,
    });

    const data = {
      faqs: faqs.map(faq => ({
        id: faq.id,
        category: faq.category.slug,
        question: faq.question,
        answer: faq.answer,
        featured: faq.featured,
      })),
      cached: true,
      timestamp: new Date().toISOString(),
    };

    return data;
  } catch (error) {
    console.error('[getFaqData_ERROR]', error);
    return {
      faqs: [],
      cached: false,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch FAQ data from database',
    };
  }
}