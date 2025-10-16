import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { withUserRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Vérification du rate limiting pour les routes critiques
    const rateLimitResult = await withUserRateLimit(request, 'CRITICAL')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database to check role and get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch single orders with beat information, filtered by admin user's beats
    const orders = await prisma.order.findMany({
      where: {
        beat: {
          userId: user.id
        }
      },
      include: {
        beat: {
          select: {
            id: true,
            title: true,
            genre: true,
            bpm: true,
            key: true,
            duration: true,
            wavLeasePrice: true,
            trackoutLeasePrice: true,
            unlimitedLeasePrice: true,
            isExclusive: true,
            featured: true,
            fullUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}