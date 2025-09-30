'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import Link from 'next/link';
import { useFeaturedBeats } from '@/hooks/useFeaturedBeats';
import BeatCard from '@/components/BeatCard';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { LayoutTextFlip } from './ui/layout-text-flip';

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
      <section className="pt-12 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Beats en vedette
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mes meilleurs beats
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-foreground text-lg">Chargement des beats...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredBeats.length === 0) {
    return (
      <section className="pt-12 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Beats en vedette
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mes meilleurs beats
            </p>
          </div>
          <div className="text-center py-16">
            <div className="text-muted-foreground text-lg mb-4">
              Aucun beat en vedette pour le moment
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 pb-20">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
            <LayoutTextFlip
              text="Les beats "
              words={["en feu", "masterclass", "en pétard", "pépites", "bouillants", "crackito"]}
              duration={2500}
            />
          </motion.div>
          <p className="mt-4 text-center text-xl text-muted-foreground max-w-2xl mx-auto">
            Que des bangers dans cette sélection d&apos;instrus qui retournent tout en ce moment.          </p>
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
                className="group relative bg-card/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-card/20 transition-all duration-500"
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
          className="text-center flex justify-center"
        >
          <Link href="/beats">
            <HoverBorderGradient
              containerClassName="rounded-2xl"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
              duration={1.5}
              clockwise={true}
            >
              Voir tous mes beats
              <Music className="w-5 h-5" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
