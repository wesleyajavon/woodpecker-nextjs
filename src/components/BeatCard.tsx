'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ShoppingCart, Star, Music, Archive, Crown, X, Check } from 'lucide-react';
import { Beat } from '@/types/beat';
import { LicenseType } from '@/types/cart';
import BeatPricing from './BeatPricing';
import AddToCartButton from './AddToCartButton';

interface BeatCardProps {
  beat: Beat;
  isPlaying?: boolean;
  onPlay?: (beatId: string, previewUrl?: string) => void;
  onPause?: (beatId: string) => void;
  className?: string;
}

const licenseIcons = {
  WAV_LEASE: Music,
  TRACKOUT_LEASE: Archive,
  UNLIMITED_LEASE: Crown
};

const licenseColors = {
  WAV_LEASE: 'text-blue-400',
  TRACKOUT_LEASE: 'text-purple-400',
  UNLIMITED_LEASE: 'text-orange-400'
};

export default function BeatCard({ 
  beat, 
  isPlaying = false, 
  onPlay, 
  onPause, 
  className = '' 
}: BeatCardProps) {
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('WAV_LEASE');
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const getPrice = (licenseType: LicenseType): number => {
    switch (licenseType) {
      case 'WAV_LEASE': return beat.wavLeasePrice;
      case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice;
      case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice;
      default: return beat.wavLeasePrice;
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handlePlay = () => {
    if (isPlaying) {
      onPause?.(beat.id);
    } else {
      onPlay?.(beat.id, beat.previewUrl || undefined);
    }
  };

  const handleLicenseSelect = (license: LicenseType) => {
    setSelectedLicense(license);
  };

  const openLicenseModal = () => {
    setShowLicenseModal(true);
  };

  const closeLicenseModal = () => {
    setShowLicenseModal(false);
  };

  return (
    <motion.div
      className={`relative bg-card/50 backdrop-blur-lg rounded-xl border border-border overflow-hidden hover:border-border/80 transition-all duration-300 ${className}`}
      style={{ position: 'relative' }}
      whileHover={{ y: -2 }}
    >
      {/* Image/Artwork */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        {beat.artworkUrl ? (
          <img
            src={beat.artworkUrl}
            alt={beat.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Play/Pause Button */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          {isPlaying ? (
            <Pause className="w-12 h-12 text-foreground" />
          ) : (
            <Play className="w-12 h-12 text-foreground ml-1" />
          )}
        </button>

        {/* License Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium bg-card/80 ${licenseColors[selectedLicense]}`}>
            {selectedLicense.replace('_', ' ')}
          </div>
        </div>

        {/* Stems Available Badge */}
        {beat.stemsUrl && (
          <div className="absolute top-2 left-2">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/50">
              Stems
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Genre */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground truncate">{beat.title}</h3>
          <p className="text-sm text-muted-foreground">{beat.genre}</p>
        </div>

        {/* BPM and Key */}
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <span>{beat.bpm} BPM</span>
          <span>{beat.key}</span>
          <span>{beat.duration}</span>
        </div>

        {/* Price Display */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(getPrice(selectedLicense))}
            </span>
            <button
              onClick={openLicenseModal}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Crown className="w-4 h-4" />
              Changer de licence
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          beat={beat}
          licenseType={selectedLicense}
          className="w-full"
        />

        {/* Tags */}
        {beat.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {beat.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {beat.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                +{beat.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* License Selection Modal */}
      <AnimatePresence>
        {showLicenseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-2xl"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50
            }}
            onClick={closeLicenseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  Choisir une licence
                </h3>
                <button
                  onClick={closeLicenseModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* License Options */}
              <div className="space-y-3 mb-6">
                {/* WAV Lease */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedLicense('WAV_LEASE');
                    closeLicenseModal();
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedLicense === 'WAV_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">WAV Lease</h4>
                        {selectedLicense === 'WAV_LEASE' && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fichiers WAV/MP3 uniquement
                      </p>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(beat.wavLeasePrice)}
                    </span>
                  </div>
                </motion.button>

                {/* Trackout Lease */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedLicense('TRACKOUT_LEASE');
                    closeLicenseModal();
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedLicense === 'TRACKOUT_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">Trackout Lease</h4>
                        {selectedLicense === 'TRACKOUT_LEASE' && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        WAV/MP3 + Stems
                      </p>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(beat.trackoutLeasePrice)}
                    </span>
                  </div>
                </motion.button>

                {/* Unlimited Lease */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedLicense('UNLIMITED_LEASE');
                    closeLicenseModal();
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedLicense === 'UNLIMITED_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">Unlimited Lease</h4>
                        {selectedLicense === 'UNLIMITED_LEASE' && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        WAV/MP3 + Stems + Distribution illimitée
                      </p>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(beat.unlimitedLeasePrice)}
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3">
                <button
                  onClick={closeLicenseModal}
                  className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={closeLicenseModal}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-foreground rounded-lg transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
