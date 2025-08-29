// Constantes de l'application Woodpecker Beats

export const APP_CONFIG = {
  name: 'Woodpecker Beats',
  description: 'Plateforme de vente de beats professionnels',
  version: '1.0.0',
  author: 'Woodpecker',
  url: 'https://woodpecker-beats.com'
}

export const BEAT_CONFIG = {
  // Genres disponibles
  genres: [
    'Trap',
    'Hip-Hop',
    'Drill',
    'Jazz',
    'Electronic',
    'Boom Bap',
    'Synthwave',
    'R&B',
    'Pop',
    'Rock'
  ] as const,
  
  // Tonalités musicales
  keys: [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ] as const,
  
  // Ranges de BPM par genre
  bpmRanges: {
    'Trap': { min: 130, max: 150 },
    'Hip-Hop': { min: 120, max: 140 },
    'Drill': { min: 140, max: 160 },
    'Jazz': { min: 100, max: 130 },
    'Electronic': { min: 120, max: 140 },
    'Boom Bap': { min: 80, max: 100 },
    'Synthwave': { min: 100, max: 120 },
    'R&B': { min: 110, max: 130 },
    'Pop': { min: 100, max: 130 },
    'Rock': { min: 120, max: 140 }
  },
  
  // Prix par défaut
  defaultPrices: {
    'NON_EXCLUSIVE': 29.99,
    'EXCLUSIVE': 199.99,
    'CUSTOM': 299.99
  },
  
  // Limites
  maxTags: 10,
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  maxPreviewDuration: 30, // secondes
  maxFileSize: 100 * 1024 * 1024 // 100MB
}

export const ORDER_CONFIG = {
  // Statuts de commande
  statuses: [
    'PENDING',
    'PAID',
    'COMPLETED',
    'CANCELLED',
    'REFUNDED'
  ] as const,
  
  // Types de licence
  licenseTypes: [
    'NON_EXCLUSIVE',
    'EXCLUSIVE',
    'CUSTOM'
  ] as const,
  
  // Droits d'usage par défaut
  defaultUsageRights: {
    'NON_EXCLUSIVE': [
      'Commercial Use',
      'Streaming',
      'Live Performance',
      'Radio Play'
    ],
    'EXCLUSIVE': [
      'Exclusive Rights',
      'Commercial Use',
      'Streaming',
      'Live Performance',
      'Radio Play',
      'TV/Film',
      'Merchandise'
    ],
    'CUSTOM': [
      'Custom Rights',
      'Commercial Use',
      'Streaming',
      'Live Performance',
      'Radio Play',
      'TV/Film',
      'Merchandise',
      'Full Ownership'
    ]
  },
  
  // Devises supportées
  currencies: ['EUR', 'USD', 'GBP'] as const,
  
  // Méthodes de paiement
  paymentMethods: [
    'Stripe',
    'PayPal',
    'Bank Transfer'
  ] as const
}

export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  maxPageSize: 100,
  defaultPage: 1
}

export const FILE_CONFIG = {
  // Types de fichiers acceptés
  allowedAudioFormats: ['.mp3', '.wav', '.aiff', '.flac'],
  allowedImageFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  allowedArchiveFormats: ['.zip', '.rar'],
  
  // Tailles maximales
  maxAudioSize: 200 * 1024 * 1024, // 200MB (augmenté pour les gros fichiers)
  maxImageSize: 20 * 1024 * 1024,  // 20MB (augmenté pour les images haute résolution)
  maxArchiveSize: 1 * 1024 * 1024 * 1024, // 1GB (augmenté pour les stems complets)
  
  // Qualités audio
  previewQuality: '128kbps',
  fullQuality: '320kbps',
  stemsQuality: '24bit/48kHz'
}

export const API_CONFIG = {
  // Limites de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requêtes par fenêtre
  },
  
  // Timeouts
  timeout: {
    short: 10000,    // 10 secondes
    medium: 60000,   // 1 minute
    long: 300000     // 5 minutes (augmenté pour les gros fichiers)
  }
}

export const UI_CONFIG = {
  // Animations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  
  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  }
}
