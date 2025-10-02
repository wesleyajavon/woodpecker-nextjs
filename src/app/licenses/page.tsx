'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Music, 
  Archive, 
  Check, 
  X, 
  Users, 
  Globe, 
  Video, 
  Radio,
  Building,
  Headphones,
  Download,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface LicenseFeature {
  id: string;
  name: string;
  wav: boolean | string;
  trackout: boolean | string;
  unlimited: boolean | string;
}

interface LicenseDetails {
  wav: {
    title: string;
    description: string;
    features: string[];
    limitations: string[];
    useCases: string[];
  };
  trackout: {
    title: string;
    description: string;
    features: string[];
    limitations: string[];
    useCases: string[];
  };
  unlimited: {
    title: string;
    description: string;
    features: string[];
    limitations: string[];
    useCases: string[];
  };
}

const licenseFeatures: LicenseFeature[] = [
  {
    id: "files",
    name: "Fichiers inclus",
    wav: "WAV & MP3",
    trackout: "WAV, STEMS & MP3",
    unlimited: "WAV, STEMS & MP3"
  },
  {
    id: "commercial",
    name: "Usage commercial",
    wav: true,
    trackout: true,
    unlimited: true
  },
  {
    id: "copies",
    name: "Copies distribuées",
    wav: "5 000",
    trackout: "10 000",
    unlimited: "Illimité"
  },
  {
    id: "streams",
    name: "Streams audio en ligne",
    wav: "100 000",
    trackout: "250 000",
    unlimited: "Illimité"
  },
  {
    id: "videos",
    name: "Clips vidéo",
    wav: "1",
    trackout: "3",
    unlimited: "Illimité"
  },
  {
    id: "live-nonprofit",
    name: "Performances live (non-profit)",
    wav: "Illimité",
    trackout: "Illimité",
    unlimited: "Illimité"
  },
  {
    id: "live-profit",
    name: "Performances live (profit)",
    wav: false,
    trackout: false,
    unlimited: true
  },
  {
    id: "radio-tv",
    name: "Diffusion radio/TV",
    wav: false,
    trackout: false,
    unlimited: true
  },
  {
    id: "sync",
    name: "Synchronisation (films/pubs)",
    wav: false,
    trackout: false,
    unlimited: true
  },
  {
    id: "credit",
    name: "Crédit producteur requis",
    wav: true,
    trackout: true,
    unlimited: true
  }
];

