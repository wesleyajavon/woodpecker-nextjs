'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, FileAudio, X, AlertCircle } from 'lucide-react';
import { BEAT_CONFIG } from '@/config/constants';

import { Beat } from '@/types/beat';

interface BeatUploadProps {
  onUploadSuccess?: (beat: Beat) => void;
  onUploadError?: (error: string) => void;
}

interface UploadProgress {
  preview: number;
  master: number;
}

export default function BeatUpload({ onUploadSuccess, onUploadError }: BeatUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    preview: 0,
    master: 0
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    preview?: File;
    master?: File;
  }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Trap',
    bpm: 140,
    key: 'C',
    duration: '3:00',
    price: 29.99,
    tags: [] as string[],
    isExclusive: false,
    featured: false
  });
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRefs = {
    preview: useRef<HTMLInputElement>(null),
    master: useRef<HTMLInputElement>(null)
  };

  // Gestion des fichiers sélectionnés
  const handleFileSelect = (field: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }));
    setErrors(prev => prev.filter(error => !error.includes(field)));
  };

  // Gestion des changements de formulaire
  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => prev.filter(error => !error.includes(field)));
  };

  // Ajout de tags
  const addTag = () => {
    if (currentTag.trim() && formData.tags.length < BEAT_CONFIG.maxTags) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  // Suppression de tags
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) newErrors.push('Le titre est requis');
    if (formData.title.length > BEAT_CONFIG.maxTitleLength) {
      newErrors.push(`Le titre ne peut pas dépasser ${BEAT_CONFIG.maxTitleLength} caractères`);
    }
    if (formData.description && formData.description.length > BEAT_CONFIG.maxDescriptionLength) {
      newErrors.push(`La description ne peut pas dépasser ${BEAT_CONFIG.maxDescriptionLength} caractères`);
    }
    if (!uploadedFiles.preview) newErrors.push('La preview audio est requise');
    if (formData.price <= 0) newErrors.push('Le prix doit être supérieur à 0');
    if (formData.bpm < 60 || formData.bpm > 200) newErrors.push('Le BPM doit être entre 60 et 200');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Upload des fichiers
  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress({ preview: 0, master: 0 });

    try {
      const formDataToSend = new FormData();
      
      // Ajout des fichiers
      if (uploadedFiles.preview) formDataToSend.append('preview', uploadedFiles.preview);
      if (uploadedFiles.master) formDataToSend.append('master', uploadedFiles.master);

      // Ajout des données du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      // Simulation du progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          preview: Math.min(prev.preview + 10, 100),
          master: Math.min(prev.master + 8, 100)
        }));
      }, 200);

      const response = await fetch('/api/beats/upload', {
        method: 'POST',
        body: formDataToSend
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      
      if (result.success) {
        onUploadSuccess?.(result.data.beat);
        // Reset du formulaire
        setFormData({
          title: '',
          description: '',
          genre: 'Trap',
          bpm: 140,
          key: 'C',
          duration: '3:00',
          price: 29.99,
          tags: [],
          isExclusive: false,
          featured: false
        });
        setUploadedFiles({});
        setUploadProgress({ preview: 0, master: 0 });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      onUploadError?.(errorMessage);
      setErrors([errorMessage]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Upload d&apos;un nouveau beat
      </h2>

      {/* Affichage des erreurs */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section des fichiers */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Fichiers</h3>

          {/* Preview Audio (Requis) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Preview Audio <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                ref={fileInputRefs.preview}
                type="file"
                accept=".mp3,.wav,.aiff,.flac"
                onChange={(e) => e.target.files?.[0] && handleFileSelect('preview', e.target.files[0])}
                className="hidden"
              />
              <div
                onClick={() => fileInputRefs.preview.current?.click()}
                className="w-full p-4 border-2 border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 transition-colors text-center cursor-pointer"
              >
                {uploadedFiles.preview ? (
                  <div className="flex items-center gap-2 text-purple-300">
                    <Music className="w-5 h-5" />
                    <span>{uploadedFiles.preview.name}</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles(prev => ({ ...prev, preview: undefined }));
                      }}
                      className="ml-auto text-red-400 hover:text-red-300 cursor-pointer p-1 rounded hover:bg-red-400/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Upload className="w-5 h-5" />
                    <span>Cliquez pour sélectionner un fichier audio</span>
                  </div>
                )}
              </div>
            </div>
            {uploadProgress.preview > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.preview}%` }}
                />
              </div>
            )}
          </div>

          {/* Master Audio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Master Audio <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                ref={fileInputRefs.master}
                type="file"
                accept=".wav,.aiff,.flac"
                onChange={(e) => e.target.files?.[0] && handleFileSelect('master', e.target.files[0])}
                className="hidden"
              />
              <div
                onClick={() => fileInputRefs.master.current?.click()}
                className="w-full p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer"
              >
                {uploadedFiles.master ? (
                  <div className="flex items-center gap-2 text-purple-300">
                    <FileAudio className="w-5 h-5" />
                    <span>{uploadedFiles.master.name}</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFiles(prev => ({ ...prev, master: undefined }));
                      }}
                      className="ml-auto text-red-400 hover:text-red-300 cursor-pointer p-1 rounded hover:bg-red-400/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Upload className="w-5 h-5" />
                    <span>Fichier master haute qualité</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Section des informations */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Informations</h3>

          {/* Titre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nom du beat"
              maxLength={BEAT_CONFIG.maxTitleLength}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Description du beat"
              rows={3}
              maxLength={BEAT_CONFIG.maxDescriptionLength}
            />
          </div>

          {/* Genre et BPM */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Genre <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {BEAT_CONFIG.genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-gray-800 text-white">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                BPM <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => handleInputChange('bpm', parseInt(e.target.value))}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="60"
                max="200"
              />
            </div>
          </div>

          {/* Tonalité et Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Tonalité <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.key}
                onChange={(e) => handleInputChange('key', e.target.value)}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {BEAT_CONFIG.keys.map((key) => (
                  <option key={key} value={key} className="bg-gray-800 text-white">
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Durée <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="3:24"
              />
            </div>
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Prix (EUR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
              step="0.01"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tags ({formData.tags.length}/{BEAT_CONFIG.maxTags})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ajouter un tag"
                maxLength={20}
              />
              <button
                onClick={addTag}
                disabled={!currentTag.trim() || formData.tags.length >= BEAT_CONFIG.maxTags}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Ajouter
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.isExclusive}
                onChange={(e) => handleInputChange('isExclusive', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
              />
              Beat exclusif
            </label>

            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
              />
              Mettre en vedette
            </label>
          </div>
        </div>
      </div>

      {/* Bouton d'upload */}
      <div className="mt-8 text-center">
        <button
          onClick={handleUpload}
          disabled={isUploading || !uploadedFiles.preview}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Upload en cours...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Uploader le beat
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
