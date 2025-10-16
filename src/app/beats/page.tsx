'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List, ChevronLeft, ChevronRight, Music, TrendingUp, Users, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useBeats } from '@/hooks/useBeats';
import BeatCard from '@/components/BeatCard';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { TextRewind } from '@/components/ui/text-rewind';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

export default function BeatsPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Utilisation du hook personnalisé
  const {
    beats,
    loading,
    error,
    totalPages,
    totalBeats,
    currentPage,
    searchBeats,
    filterByGenre,
    changePage,
    resetFilters,
    updateLimit
  } = useBeats(1, itemsPerPage);

  // Genres disponibles
  const genres = [t('beats.allGenres'), 'Trap', 'Hip-Hop', 'Drill', 'Jazz', 'Electronic', 'Boom Bap', 'Synthwave', 'R&B', 'Pop', 'Rock'];
  
  // Calculer les statistiques réelles
  const uniqueGenres = new Set(beats.map(beat => beat.genre)).size;
  const beatsWithStems = beats.filter(beat => beat.stemsUrl).length;
  const stemsPercentage = totalBeats > 0 ? Math.round((beatsWithStems / totalBeats) * 100) : 0;

  // Gestion de la lecture/arrêt
  const togglePlay = async (beatId: string, previewUrl?: string) => {
    if (playingBeat === beatId) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingBeat(null);
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Start new audio if preview URL exists
      if (previewUrl) {
        try {
          const audio = new Audio(previewUrl);
          audioRef.current = audio;
          
          // Handle audio events
          audio.addEventListener('canplaythrough', () => {
            setPlayingBeat(beatId);
          });
          
          audio.addEventListener('error', () => {
            console.error('Error playing audio');
            setPlayingBeat(null);
          });
          
          audio.addEventListener('ended', () => {
            setPlayingBeat(null);
            audioRef.current = null;
          });
          
          await audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
          setPlayingBeat(null);
        }
      }
    }
  };

  // Cleanup audio when component unmounts or playingBeat changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop audio when playingBeat changes to null
  useEffect(() => {
    if (!playingBeat && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playingBeat]);

  // Pagination helpers
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalBeats);

  const goToPage = (page: number) => {
    changePage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    updateLimit(newItemsPerPage);
  };

  if (loading && beats.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <DottedSurface className="size-full z-0" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
              'bg-[radial-gradient(ellipse_at_center,var(--theme-gradient),transparent_50%)]',
              'blur-[30px]',
            )}
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-foreground text-lg">{t('beats.loadingBeats')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <DottedSurface className="size-full z-0" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
              'bg-[radial-gradient(ellipse_at_center,var(--theme-gradient),transparent_50%)]',
              'blur-[30px]',
            )}
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg mb-4">{t('beats.errorLoading')}</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => resetFilters()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('beats.retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <DottedSurface className="size-full z-0" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,var(--theme-gradient),transparent_50%)]',
            'blur-[30px]',
          )}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 mt-6"
          >
            <TextRewind text={t('beats.title')} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
{t('beats.description')}
          </motion.p>
        </div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-border/20"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Barre de recherche */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder={t('beats.searchPlaceholder')}
                onChange={(e) => searchBeats(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-card/20 border border-border/30 rounded-lg text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation"
              />
            </div>

            {/* Filtres et contrôles */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Filtre par genre */}
              <div className="flex items-center gap-2 flex-1">
                <Filter className="text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <select
                  onChange={(e) => filterByGenre(e.target.value)}
                  className="w-full bg-card/20 border border-border/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre} className="bg-card text-foreground">
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items per page selector */}
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full sm:w-auto bg-card/20 border border-border/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation"
              >
                <option value={4} className="bg-card text-foreground">{t('beats.itemsPerPage', { count: '4' })}</option>
                <option value={8} className="bg-card text-foreground">{t('beats.itemsPerPage', { count: '8' })}</option>
                <option value={12} className="bg-card text-foreground">{t('beats.itemsPerPage', { count: '12' })}</option>
                <option value={24} className="bg-card text-foreground">{t('beats.itemsPerPage', { count: '24' })}</option>
              </select>

              {/* Toggle de vue */}
              <div className="flex items-center gap-1 sm:gap-2 bg-card/20 rounded-lg p-1 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-2 rounded-md transition-colors touch-manipulation ${
                    viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2 rounded-md transition-colors touch-manipulation ${
                    viewMode === 'list' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Beats */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white/5 dark:bg-black/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/5">
                    <Music className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalBeats}</p>
                    <p className="text-xs text-purple-300 font-medium">{t('beats.stats.beats')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>Professional quality</span>
                </div>
              </div>
            </motion.div>

            {/* Available Genres */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white/5 dark:bg-black/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/5">
                    <Music className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{uniqueGenres}</p>
                    <p className="text-xs text-blue-300 font-medium">Genres</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>Diverse styles</span>
                </div>
              </div>
            </motion.div>

            {/* Beats with Stems */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white/5 dark:bg-black/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/5">
                    <Music className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{beatsWithStems}</p>
                    <p className="text-xs text-green-300 font-medium">With Stems</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>{stemsPercentage}% of beats</span>
                </div>
              </div>
            </motion.div>

            {/* Featured Beats */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white/5 dark:bg-black/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 dark:border-white/5">
                    <Star className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{beats.filter(beat => beat.featured).length}</p>
                    <p className="text-xs text-orange-300 font-medium">Featured</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>Premium selection</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>Commercial Rights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Grille des beats */}
        {beats.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {beats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <BeatCard
                    beat={beat}
                    isPlaying={playingBeat === beat.id}
                    onPlay={togglePlay}
                    onPause={togglePlay}
                    className={viewMode === 'list' ? 'flex items-center' : ''}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-border/20 mt-8 sm:mt-12"
              >
                {/* Results info - full width on mobile */}
                <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
                  <span className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                    {t('beats.showingResults', { start: startIndex.toString(), end: endIndex.toString(), total: totalBeats.toString() })}
                  </span>
                </div>
                
                {/* Pagination controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-2">
                  {/* Previous button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-card/10 border border-border/20 rounded-lg text-xs sm:text-sm text-foreground hover:bg-card/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation w-full sm:w-auto justify-center"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('pagination.previous')}</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1 sm:gap-1">
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
                          className={`px-3 sm:px-3 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                              : 'bg-card/10 text-muted-foreground hover:bg-card/20'
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
                    className="flex items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-card/10 border border-border/20 rounded-lg text-xs sm:text-sm text-foreground hover:bg-card/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation w-full sm:w-auto justify-center"
                  >
                    <span className="hidden sm:inline">{t('pagination.next')}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <div className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6">
              {t('beats.noBeatsAvailable')}
            </div>
            <button
              onClick={resetFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base touch-manipulation"
            >
              {t('beats.resetFilters')}
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center flex justify-center mt-12 sm:mt-16 px-4"
        >
          <Link href="/contact">
            <HoverBorderGradient
              containerClassName="rounded-xl sm:rounded-2xl"
              className="inline-flex items-center gap-2 text-foreground px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 touch-manipulation"
              duration={1.5}
              clockwise={true}
            >
{t('beats.customBeatCTA')}
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
