export interface Beat {
  id: string
  title: string
  description?: string | null
  genre: string
  bpm: number
  key: string
  duration: string
  // Prix par type de licence
  wavLeasePrice: number
  trackoutLeasePrice: number
  unlimitedLeasePrice: number
  rating: number
  reviewCount: number
  tags: string[]
  stripePriceId?: string | null // Deprecated
  previewUrl?: string | null
  fullUrl?: string | null
  stemsUrl?: string | null
  artworkUrl?: string | null
  
  // Stripe Price IDs for each license type
  stripeWavPriceId?: string | null
  stripeTrackoutPriceId?: string | null
  stripeUnlimitedPriceId?: string | null
  isExclusive: boolean
  isActive: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateBeatInput {
  title: string
  description?: string
  genre: string
  bpm: number
  key: string
  duration: string
  wavLeasePrice: number
  trackoutLeasePrice: number
  unlimitedLeasePrice: number
  tags: string[]
  previewUrl?: string
  fullUrl?: string
  stemsUrl?: string
  artworkUrl?: string
  isExclusive?: boolean
  featured?: boolean
}

export interface UpdateBeatInput {
  title?: string
  description?: string
  genre?: string
  bpm?: number
  key?: string
  duration?: string
  wavLeasePrice?: number
  trackoutLeasePrice?: number
  unlimitedLeasePrice?: number
  tags?: string[]
  previewUrl?: string
  fullUrl?: string
  stemsUrl?: string
  artworkUrl?: string
  isExclusive?: boolean
  isActive?: boolean
  featured?: boolean
  
  // Stripe Price IDs
  stripeWavPriceId?: string | null
  stripeTrackoutPriceId?: string | null
  stripeUnlimitedPriceId?: string | null
}

export interface BeatFilters {
  genre?: string
  bpmMin?: number
  bpmMax?: number
  key?: string
  priceMin?: number
  priceMax?: number
  isExclusive?: boolean
  featured?: boolean
  search?: string
}

export interface BeatSortOptions {
  field: 'title' | 'genre' | 'bpm' | 'price' | 'rating' | 'createdAt'
  order: 'asc' | 'desc'
}
