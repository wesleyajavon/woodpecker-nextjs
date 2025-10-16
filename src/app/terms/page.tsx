'use client';

import { DottedSurface } from '@/components/ui/dotted-surface';
import { TextRewind } from '@/components/ui/text-rewind';
import { AlertTriangle, Clock } from 'lucide-react';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import TermsContent from '@/components/TermsContent';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState('2 janvier 2025');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [language]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DottedSurface />
      
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

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="mb-16 mt-6">
                <TextRewind text={`${t('terms.title')} ${t('terms.titleHighlight')}`} />
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                {t('terms.subtitle')}
              </p>
              
              {/* Last Updated Card */}
              <div className="bg-card/20 backdrop-blur-xl rounded-2xl border border-border/30 p-6 shadow-xl max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <strong>{t('terms.lastUpdated')}:</strong> {lastUpdated}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <div className="bg-card/20 backdrop-blur-xl rounded-2xl border border-border/30 p-8 shadow-xl">
                <TermsContent />
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/30 p-8 shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {t('terms.importantNotice')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.importantNoticeDescription')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.questionsContact')}
                    <a href="mailto:contact@loutsider.com" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 font-medium">
                      contact@loutsider.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
