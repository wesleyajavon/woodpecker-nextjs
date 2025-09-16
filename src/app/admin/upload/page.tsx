'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, Music, Settings, BarChart3, Plus } from 'lucide-react';
import BeatUpload from '@/components/BeatUpload';
import BeatManager from '@/components/BeatManager';
import AdminStats from '@/components/AdminStats';
import AdminStatsGraphics from '@/components/AdminStatsGraphics';
import AdminRoute from '@/components/AdminRoute';
import { Beat } from '@/types/beat';

export default function AdminUploadPage() {
  type TabId = 'upload' | 'manage' | 'stats';

  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [uploadedBeats, setUploadedBeats] = useState<Beat[]>([]);

  const handleUploadSuccess = (beat: Beat) => {
    setUploadedBeats(prev => [beat, ...prev]);
  };

  const handleUploadError = (error: string) => {
    console.error('Erreur d\'upload:', error);
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'upload', label: 'Upload de Beats', icon: Upload },
    { id: 'manage', label: 'Gestion des Beats', icon: Music },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 }
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Administration
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Gestion de la plateforme Woodpecker Beats
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
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
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Plus className="w-6 h-6" />
                    Upload d&apos;un nouveau beat
                  </h2>
                  <BeatUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                  />
                </div>

                {/* Beats récemment uploadés */}
                {uploadedBeats.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Beats récemment uploadés
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadedBeats.slice(0, 6).map((beat, index) => (
                        <motion.div
                          key={beat.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-lg rounded-lg p-4"
                        >
                          <h4 className="font-semibold text-white mb-2">{beat.title}</h4>
                          <div className="text-sm text-gray-300 space-y-1">
                            <div>{beat.genre} • {beat.bpm} BPM</div>
                            <div>{beat.key} • {beat.duration}</div>
                            <div className="text-purple-300 font-medium">{beat.price}€</div>
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
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Music className="w-6 h-6" />
                  Gestion des Beats
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

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6" />
                  Statistiques
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
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30"
            >
              <Settings className="w-5 h-5" />
              <span>Retour à la page principale</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </AdminRoute>

  );
}
