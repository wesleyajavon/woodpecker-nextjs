'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List, Play, Pause, Info, ShoppingCart, Star } from 'lucide-react';
import { useBeats } from '@/hooks/useBeats';

export default function BeatsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);

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
    resetFilters
  } = useBeats(1, 12);

  // Genres disponibles
  const genres = ['Tous', 'Trap', 'Hip-Hop', 'Drill', 'Jazz', 'Electronic', 'Boom Bap', 'Synthwave', 'R&B', 'Pop', 'Rock'];

  // Gestion de la lecture/arrêt
  const togglePlay = (beatId: string) => {
    if (playingBeat === beatId) {
      setPlayingBeat(null);
    } else {
      setPlayingBeat(beatId);
    }
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Affichage des étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
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
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Vue grille
                    <>
                      <div className="relative mb-4">
                        <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-2xl font-bold mb-2">{beat.genre}</div>
                            <div className="text-sm opacity-80">{beat.bpm} BPM</div>
                          </div>
                        </div>
                        
                        {/* Bouton play/pause */}
                        <button
                          onClick={() => togglePlay(beat.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                        >
                          {playingBeat === beat.id ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>

                        {/* Badge exclusif */}
                        {beat.isExclusive && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                            EXCLUSIF
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white truncate">{beat.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{beat.description}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{beat.bpm} BPM</span>
                          <span>•</span>
                          <span>{beat.key}</span>
                          <span>•</span>
                          <span>{beat.duration}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {renderStars(beat.rating)}
                          </div>
                          <span className="text-gray-400 text-sm">({beat.reviewCount})</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {beat.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-white">{formatPrice(beat.price)}</span>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Acheter
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Vue liste
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <div className="text-center text-white">
                              <div className="text-sm font-bold">{beat.genre}</div>
                              <div className="text-xs opacity-80">{beat.bpm} BPM</div>
                            </div>
                            
                            <button
                              onClick={() => togglePlay(beat.id)}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                            >
                              {playingBeat === beat.id ? (
                                <Pause className="w-8 h-8 text-white" />
                              ) : (
                                <Play className="w-8 h-8 text-white" />
                              )}
                            </button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white truncate">{beat.title}</h3>
                            <p className="text-gray-300 text-sm line-clamp-2">{beat.description}</p>
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>{beat.bpm} BPM</span>
                              <span>{beat.key}</span>
                              <span>{beat.duration}</span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                {renderStars(beat.rating)}
                              </div>
                              <span className="text-gray-400 text-sm">({beat.reviewCount})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <span className="text-2xl font-bold text-white">{formatPrice(beat.price)}</span>
                              {beat.isExclusive && (
                                <div className="text-yellow-500 text-xs font-bold mt-1">EXCLUSIF</div>
                              )}
                            </div>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Acheter
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mt-12"
              >
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Précédent
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Suivant
                </button>
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
            Besoin d'un beat personnalisé ?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Je peux créer un beat sur mesure selon vos besoins spécifiques. Contactez-moi pour discuter de votre projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Commander un beat personnalisé
            </button>
            <a
              href="/upload-test"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-white/20 hover:border-white/30"
            >
              Tester l'Upload
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
