import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isUserAdmin } from '@/lib/roleUtils';
import { getRateLimitStats, RateLimitManager } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Vérification du rôle admin
    const isAdmin = await isUserAdmin(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle admin requis.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier') || RateLimitManager.getIdentifier(request);

    // Obtenir les statistiques de rate limiting
    const stats = await getRateLimitStats(identifier);

    return NextResponse.json({
      success: true,
      data: {
        identifier,
        stats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[RATE_LIMIT_STATS_ERROR]', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques de rate limiting',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    // Vérification du rôle admin
    const isAdmin = await isUserAdmin(session.user.email);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle admin requis.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, identifier } = body;

    switch (action) {
      case 'reset':
        // Réinitialiser les compteurs de rate limiting pour un identifiant
        const resetIdentifier = identifier || RateLimitManager.getIdentifier(request);
        
        // Supprimer toutes les clés de rate limiting pour cet identifiant
        const { redis } = await import('@/lib/redis');
        const patterns = [
          'rate_limit:general:*',
          'rate_limit:critical:*',
          'rate_limit:read:*',
          'rate_limit:upload:*',
          'rate_limit:download:*',
          'rate_limit:admin:*'
        ];
        
        let deletedKeys = 0;
        for (const pattern of patterns) {
          const keys = await redis.keys(`${pattern}:${resetIdentifier}:*`);
          if (keys.length > 0) {
            await redis.del(...keys);
            deletedKeys += keys.length;
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Rate limiting reset pour l'identifiant: ${resetIdentifier}`,
          deletedKeys
        });

      case 'test':
        // Tester le rate limiting pour un identifiant
        const testIdentifier = identifier || RateLimitManager.getIdentifier(request);
        const testStats = await getRateLimitStats(testIdentifier);
        
        return NextResponse.json({
          success: true,
          data: {
            identifier: testIdentifier,
            stats: testStats,
            testResults: Object.entries(testStats).map(([type, info]) => ({
              type,
              limit: info.limit,
              remaining: info.remaining,
              percentage: Math.round((info.remaining / info.limit) * 100)
            }))
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Action invalide',
          availableActions: ['reset', 'test']
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[RATE_LIMIT_ADMIN_ERROR]', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'opération de rate limiting',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
