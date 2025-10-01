import { useState, useEffect, useCallback } from 'react';
import { Beat } from '@/types/beat';

interface UseBeatsReturn {
  beats: Beat[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalBeats: number;
  currentPage: number;
  fetchBeats: (page?: number, search?: string, genre?: string) => Promise<void>;
  searchBeats: (search: string) => void;
  filterByGenre: (genre: string) => void;
  changePage: (page: number) => void;
  resetFilters: () => void;
  updateLimit: (newLimit: number) => void;
}

export const useBeats = (
  initialPage: number = 1,
  initialLimit: number = 12
): UseBeatsReturn => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBeats, setTotalBeats] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  const [limit, setLimit] = useState(initialLimit);

  const fetchBeats = useCallback(async (
    page: number = 1,
    search?: string,
    genre?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) params.append('search', search);
      if (genre && genre !== 'Tous') params.append('genre', genre);

      const response = await fetch(`/api/beats?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des beats');
      }

      const result = await response.json();
      
      if (result.success) {
        setBeats(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalBeats(result.pagination.total);
        setCurrentPage(page);
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement des beats:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const searchBeats = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchBeats(1, search, selectedGenre);
  }, [fetchBeats, selectedGenre]);

  const filterByGenre = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    fetchBeats(1, searchTerm, genre);
  }, [fetchBeats, searchTerm]);

  const changePage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchBeats(page, searchTerm, selectedGenre);
    }
  }, [fetchBeats, searchTerm, selectedGenre, totalPages]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedGenre('Tous');
    setCurrentPage(1);
    fetchBeats(1);
  }, [fetchBeats]);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    // Appel direct avec le nouveau limit au lieu d'utiliser fetchBeats
    const fetchWithNewLimit = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: '1',
          limit: newLimit.toString()
        });

        if (searchTerm) params.append('search', searchTerm);
        if (selectedGenre && selectedGenre !== 'Tous') params.append('genre', selectedGenre);

        const response = await fetch(`/api/beats?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des beats');
        }

        const result = await response.json();
        
        if (result.success) {
          setBeats(result.data);
          setTotalPages(result.pagination.totalPages);
          setTotalBeats(result.pagination.total);
          setCurrentPage(1);
        } else {
          throw new Error(result.error || 'Erreur inconnue');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement des beats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWithNewLimit();
  }, [searchTerm, selectedGenre]);

  // Chargement initial
  useEffect(() => {
    fetchBeats(initialPage);
  }, [fetchBeats, initialPage]);

  return {
    beats,
    loading,
    error,
    totalPages,
    totalBeats,
    currentPage,
    fetchBeats,
    searchBeats,
    filterByGenre,
    changePage,
    resetFilters,
    updateLimit
  };
};
