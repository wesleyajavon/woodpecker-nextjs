'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useBeats } from '@/hooks/useBeats';
import BeatCard from '@/components/BeatCard';

export default function BeatsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);
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
  const genres = ['Tous', 'Trap', 'Hip-Hop', 'Drill', 'Jazz', 'Electronic', 'Boom Bap', 'Synthwave', 'R&B', 'Pop', 'Rock'];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Chargement des beats...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg mb-4">Erreur de chargement</p>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => resetFilters()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Mes Beats
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Découvrez ma collection exclusive de beats originaux. Des instrumentaux uniques pour rappeurs, chanteurs et producteurs.
          </motion.p>
        </div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                  type="text"
                  placeholder="Rechercher un beat..."
                  onChange={(e) => searchBeats(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            {/* Filtre par genre */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                onChange={(e) => filterByGenre(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-gray-800 text-white">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Items per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={6} className="bg-gray-800 text-white">6 par page</option>
              <option value={12} className="bg-gray-800 text-white">12 par page</option>
              <option value={24} className="bg-gray-800 text-white">24 par page</option>
              <option value={48} className="bg-gray-800 text-white">48 par page</option>
            </select>

            {/* Toggle de vue */}
            <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{totalBeats}</p>
            <p className="text-gray-300">Beats</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{genres.length - 1}</p>
            <p className="text-gray-300">Genres</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">∞</p>
            <p className="text-gray-300">Possibilités</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="text-gray-300">Disponible</p>
          </div>
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
                className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mt-12"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">
                    Affichage de {startIndex} à {endIndex} sur {totalBeats} beats
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
                    Précédent
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
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-lg mb-4">
              Aucun beat disponible pour le moment
            </div>
            <button
              onClick={resetFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Besoin d&apos;un beat personnalisé ?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Je peux créer un beat sur mesure selon vos besoins spécifiques. Contactez-moi pour discuter de votre projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-center"
            >
              Commander un beat personnalisé
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
