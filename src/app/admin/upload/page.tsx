'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, Music, Settings, BarChart3, Plus, ShoppingBag } from 'lucide-react';
import BeatUpload from '@/components/BeatUpload';
import BeatManager from '@/components/BeatManager';
import AdminStats from '@/components/AdminStats';
import AdminStatsGraphics from '@/components/AdminStatsGraphics';
import AdminOrders from '@/components/AdminOrders';
import AdminRoute from '@/components/AdminRoute';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';
import { Beat } from '@/types/beat';
import { useTranslation } from '@/contexts/LanguageContext';

export default function AdminUploadPage() {
  const { t } = useTranslation();
  type TabId = 'upload' | 'manage' | 'stats' | 'orders';

  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [uploadedBeats, setUploadedBeats] = useState<Beat[]>([]);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (['upload', 'manage', 'stats', 'orders'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUploadSuccess = (beat: Beat) => {
    setUploadedBeats(prev => [beat, ...prev]);
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'upload', label: t('admin.upload'), icon: Upload },
    { id: 'manage', label: t('admin.beats'), icon: Music },
    { id: 'orders', label: t('admin.orders'), icon: ShoppingBag },
    { id: 'stats', label: t('admin.stats'), icon: BarChart3 }
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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

        <div className="container mx-auto py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('admin.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('admin.dashboard')}
            </p>
          </motion.div>

          {/* Navigation des onglets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:cursor-pointer ${activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card/20 backdrop-blur-lg text-foreground hover:bg-card/30 border border-border/20'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Contenu des onglets */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'upload' && (
              <div className="space-y-8">
                {/* Section d'upload */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Plus className="w-6 h-6" />
                    {t('admin.uploadNewBeat')}
                  </h2>
                  <BeatUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                  />
                </div>

                {/* Beats récemment uploadés */}
                {uploadedBeats.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {t('admin.recentlyUploaded')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadedBeats.slice(0, 6).map((beat, index) => (
                        <motion.div
                          key={beat.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card/10 backdrop-blur-lg rounded-lg p-4 border border-border/20"
                        >
                          <h4 className="font-semibold text-foreground mb-2">{beat.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>{beat.genre} • {beat.bpm} BPM</div>
                            <div>{beat.key} • {beat.duration}</div>
                            <div className="text-primary font-medium">
                              WAV: {beat.wavLeasePrice}€ | Trackout: {beat.trackoutLeasePrice}€ | Unlimited: {beat.unlimitedLeasePrice}€
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Music className="w-6 h-6" />
                  {t('admin.beats')}
                </h2>

                <BeatManager
                  onEdit={(beat) => {
                    console.log('Modifier le beat:', beat);
                    // TODO: Implémenter la modification
                  }}
                  onDelete={(beatId) => {
                    console.log('Beat supprimé:', beatId);
                    // TODO: Rafraîchir la liste
                  }}
                  onToggleStatus={(beatId, isActive) => {
                    console.log('Statut modifié:', beatId, isActive);
                    // TODO: Rafraîchir la liste
                  }}
                />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  {t('admin.orders')}
                </h2>

                <AdminOrders />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6" />
                  {t('admin.stats')}
                </h2>

                <AdminStats />
                <AdminStatsGraphics />
              </div>
            )}
          </motion.div>

          {/* Navigation rapide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground px-6 py-3 rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30"
            >
              <Settings className="w-5 h-5" />
              <span>{t('admin.backToHome')}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </AdminRoute>

  );
}
