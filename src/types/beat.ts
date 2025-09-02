export interface Beat {
  id: string
  title: string
  description?: string | null
  genre: string
  bpm: number
  key: string
  duration: string
  price: number
  rating: number
  reviewCount: number
  tags: string[]
  stripePriceId?: string | null
  previewUrl?: string | null
  fullUrl?: string | null
  stemsUrl?: string | null
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
  price: number
  tags: string[]
  previewUrl?: string
  fullUrl?: string
  stemsUrl?: string
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
  price?: number
  tags?: string[]
  previewUrl?: string
  fullUrl?: string
  stemsUrl?: string
  isExclusive?: boolean
  isActive?: boolean
  featured?: boolean
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