// Detailed license information (placeholder - will be populated with your content)
const licenseDetails: LicenseDetails = {
  wav: {
    title: "WAV Lease - Licence Non-Exclusive",
    description: "Licence non-exclusive de 10 ans permettant l'usage commercial du beat avec des droits essentiels pour artistes et producteurs.",
    features: [
      "Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps",
      "Droit d'enregistrer des voix sur le beat pour créer une nouvelle chanson",
      "Modification autorisée (arrangement, tempo, tonalité, durée)",
      "Distribution jusqu'à 5 000 copies physiques et digitales",
      "Jusqu'à 100 000 streams audio monétisés",
      "1 clip vidéo monétisé (max 5 minutes)",
      "Performances live non-profit illimitées",
      "Vente en format single, EP ou album",
      "Partage des droits d'auteur : 50% Producteur / 50% Artiste",
      "Pas de redevances supplémentaires à payer"
    ],
    limitations: [
      "Licence NON-EXCLUSIVE (le beat peut être vendu à d'autres)",
      "Pas de fichiers stems/trackouts inclus",
      "Aucune performance live payante autorisée",
      "Pas de diffusion radio/TV commerciale",
      "Pas de synchronisation (films, pubs, jeux vidéo)",
      "Interdiction de revendre le beat dans sa forme originale",
      "Pas de droit de sous-licencier à des tiers",
      "Crédit producteur 'Prod. l.outsider' OBLIGATOIRE",
      "Durée limitée à 10 ans à partir de l'achat",
      "Interdiction d'enregistrer le beat seul avec Content ID"
    ],
    useCases: [
      "Singles et projets musicaux indépendants",
      "Mixtapes et compilations gratuites",
      "Streaming sur Spotify, Apple Music, Deezer",
      "Concerts et festivals non-commerciaux",
      "Promotion sur réseaux sociaux",
      "Vente digitale et physique limitée"
    ]
  },
  trackout: {
    title: "Trackout Lease - Licence Premium avec Stems",
    description: "Licence non-exclusive de 10 ans incluant les stems pour un contrôle créatif total et des droits commerciaux étendus.",
    features: [
      "Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps",
      "Stems/Trackouts complets (pistes séparées)",
      "Droit d'enregistrer et modifier librement le beat",
      "Remixage et arrangements personnalisés autorisés",
      "Distribution jusqu'à 10 000 copies physiques et digitales",
      "Jusqu'à 250 000 streams audio monétisés",
      "3 clips vidéo monétisés (max 5 minutes chacun)",
      "Performances live non-profit illimitées",
      "Vente en format single, EP ou album",
      "Partage des droits d'auteur : 50% Producteur / 50% Artiste",
      "Pas de redevances supplémentaires à payer"
    ],
    limitations: [
      "Licence NON-EXCLUSIVE (le beat peut être vendu à d'autres)",
      "Aucune performance live payante autorisée",
      "Pas de diffusion radio/TV commerciale",
      "Pas de synchronisation (films, pubs, jeux vidéo)",
      "Interdiction de revendre le beat ou les stems dans leur forme originale",
      "Pas de droit de sous-licencier à des tiers",
      "Crédit producteur 'Prod. l.outsider' OBLIGATOIRE",
      "Durée limitée à 10 ans à partir de l'achat"
    ],
    useCases: [
      "Albums et EPs professionnels",
      "Remixage et production avancée",
      "Collaborations artistiques",
      "Clips vidéo multiples et promotion",
      "Distribution élargie sur plateformes",
      "Projets créatifs nécessitant les stems"
    ]
  },
  unlimited: {
    title: "Unlimited Lease - Licence Commerciale Complète",
    description: "Licence non-exclusive de 10 ans offrant tous les droits commerciaux pour une utilisation professionnelle sans limitations de distribution.",
    features: [
      "Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps",
      "Stems/Trackouts complets (pistes séparées)",
      "Droit d'enregistrer et modifier librement le beat",
      "Distribution ILLIMITÉE de copies physiques et digitales",
      "Streams audio monétisés ILLIMITÉS",
      "Clips vidéo monétisés ILLIMITÉS",
      "Performances live payantes AUTORISÉES",
      "Diffusion radio et télévision commerciale",
      "Synchronisation (films, publicités, documentaires, jeux vidéo)",
      "Vente en format single, EP ou album sans restriction",
      "Partage des droits d'auteur : 50% Producteur / 50% Artiste",
      "Pas de redevances supplémentaires à payer"
    ],
    limitations: [
      "Licence NON-EXCLUSIVE (le beat peut être vendu à d'autres)",
      "Interdiction de revendre le beat ou les stems dans leur forme originale",
      "Pas de droit de sous-licencier à des tiers",
      "Crédit producteur 'Prod. l.outsider' OBLIGATOIRE",
      "Durée limitée à 10 ans à partir de l'achat"
    ],
    useCases: [
      "Projets commerciaux majeurs et albums",
      "Tournées et concerts payants",
      "Campagnes publicitaires et marketing",
      "Films, documentaires et contenus audiovisuels",
      "Diffusion radio/TV et podcasts",
      "Distribution mondiale sans restriction",
      "Synchronisation pour médias et jeux vidéo",
      "Projets nécessitant une flexibilité commerciale totale"
    ]
  }
};

const usageExamples = [
  {
    icon: Headphones,
    title: "Streaming Platforms",
    description: "Spotify, Apple Music, Deezer, YouTube Music",
    licenses: ["WAV", "Trackout", "Unlimited"]
  },
  {
    icon: Video,
    title: "Clips Vidéo",
    description: "YouTube, Instagram, TikTok, clips promotionnels",
    licenses: ["WAV (1)", "Trackout (3)", "Unlimited"]
  },
  {
    icon: Users,
    title: "Performances Live",
    description: "Concerts, festivals, événements (non-profit)",
    licenses: ["WAV", "Trackout", "Unlimited"]
  },
  {
    icon: Radio,
    title: "Radio & TV",
    description: "Diffusion radio, télévision, podcasts",
    licenses: ["Unlimited uniquement"]
  },
  {
    icon: Building,
    title: "Usage Commercial",
    description: "Publicités, films, documentaires",
    licenses: ["Unlimited uniquement"]
  },
  {
    icon: Globe,
    title: "Distribution Mondiale",
    description: "Vente et distribution dans le monde entier",
    licenses: ["WAV", "Trackout", "Unlimited"]
  }
];

const importantNotes = [
  "Le crédit producteur 'Prod. l.outsider' est obligatoire sur tous les titres",
  "Les licences ne sont pas exclusives - le beat peut être vendu à d'autres artistes",
  "Aucun remboursement après téléchargement des fichiers",
  "Les droits d'auteur restent la propriété de l.outsider",
  "Usage à des fins illégales strictement interdit",
  "Revente ou redistribution des fichiers interdite"
];

