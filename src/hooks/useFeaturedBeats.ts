import { useState, useEffect, useCallback } from 'react';
import { Beat } from '@/types/beat';

interface UseFeaturedBeatsReturn {
  featuredBeats: Beat[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFeaturedBeats = (limit: number = 4): UseFeaturedBeatsReturn => {
  const [featuredBeats, setFeaturedBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedBeats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/beats/featured?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des beats en vedette');
      }

      const result = await response.json();
      
      if (result.success) {
        setFeaturedBeats(result.data);
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement des beats en vedette:', err);
      // En cas d'erreur, on garde un tableau vide
      setFeaturedBeats([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = useCallback(async () => {
    await fetchFeaturedBeats();
  }, [fetchFeaturedBeats]);

  // Chargement initial
  useEffect(() => {
    fetchFeaturedBeats();
  }, [fetchFeaturedBeats]);

  return {
    featuredBeats,
    loading,
    error,
    refetch
  };
};
