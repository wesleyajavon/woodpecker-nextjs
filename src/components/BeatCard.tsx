'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ShoppingCart, Star, Music, Archive, Crown, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Beat } from '@/types/beat';
import { LicenseType } from '@/types/cart';
import BeatPricing from './BeatPricing';
import AddToCartButton from './AddToCartButton';
import { useTranslation } from '@/contexts/LanguageContext';

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
  const [expandedLicense, setExpandedLicense] = useState<LicenseType | null>(null);
  const { t } = useTranslation();

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
    setExpandedLicense(null);
  };

  const toggleLicenseDetails = (license: LicenseType) => {
    setExpandedLicense(expandedLicense === license ? null : license);
  };

  const isListMode = className.includes('flex items-center');

  return (
    <>
    <motion.div
      className={`bg-card/50 backdrop-blur-lg rounded-xl border border-border overflow-hidden hover:border-border/80 transition-all duration-300 ${className}`}
      whileHover={{ y: -2 }}
    >
      {/* Image/Artwork */}
      <div className={`relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 ${isListMode ? 'w-20 h-20 rounded-lg flex-shrink-0' : 'aspect-square'}`}>
        {beat.artworkUrl ? (
          <img
            src={beat.artworkUrl}
            alt={beat.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className={`${isListMode ? 'w-6 h-6' : 'w-16 h-16'} text-muted-foreground`} />
          </div>
        )}
        
        {/* Play/Pause Button */}
        <button
          onClick={handlePlay}
          className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 ${isListMode ? 'rounded-lg' : ''}`}
        >
          {isPlaying ? (
            <Pause className={`${isListMode ? 'w-4 h-4' : 'w-12 h-12'} text-foreground`} />
          ) : (
            <Play className={`${isListMode ? 'w-4 h-4' : 'w-12 h-12'} ${isListMode ? '' : 'ml-1'} text-foreground`} />
          )}
        </button>

        {/* License Badge - Only show in grid mode */}
        {!isListMode && (
          <div className="absolute top-2 right-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium bg-card/80 ${licenseColors[selectedLicense]}`}>
              {selectedLicense === 'WAV_LEASE' ? t('licenses.wavLease') :
               selectedLicense === 'TRACKOUT_LEASE' ? t('licenses.trackoutLease') :
               t('licenses.unlimitedLease')}
            </div>
          </div>
        )}

        {/* Stems Available Badge */}
        {beat.stemsUrl && !isListMode && (
          <div className="absolute top-2 left-2">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/50">
              {t('beatCard.stems')}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${isListMode ? 'p-3 flex-1 min-w-0' : 'p-4'}`}>
        {/* Title and Genre */}
        <div className={`${isListMode ? 'mb-2' : 'mb-3'}`}>
          <h3 className={`${isListMode ? 'text-sm' : 'text-lg'} font-semibold text-foreground truncate`}>{beat.title}</h3>
          <p className={`text-sm text-muted-foreground ${isListMode ? 'text-xs' : ''}`}>{beat.genre}</p>
        </div>

        {isListMode ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{beat.bpm}BPM</span>
              <span>•</span>
              <span>{beat.key}</span>
              <span>•</span>
              <span>{beat.duration}</span>
              {beat.stemsUrl && <span className="text-orange-400">• STEMS</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${licenseColors[selectedLicense].replace('text-', 'bg-')}`}></span>
              <span className="text-xs text-muted-foreground">
                {selectedLicense === 'WAV_LEASE' ? 'WAV' :
                 selectedLicense === 'TRACKOUT_LEASE' ? 'TRK' : 'UNL'}
              </span>
              <span className="text-sm font-bold text-foreground ml-2">
                {formatPrice(getPrice(selectedLicense))}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* BPM and Key */}
            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              <span>{t('beatCard.bpm', { bpm: beat.bpm.toString() })}</span>
              <span>{t('beatCard.key', { key: beat.key })}</span>
              <span>{t('beatCard.duration', { duration: beat.duration })}</span>
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
                  {t('beatCard.changeLicense')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add to Cart Button */}
        <div className={`mt-3 ${isListMode ? 'flex gap-1' : ''}`}>
          {isListMode ? (
            <>
              <button
                onClick={openLicenseModal}
                className="flex-shrink-0 p-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                title={t('beatCard.changeLicense')}
              >
                <Crown className="w-3 h-3" />
              </button>
              <AddToCartButton
                beat={beat}
                licenseType={selectedLicense}
                className="flex-1"
              />
            </>
          ) : (
            <AddToCartButton
              beat={beat}
              licenseType={selectedLicense}
              className="w-full"
            />
          )}
        </div>

        {/* Tags - Only show in grid mode */}
        {!isListMode && beat.tags.length > 0 && (
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
    </motion.div>

      {/* License Selection Modal - Outside of BeatCard container */}
      <AnimatePresence>
        {showLicenseModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={closeLicenseModal}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-400" />
                    {t('beatCard.selectLicense')}
                  </h3>
                  <button
                    onClick={closeLicenseModal}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted/50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* License Options */}
                <div className="space-y-3 mb-6">
                  {/* WAV Lease */}
                  <div className={`w-full rounded-xl border-2 transition-all ${
                    selectedLicense === 'WAV_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-400/50 hover:bg-purple-400/5'
                  }`}>
                    <div className="flex items-start justify-between p-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setSelectedLicense('WAV_LEASE');
                          closeLicenseModal();
                        }}
                        className="text-left flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">WAV Lease</h4>
                          {selectedLicense === 'WAV_LEASE' && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground">WAV & MP3</p>
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(beat.wavLeasePrice)}
                        </span>
                        <button
                          onClick={() => toggleLicenseDetails('WAV_LEASE')}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          {expandedLicense === 'WAV_LEASE' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLicense === 'WAV_LEASE' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-3 mt-1">
                            <p>• Used for Music Recording</p>
                            <p>• Distribute up to 5 000 copies</p>
                            <p>• 100 000 Online Audio Streams</p>
                            <p>• 1 Music Video</p>
                            <p>• UNLIMITED Non-profit Live Performances only</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Trackout Lease */}
                  <div className={`w-full rounded-xl border-2 transition-all ${
                    selectedLicense === 'TRACKOUT_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-400/50 hover:bg-purple-400/5'
                  }`}>
                    <div className="flex items-start justify-between p-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setSelectedLicense('TRACKOUT_LEASE');
                          closeLicenseModal();
                        }}
                        className="text-left flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">Trackout Lease</h4>
                          {selectedLicense === 'TRACKOUT_LEASE' && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground">WAV, STEMS & MP3</p>
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(beat.trackoutLeasePrice)}
                        </span>
                        <button
                          onClick={() => toggleLicenseDetails('TRACKOUT_LEASE')}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          {expandedLicense === 'TRACKOUT_LEASE' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLicense === 'TRACKOUT_LEASE' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-3 mt-1">
                            <p>• Used for Music Recording</p>
                            <p>• Distribute up to 10 000 copies</p>
                            <p>• 250 000 Online Audio Streams</p>
                            <p>• 3 Music Video</p>
                            <p>• UNLIMITED Non-profit Live Performances only</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Unlimited Lease */}
                  <div className={`w-full rounded-xl border-2 transition-all ${
                    selectedLicense === 'UNLIMITED_LEASE'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-400/50 hover:bg-purple-400/5'
                  }`}>
                    <div className="flex items-start justify-between p-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setSelectedLicense('UNLIMITED_LEASE');
                          closeLicenseModal();
                        }}
                        className="text-left flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">Unlimited Lease</h4>
                          {selectedLicense === 'UNLIMITED_LEASE' && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground">WAV, STEMS & MP3</p>
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(beat.unlimitedLeasePrice)}
                        </span>
                        <button
                          onClick={() => toggleLicenseDetails('UNLIMITED_LEASE')}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          {expandedLicense === 'UNLIMITED_LEASE' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLicense === 'UNLIMITED_LEASE' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-3 mt-1">
                            <p>• Used for Music Recording</p>
                            <p>• Distribute up to UNLIMITED copies</p>
                            <p>• UNLIMITED Online Audio Streams</p>
                            <p>• UNLIMITED Music Video</p>
                            <p>• UNLIMITED Non-profit Live Performances only</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3">
                  <button
                    onClick={closeLicenseModal}
                    className="flex-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-lg"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={closeLicenseModal}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                  >
                    {t('common.confirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
