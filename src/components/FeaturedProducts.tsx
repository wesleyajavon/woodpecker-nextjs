'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ShoppingCart, Star, Clock, Music } from 'lucide-react';
import { useFeaturedBeats } from '@/hooks/useFeaturedBeats';
import CheckoutButton from '@/components/CheckoutButton';

export default function FeaturedProducts() {
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);

  // Utilisation du hook personnalisé
  const { featuredBeats, loading, error } = useFeaturedBeats(4);

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

  // Animation des cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <section className="pt-12 pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Beats en vedette
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mes meilleurs beats
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Chargement des beats...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredBeats.length === 0) {
    return (
      <section className="pt-12 pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Beats en vedette
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mes meilleurs beats
            </p>
          </div>
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              Aucun beat en vedette pour le moment
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Beats en vedette
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mes meilleurs beats
          </p>
        </motion.div>

        {/* Grille des beats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-500"
            >
              {/* Image/Preview */}
              <div className="relative h-48 overflow-hidden">
                {beat.artworkUrl ? (
                  <img
                    src={beat.artworkUrl}
                    alt={`${beat.title} artwork`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-3xl font-bold mb-2">{beat.genre}</div>
                      <div className="text-sm opacity-80">{beat.bpm} BPM</div>
                    </div>
                  </div>
                )}
                
                {/* Bouton play/pause */}
                <button
                  onClick={() => togglePlay(beat.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {playingBeat === beat.id ? (
                    <Pause className="w-16 h-16 text-white" />
                  ) : (
                    <Play className="w-16 h-16 text-white ml-2" />
                  )}
                </button>

                {/* Badge exclusif */}
                {beat.isExclusive && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                    EXCLUSIF
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{beat.bpm} BPM</span>
                      <span>•</span>
                      <span>{beat.key}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{beat.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-purple-400 font-semibold">
                    {beat.genre}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(beat.rating)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {beat.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {beat.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {beat.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Prix et CTA */}
                <div className="flex items-center justify-between">
                  {/* <span className="text-2xl font-bold text-white">
                    {formatPrice(beat.price)}
                  </span> */}
                  <CheckoutButton
                    priceId={beat.stripePriceId || beat.id} // Use Stripe price ID if available, fallback to beat ID
                    beatTitle={beat.title}
                    price={beat.price}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/beats"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-lg border border-white/20 hover:border-white/30"
          >
            Voir tous mes beats
            <Music className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
