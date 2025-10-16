import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { withFAQCache } from '@/lib/cache-upstash';
import { withRateLimit, RateLimitManager } from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Vérification du rate limiting pour les lectures
    const rateLimitResult = await withRateLimit(request, 'READ')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'fr';
    const category = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const featuredOnly = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Paramètres pour la génération de la clé de cache
    const cacheParams = {
      language,
      category: category || 'all',
      search: searchQuery || 'none',
      featured: featuredOnly ? 'true' : 'false',
      page: page.toString(),
      limit: limit.toString(),
    };

    console.log(`[FAQ_API] Fetching FAQ data with cache for language: ${language}, category: ${category}`);

    const data = await withFAQCache(
      cacheParams,
      async () => {
        console.log(`[FAQ_API] Cache MISS - Fetching from database for language: ${language}, category: ${category}`);

        // Build where conditions
        const where: Prisma.FAQItemWhereInput = {
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

        return {
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
          cached: false,
          timestamp: new Date().toISOString(),
        };
      }
    );

    // Marquer comme caché si récupéré du cache
    const responseData = {
      ...data,
      cached: true,
      timestamp: new Date().toISOString(),
    };

    const response = NextResponse.json(responseData);
    
    // Ajouter les headers de rate limiting
    if ('info' in rateLimitResult) {
      return RateLimitManager.addRateLimitHeaders(response, rateLimitResult.info);
    }
    
    return response;
  } catch (error) {
    console.error('[FAQ_API_ERROR]', error);
    return NextResponse.json({ faqs: [], totalCount: 0, error: 'Failed to fetch data' }, { status: 500 });
  }
}
