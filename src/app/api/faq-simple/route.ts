import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  console.log(`[FAQ_SIMPLE_API] Fetching FAQ data from database`);

  try {
    // Fetch from database without cache
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
      totalCount: faqs.length,
      cached: false,
      timestamp: new Date().toISOString(),
    };

    console.log(`[FAQ_SIMPLE_API] Found ${faqs.length} FAQs`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[FAQ_SIMPLE_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ data', details: error.message },
      { status: 500 }
    );
  }
}
