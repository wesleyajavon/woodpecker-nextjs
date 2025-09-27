'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Music, Archive, Crown } from 'lucide-react';
import { Beat } from '@/types/beat';

export type LicenseType = 'WAV_LEASE' | 'TRACKOUT_LEASE' | 'UNLIMITED_LEASE';

interface LicenseSelectorProps {
  beat: Beat;
  selectedLicense: LicenseType;
  onLicenseChange: (license: LicenseType) => void;
  className?: string;
}

const licenseConfig = {
  WAV_LEASE: {
    name: 'WAV Lease',
    description: 'Fichier WAV/MP3 uniquement',
    icon: Music,
    color: 'from-blue-600 to-blue-700',
    features: ['Fichier WAV haute qualité', 'Fichier MP3', 'Usage commercial limité']
  },
  TRACKOUT_LEASE: {
    name: 'Trackout Lease',
    description: 'WAV + Stems inclus',
    icon: Archive,
    color: 'from-purple-600 to-purple-700',
    features: ['Fichier WAV haute qualité', 'Fichier MP3', 'Stems séparés', 'Usage commercial étendu']
  },
  UNLIMITED_LEASE: {
    name: 'Unlimited Lease',
    description: 'WAV + Stems + Distribution illimitée',
    icon: Crown,
    color: 'from-orange-600 to-orange-700',
    features: ['Fichier WAV haute qualité', 'Fichier MP3', 'Stems séparés', 'Distribution illimitée', 'Usage commercial complet']
  }
};

export default function LicenseSelector({ 
  beat, 
  selectedLicense, 
  onLicenseChange, 
  className = '' 
}: LicenseSelectorProps) {
  const getPrice = (license: LicenseType): number => {
    switch (license) {
      case 'WAV_LEASE':
        return beat.wavLeasePrice;
      case 'TRACKOUT_LEASE':
        return beat.trackoutLeasePrice;
      case 'UNLIMITED_LEASE':
        return beat.unlimitedLeasePrice;
      default:
        return beat.wavLeasePrice;
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Choisissez votre licence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(licenseConfig).map(([license, config]) => {
          const Icon = config.icon;
          const isSelected = selectedLicense === license;
          const price = getPrice(license as LicenseType);
          
          return (
            <motion.div
              key={license}
              onClick={() => onLicenseChange(license as LicenseType)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Icône et titre */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${config.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{config.name}</h4>
                  <p className="text-sm text-gray-400">{config.description}</p>
                </div>
              </div>
              
              {/* Prix */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">{formatPrice(price)}</span>
              </div>
              
              {/* Fonctionnalités */}
              <ul className="space-y-2">
                {config.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Indicateur de disponibilité des stems */}
              {license !== 'WAV_LEASE' && !beat.stemsUrl && (
                <div className="mt-4 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-xs text-yellow-400 text-center">
                    Stems non disponibles pour ce beat
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
