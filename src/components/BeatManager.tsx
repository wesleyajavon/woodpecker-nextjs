'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Play, Pause, Star, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Beat } from '@/types/beat';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';

interface BeatManagerProps {
  onEdit?: (beat: Beat) => void;
  onDelete?: (beatId: string) => void;
  onToggleStatus?: (beatId: string, isActive: boolean) => void;
}

export default function BeatManager({ onEdit, onDelete, onToggleStatus }: BeatManagerProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);
  const [filterGenre, setFilterGenre] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Récupération des beats
  useEffect(() => {
    fetchBeats();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGenre]);

  const fetchBeats = async () => {
    try {
      setLoading(true);
      // Utiliser l'API admin pour récupérer tous les beats de l'admin connecté (actifs et inactifs)
      const response = await fetch('/api/admin/beats?limit=100&includeInactive=true');

      if (!response.ok) {
        throw new Error(t('admin.beatsLoadError'));
      }

      const result = await response.json();

      if (result.success) {
        setBeats(result.data);
      } else {
        throw new Error(result.error || t('errors.generic'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des beats
  const filteredBeats = beats.filter(beat => {
    const matchesGenre = filterGenre === 'Tous' || beat.genre === filterGenre;
    const matchesSearch = beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBeats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBeats = filteredBeats.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Gestion de la lecture
  const togglePlay = (beatId: string) => {
    setPlayingBeat(playingBeat === beatId ? null : beatId);
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Gestion de la suppression
  const handleDelete = async (beatId: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        const response = await fetch(`/api/beats/${beatId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setBeats(prev => prev.filter(beat => beat.id !== beatId));
          onDelete?.(beatId);
        } else {
          throw new Error(t('admin.deleteError'));
        }
      } catch (error) {
        console.error('Erreur de suppression:', error);
        alert(t('admin.deleteError'));
      }
    }
  };

  // Gestion du statut
  const handleToggleStatus = async (beatId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/beats/${beatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setBeats(prev => prev.map(beat =>
          beat.id === beatId ? { ...beat, isActive: !currentStatus } : beat
        ));
        onToggleStatus?.(beatId, !currentStatus);
      } else {
        throw new Error(t('admin.updateError'));
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      alert(t('admin.updateError'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('admin.loadingBeats')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 text-lg mb-4">{t('admin.loadingError')}</p>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchBeats}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
{t('errors.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={t('admin.searchBeats')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Tous" className="bg-gray-800 text-white">{t('beats.allGenres')}</option>
            {Array.from(new Set(beats.map(beat => beat.genre))).map(genre => (
              <option key={genre} value={genre} className="bg-gray-800 text-white">
                {genre}
              </option>
            ))}
          </select>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={5} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 5 })}</option>
            <option value={10} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 10 })}</option>
            <option value={25} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 25 })}</option>
            <option value={50} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 50 })}</option>
          </select>

          <div className="text-sm text-gray-300">
{t('admin.beatsFound', { count: filteredBeats.length })}
          </div>
        </div>
      </div>

      {/* Liste des beats */}
      <div className="space-y-4">
        {paginatedBeats.map((beat) => (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              {/* Informations du beat */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{beat.title}</h3>
                  {beat.isExclusive && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
{t('beatCard.exclusive').toUpperCase()}
                    </span>
                  )}
                  {beat.featured && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
{t('admin.featured').toUpperCase()}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${beat.isActive
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
{beat.isActive ? t('admin.active') : t('admin.inactive')}
                  </span>
                </div>

                <p className="text-gray-300 mb-3 line-clamp-2">{beat.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{beat.genre}</span>
                  <span>•</span>
                  <span>{beat.bpm} BPM</span>
                  <span>•</span>
                  <span>{beat.key}</span>
                  <span>•</span>
                  <span>{beat.duration}</span>
                  <span>•</span>
                  <span className="text-purple-300 font-medium">{formatPrice(beat.wavLeasePrice)}</span>
                </div>

                {beat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {beat.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-6">
                {/* Bouton play/pause
                <button
                  onClick={() => togglePlay(beat.id)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  {playingBeat === beat.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button> */}




                {/* Bouton modifier */}

                <Link
                  href={`/admin/beats/${beat.id}`}
                  className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                {/* Bouton statut */}
                <button
                  onClick={() => handleToggleStatus(beat.id, beat.isActive)}
                  className={`p-2 rounded-lg transition-colors ${beat.isActive
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                    }`}
                  title={beat.isActive ? 'Désactiver' : 'Activer'}
                >
                  {beat.isActive ? <Lock className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                </button>

                {/* Bouton supprimer
                <button
                  onClick={() => handleDelete(beat.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredBeats.length > 0 && (
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
  {t('beats.showingResults', { start: startIndex + 1, end: Math.min(endIndex, filteredBeats.length), total: filteredBeats.length })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
{t('pagination.previous')}
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
{t('pagination.next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message si aucun beat trouvé */}
      {filteredBeats.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-4">
            {searchTerm || filterGenre !== 'Tous'
              ? t('admin.noBeatsWithCriteria')
              : t('beats.noBeatsAvailable')
            }
          </div>
          {(searchTerm || filterGenre !== 'Tous') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGenre('Tous');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
{t('beats.resetFilters')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
