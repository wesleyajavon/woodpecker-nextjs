'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useFeaturedBeats } from '@/hooks/useFeaturedBeats';
import BeatCard from '@/components/BeatCard';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { LayoutTextFlip } from './ui/layout-text-flip';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

export default function FeaturedProducts() {
  const [playingBeat, setPlayingBeat] = useState<string | null>(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

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
      <section className="pt-8 pb-12 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t('featured.description')}
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-500 mx-auto mb-3 md:mb-4"></div>
              <p className="text-foreground text-sm md:text-lg">{t('featured.loading')}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredBeats.length === 0) {
    return (
      <section className="pt-8 pb-12 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {t('featured.description')}
            </p>
          </div>
          <div className="text-center py-8 md:py-16">
            <div className="text-muted-foreground text-sm md:text-lg mb-4 px-4">
              {t('featured.noBeats')}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-12 md:pt-12 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">{t('featured.badge')}</span>
          </motion.div>

          <motion.div className="relative mx-2 my-2 md:mx-4 md:my-4 flex flex-col items-center justify-center gap-2 md:gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
            <LayoutTextFlip
              text={`${t('featured.title')} `}
              words={translations[language].featured.words}
              duration={2500}
            />
          </motion.div>
          <p className="mt-3 md:mt-4 text-center text-base sm:text-lg md:text-xl text-foreground max-w-2xl mx-auto px-4">
            {t('featured.description')}
          </p>
        </motion.div>

        {/* Grid des beats - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
          {featuredBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -5,
                scale: 1.01
              }}
              className="w-full"
            >
              <BeatCard
                beat={beat}
                isPlaying={playingBeat === beat.id}
                onPlay={togglePlay}
                onPause={togglePlay}
                className="group relative bg-card/10 backdrop-blur-lg rounded-xl md:rounded-2xl overflow-hidden hover:bg-card/20 transition-all duration-500 w-full h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center flex justify-center px-4"
        >
          <Link href="/beats" className="w-full sm:w-auto">
            <HoverBorderGradient
              containerClassName="rounded-xl md:rounded-2xl w-full sm:w-auto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              duration={1.5}
              clockwise={true}
            >
              {t('featured.viewAllBeats')}
              <Music className="w-4 h-4 md:w-5 md:h-5" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
