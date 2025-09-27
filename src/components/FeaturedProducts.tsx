'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { useFeaturedBeats } from '@/hooks/useFeaturedBeats';
import BeatCard from '@/components/BeatCard';

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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <BeatCard
                beat={beat}
                isPlaying={playingBeat === beat.id}
                onPlay={togglePlay}
                onPause={togglePlay}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-500"
              />
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