export default function LicensesPage() {
  const { t } = useTranslation();
  const [selectedLicense, setSelectedLicense] = useState<'wav' | 'trackout' | 'unlimited' | null>(null);

  const openModal = (licenseType: 'wav' | 'trackout' | 'unlimited') => {
    setSelectedLicense(licenseType);
  };

  const closeModal = () => {
    setSelectedLicense(null);
  };

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

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('licenses.pageTitle')}{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
                {t('licenses.pageTitleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('licenses.pageSubtitle')}
            </p>
          </motion.div>

          {/* License Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-card/10 backdrop-blur-lg rounded-2xl border border-border/20 overflow-hidden">
              <div className="p-6 border-b border-border/20">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('licenses.comparisonTitle')}</h2>
                <p className="text-muted-foreground">{t('licenses.comparisonSubtitle')}</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/20">
                      <th className="text-left p-4 text-foreground font-semibold">{t('licenses.features')}</th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center gap-2">
                          <Music className="w-6 h-6 text-blue-400" />
                          <span className="font-semibold text-foreground">WAV Lease</span>
                          <span className="text-sm text-muted-foreground">{t('licenses.basic')}</span>
                          <button
                            onClick={() => openModal('wav')}
                            className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg"
                          >
                            <Info className="w-3 h-3" />
                            {t('licenses.readMore')}
                          </button>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center gap-2">
                          <Archive className="w-6 h-6 text-purple-400" />
                          <span className="font-semibold text-foreground">Trackout Lease</span>
                          <span className="text-sm text-muted-foreground">{t('licenses.advanced')}</span>
                          <button
                            onClick={() => openModal('trackout')}
                            className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg"
                          >
                            <Info className="w-3 h-3" />
                            {t('licenses.readMore')}
                          </button>
                        </div>
                      </th>
                      <th className="text-center p-4">
                        <div className="flex flex-col items-center gap-2">
                          <Crown className="w-6 h-6 text-orange-400" />
                          <span className="font-semibold text-foreground">Unlimited Lease</span>
                          <span className="text-sm text-muted-foreground">{t('licenses.premium')}</span>
                          <button
                            onClick={() => openModal('unlimited')}
                            className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-lg"
                          >
                            <Info className="w-3 h-3" />
                            {t('licenses.readMore')}
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenseFeatures.map((feature, index) => (
                      <tr key={feature.name} className="border-b border-border/10 hover:bg-card/5">
                        <td className="p-4 font-medium text-foreground">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.wav === 'boolean' ? (
                            feature.wav ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-foreground font-medium">{feature.wav}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.trackout === 'boolean' ? (
                            feature.trackout ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-foreground font-medium">{feature.trackout}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.unlimited === 'boolean' ? (
                            feature.unlimited ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-foreground font-medium">{feature.unlimited}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Usage Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('licenses.usageExamples')}</h2>
              <p className="text-muted-foreground">{t('licenses.usageExamplesSubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usageExamples.map((example, index) => (
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card/10 backdrop-blur-lg rounded-xl border border-border/20 p-6 hover:border-border/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <example.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{example.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{example.description}</p>
                  <div className="space-y-1">
                    {example.licenses.map((license, idx) => (
                      <div key={idx} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded inline-block mr-1">
                        {license}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-card/10 backdrop-blur-lg rounded-2xl border border-border/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-foreground">{t('licenses.importantPoints')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>


          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="bg-card/10 backdrop-blur-lg rounded-2xl border border-border/20 p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('licenses.customLicenseTitle')}</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t('licenses.customLicenseDescription')}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                {t('common.contactUs')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* License Details Modal */}
      <AnimatePresence>
        {selectedLicense && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header - Fixed */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/20 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    {selectedLicense === 'wav' && <Music className="w-6 h-6 text-blue-400" />}
                    {selectedLicense === 'trackout' && <Archive className="w-6 h-6 text-purple-400" />}
                    {selectedLicense === 'unlimited' && <Crown className="w-6 h-6 text-orange-400" />}
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {licenseDetails[selectedLicense].title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {licenseDetails[selectedLicense].description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/50 rounded-lg flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Features */}
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm py-2 -mt-2">
                        <Check className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                        {t('licenses.includedFeatures')}
                      </h4>
                      <ul className="space-y-2">
                        {licenseDetails[selectedLicense].features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm py-2 -mt-2">
                        <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
                        {t('licenses.limitations')}
                      </h4>
                      <ul className="space-y-2">
                        {licenseDetails[selectedLicense].limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm py-2 -mt-2">
                        <ExternalLink className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
                        {t('licenses.useCases')}
                      </h4>
                      <ul className="space-y-2">
                        {licenseDetails[selectedLicense].useCases.map((useCase, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-t border-border/20 bg-card/20 flex-shrink-0 gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>{t('licenses.completeInformation')}</span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="/contact"
                      className="px-3 md:px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      {t('licenses.questions')}
                    </a>
                    <button
                      onClick={closeModal}
                      className="px-3 md:px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {t('common.close')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
