import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'fr';
  const category = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const featuredOnly = searchParams.get('featured') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  console.log(`[FAQ_API] Fetching FAQ data from database for language: ${language}, category: ${category}`);

  try {
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
      cached: false,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('[FAQ_API_ERROR]', error);
    return NextResponse.json({ faqs: [], totalCount: 0, error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Keep the original function for backward compatibility
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
    });

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
      totalCount: faqs.length,
      cached: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[getFaqData_ERROR]', error);
    return {
      faqs: [],
      totalCount: 0,
      cached: false,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch FAQ data from database',
    };
  }
}