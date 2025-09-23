'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BeatUpload from '@/components/BeatUpload';
import { Beat } from '@/types/beat';

export default function UploadTestPage() {
  const [uploadedBeats, setUploadedBeats] = useState<Beat[]>([]);
  const [uploadHistory, setUploadHistory] = useState<Array<{
    timestamp: Date;
    success: boolean;
    message: string;
    beat?: Beat;
  }>>([]);

  const handleUploadSuccess = (beat: Beat) => {
    setUploadedBeats(prev => [beat, ...prev]);
    setUploadHistory(prev => [{
      timestamp: new Date(),
      success: true,
      message: `Beat "${beat.title}" uploadé avec succès !`,
      beat
    }, ...prev]);
  };

  const handleUploadError = (error: string) => {
    setUploadHistory(prev => [{
      timestamp: new Date(),
      success: false,
      message: `Erreur d'upload : ${error}`,
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Test d&apos;Upload de Beats
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Page de test pour vérifier le bon fonctionnement de l&apos;upload vers Cloudinary
          </p>
        </motion.div>

        {/* Composant d'upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <BeatUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </motion.div>

        {/* Historique des uploads */}
        {uploadHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Historique des Uploads</h2>
            <div className="space-y-4">
              {uploadHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    entry.success
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-red-500/20 border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          entry.success ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      />
                      <span className={`text-sm ${
                        entry.success ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {entry.message}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.beat && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Titre:</span>
                          <div className="text-white font-medium">{entry.beat.title}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Genre:</span>
                          <div className="text-white font-medium">{entry.beat.genre}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">BPM:</span>
                          <div className="text-white font-medium">{entry.beat.bpm}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Prix:</span>
                          <div className="text-white font-medium">{entry.beat.price}€</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Beats uploadés */}
        {uploadedBeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Beats Uploadés ({uploadedBeats.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedBeats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{beat.title}</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><span className="text-gray-400">Genre:</span> {beat.genre}</div>
                    <div><span className="text-gray-400">BPM:</span> {beat.bpm}</div>
                    <div><span className="text-gray-400">Tonalité:</span> {beat.key}</div>
                    <div><span className="text-gray-400">Durée:</span> {beat.duration}</div>
                    <div><span className="text-gray-400">Prix:</span> {beat.price}€</div>
                  </div>
                  {beat.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Tags:</div>
                      <div className="flex flex-wrap gap-2">
                        {beat.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions de test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Instructions de Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">✅ Tests à effectuer</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Upload d&apos;un fichier audio preview (MP3, WAV)</li>
                <li>• Upload d&apos;un fichier master (WAV, AIFF)</li>
                <li>• Validation des champs du formulaire</li>
                <li>• Gestion des erreurs de validation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">🔧 Vérifications</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Fichiers uploadés vers Cloudinary</li>
                <li>• Beat créé en base de données</li>
                <li>• URLs des fichiers correctement générées</li>
                <li>• Transformations automatiques appliquées</li>
                <li>• Gestion des erreurs et nettoyage</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
