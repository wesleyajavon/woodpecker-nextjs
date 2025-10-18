'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Play, Pause, Star, Lock, ChevronLeft, ChevronRight, Grid3X3, List, Music } from 'lucide-react';
import Link from 'next/link';
import { Beat } from '@/types/beat';
import { useTranslation, useLanguage } from '@/hooks/useApp';
import { useAdminBeats, useDeleteAdminBeat, useToggleBeatStatus } from '@/hooks/queries/useAdminBeats';

interface BeatManagerProps {
  onEdit?: (beat: Beat) => void;
  onDelete?: (beatId: string) => void;
  onToggleStatus?: (beatId: string, isActive: boolean) => void;
}

export default function BeatManager({ onEdit, onDelete, onToggleStatus }: BeatManagerProps) {
  const { t } = useTranslation();
  const language = useLanguage();
  
  // TanStack Query hooks
  const { 
    data: beats = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useAdminBeats({ 
    limit: 100, 
    includeInactive: true 
  });
  
  const deleteBeatMutation = useDeleteAdminBeat();
  const toggleStatusMutation = useToggleBeatStatus();
  
  // État local pour l'UI
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);
  const [filterGenre, setFilterGenre] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGenre]);

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

  // Gestion des mutations
  const handleDeleteBeat = async (beatId: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        await deleteBeatMutation.mutateAsync(beatId);
        onDelete?.(beatId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(t('admin.deleteError'));
      }
    }
  };

  const handleToggleStatus = async (beatId: string, isActive: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id: beatId, isActive });
      onToggleStatus?.(beatId, isActive);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert(t('admin.updateError'));
    }
  };

  // Gestion de la lecture
  const togglePlay = (beatId: string) => {
    setPlayingBeat(playingBeat === beatId ? null : beatId);
  };

  // Gestion des erreurs
  const error = queryError ? (queryError instanceof Error ? queryError.message : t('errors.generic')) : null;

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
            onClick={() => refetch()}
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
      <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t('admin.searchBeats')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 sm:pl-4 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base touch-manipulation"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base touch-manipulation"
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
              className="flex-1 sm:flex-none sm:w-auto bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base touch-manipulation"
            >
              <option value={3} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 3 })}</option>
              <option value={10} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 10 })}</option>
              <option value={20} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 20 })}</option>
              <option value={50} className="bg-gray-800 text-white">{t('beats.itemsPerPage', { count: 50 })}</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 rounded-lg p-1 w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-2 rounded-md transition-colors touch-manipulation ${
                  viewMode === 'list' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title={t('admin.listView')}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 sm:p-2 rounded-md transition-colors touch-manipulation ${
                  viewMode === 'card' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title={t('admin.cardView')}
              >
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          {/* <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
            {t('admin.beatsFound', { count: filteredBeats.length })}
          </div> */}
        </div>
      </div>

      {/* Liste des beats */}
      <div className={`${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}`}>
        {paginatedBeats.map((beat) => (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-all duration-300 ${
              viewMode === 'card' ? 'p-4 sm:p-6' : 'p-4 sm:p-6'
            }`}
          >
            {viewMode === 'card' ? (
              // Card View Layout
              <div className="space-y-4">
                {/* Card Header with Artwork */}
                <div className="flex items-start gap-4">
                  {/* Artwork */}
                  <div className="flex-shrink-0">
                    {beat.artworkUrl ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-800/50">
                        <img
                          src={beat.artworkUrl}
                          alt={beat.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                        <Music className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Title and Badges */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-2">{beat.title}</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
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
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm sm:text-base line-clamp-2">{beat.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                    <span>{beat.genre}</span>
                    <span>•</span>
                    <span>{beat.bpm} BPM</span>
                    <span>•</span>
                    <span>{beat.key}</span>
                    <span>•</span>
                    <span>{beat.duration}</span>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-2">
                    {/* <div className="text-xs text-gray-400 font-medium">{t('admin.pricing')}</div> */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-xs text-purple-300 font-medium">WAV</div>
                        <div className="text-xs sm:text-sm text-white font-semibold">{formatPrice(beat.wavLeasePrice)}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-xs text-blue-300 font-medium">Trackout</div>
                        <div className="text-xs sm:text-sm text-white font-semibold">{formatPrice(beat.trackoutLeasePrice)}</div>
                      </div>
                      <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-xs text-green-300 font-medium">Unlimited</div>
                        <div className="text-xs sm:text-sm text-white font-semibold">{formatPrice(beat.unlimitedLeasePrice)}</div>
                      </div>
                    </div>
                  </div>

                  {beat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {beat.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {beat.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                          +{beat.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <Link
                    href={`/admin/beats/${beat.id}`}
                    className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all duration-300 touch-manipulation"
                    title="Voir les détails"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(beat.id, beat.isActive)}
                    disabled={toggleStatusMutation.isPending}
                    className={`p-2 rounded-lg transition-colors touch-manipulation ${beat.isActive
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                        : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                      } ${toggleStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={beat.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {toggleStatusMutation.isPending ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : beat.isActive ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // List View Layout (existing)
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Informations du beat */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">{beat.title}</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
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
                </div>

                <p className="text-gray-300 mb-3 line-clamp-2 text-sm sm:text-base">{beat.description}</p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                  <span>{beat.genre}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{beat.bpm} BPM</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{beat.key}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{beat.duration}</span>
                </div>

                {/* Pricing Section for List View */}
                <div className="flex items-center gap-3 mb-3">
                  {/* <div className="text-xs text-gray-400 font-medium">{t('admin.pricing')}:</div> */}
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded border border-purple-500/20">
                      <span className="text-xs text-purple-300 font-medium">WAV</span>
                      <span className="text-xs text-white font-semibold">{formatPrice(beat.wavLeasePrice)}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20">
                      <span className="text-xs text-blue-300 font-medium">Trackout</span>
                      <span className="text-xs text-white font-semibold">{formatPrice(beat.trackoutLeasePrice)}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded border border-green-500/20">
                      <span className="text-xs text-green-300 font-medium">Unlimited</span>
                      <span className="text-xs text-white font-semibold">{formatPrice(beat.unlimitedLeasePrice)}</span>
                    </div>
                  </div>
                </div>

                {beat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
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
              <div className="flex items-center justify-center sm:justify-end gap-2 sm:ml-6">
                <Link
                  href={`/admin/beats/${beat.id}`}
                    className="p-2.5 sm:p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all duration-300 touch-manipulation"
                  title="Voir les détails"
                >
                  <Edit className="w-4 h-4 sm:w-4 sm:h-4" />
                </Link>

                <button
                  onClick={() => handleToggleStatus(beat.id, beat.isActive)}
                  disabled={toggleStatusMutation.isPending}
                  className={`p-2.5 sm:p-2 rounded-lg transition-colors touch-manipulation ${beat.isActive
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                    } ${toggleStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={beat.isActive ? 'Désactiver' : 'Activer'}
                >
                  {toggleStatusMutation.isPending ? (
                    <div className="w-4 h-4 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : beat.isActive ? (
                    <Lock className="w-4 h-4 sm:w-4 sm:h-4" />
                  ) : (
                    <Star className="w-4 h-4 sm:w-4 sm:h-4" />
                  )}
                </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredBeats.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 gap-3 sm:gap-0">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
              {t('beats.showingResults', { start: startIndex + 1, end: Math.min(endIndex, filteredBeats.length), total: filteredBeats.length })}
            </span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Previous button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg text-white hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm touch-manipulation"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('pagination.previous')}</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-white'
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
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg text-white hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm touch-manipulation"
            >
              <span className="hidden sm:inline">{t('pagination.next')}</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message si aucun beat trouvé */}
      {filteredBeats.length === 0 && (
        <div className="text-center py-8 sm:py-16 px-4">
          <div className="text-gray-400 text-base sm:text-lg mb-4">
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
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base touch-manipulation shadow-lg hover:shadow-xl"
            >
              {t('beats.resetFilters')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
