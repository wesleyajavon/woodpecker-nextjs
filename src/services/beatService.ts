import { prisma } from '@/lib/prisma'
import { Beat, CreateBeatInput, UpdateBeatInput, BeatFilters, BeatSortOptions } from '@/types/beat'
// Import Decimal from Prisma
import { Decimal } from '@prisma/client/runtime/library'

// Type for Prisma Beat result with Decimal price
type PrismaBeatResult = Omit<Beat, 'price'> & {
  price: Decimal
}

// Type for the where clause in Prisma queries
type BeatWhereClause = {
  isActive?: boolean
  genre?: string
  bpm?: {
    gte?: number
    lte?: number
  }
  key?: string
  price?: {
    gte?: Decimal
    lte?: Decimal
  }
  isExclusive?: boolean
  featured?: boolean
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' }
    description?: { contains: string; mode: 'insensitive' }
    tags?: { hasSome: string[] }
  }>
}

export class BeatService {
  // Fonction utilitaire pour convertir les résultats Prisma
  private static convertPrismaBeat(beat: PrismaBeatResult): Beat {
    return {
      ...beat,
      price: Number(beat.price)
    }
  }

  // Créer un nouveau beat
  static async createBeat(data: CreateBeatInput): Promise<Beat> {
    const beat = await prisma.beat.create({
      data: {
        ...data,
        price: new Decimal(data.price)
      }
    })
    
    return this.convertPrismaBeat(beat as PrismaBeatResult)
  }
    

  // Get all beats with optional filters and sorting
  static async getBeats(
    filters: BeatFilters = {},
    sort: BeatSortOptions = { field: 'createdAt', order: 'desc' },
    page: number = 1,
    limit: number = 12
  ): Promise<{ beats: Beat[]; total: number; totalPages: number }> {
    const where: BeatWhereClause = {
      isActive: true
    }

    // Apply filters
    if (filters.genre && filters.genre !== 'Tous') {
      where.genre = filters.genre
    }

    if (filters.bpmMin || filters.bpmMax) {
      where.bpm = {}
      if (filters.bpmMin) where.bpm.gte = filters.bpmMin
      if (filters.bpmMax) where.bpm.lte = filters.bpmMax
    }

    if (filters.key) {
      where.key = filters.key
    }

    if (filters.priceMin || filters.priceMax) {
      where.price = {}
      if (filters.priceMin) where.price.gte = new Decimal(filters.priceMin)
      if (filters.priceMax) where.price.lte = new Decimal(filters.priceMax)
    }

    if (filters.isExclusive !== undefined) {
      where.isExclusive = filters.isExclusive
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } }
      ]
    }

    // Get total count
    const total = await prisma.beat.count({ where })

    // Get beats with pagination
    const beats = await prisma.beat.findMany({
      where,
      orderBy: { [sort.field]: sort.order },
      skip: (page - 1) * limit,
      take: limit
    })

    const totalPages = Math.ceil(total / limit)

    return {
      beats: beats.map(beat => this.convertPrismaBeat(beat as PrismaBeatResult)),
      total,
      totalPages
    }
  }

  // Get a single beat by ID
  static async getBeatById(id: string): Promise<Beat | null> {
    const beat = await prisma.beat.findUnique({
      where: { id }
    })
    
    return beat ? this.convertPrismaBeat(beat as PrismaBeatResult) : null
  }

  // Get featured beats
  static async getFeaturedBeats(limit: number = 4): Promise<Beat[]> {
    const beats = await prisma.beat.findMany({
      where: {
        featured: true,
        isActive: true
      },
      orderBy: { rating: 'desc' },
      take: limit
    })
    
    return beats.map(beat => this.convertPrismaBeat(beat as PrismaBeatResult))
  }

  // Get beats by genre
  static async getBeatsByGenre(genre: string, limit: number = 8): Promise<Beat[]> {
    const beats = await prisma.beat.findMany({
      where: {
        genre,
        isActive: true
      },
      orderBy: { rating: 'desc' },
      take: limit
    })
    
    return beats.map(beat => this.convertPrismaBeat(beat as PrismaBeatResult))
  }

  // Update a beat
  static async updateBeat(id: string, data: UpdateBeatInput): Promise<Beat> {
    const { price, ...otherData } = data
    
    // Create update data with proper typing
    const updateData: {
      title?: string
      description?: string
      genre?: string
      bpm?: number
      key?: string
      duration?: string
      price?: Decimal
      tags?: string[]
      previewUrl?: string
      fullUrl?: string
      stemsUrl?: string
      isExclusive?: boolean
      isActive?: boolean
      featured?: boolean
    } = { ...otherData }
    
    if (price !== undefined) {
      updateData.price = new Decimal(price)
    }

    const updatedBeat = await prisma.beat.update({
      where: { id },
      data: updateData
    })

    return this.convertPrismaBeat(updatedBeat as PrismaBeatResult)
  }

  // Delete a beat (soft delete by setting isActive to false)
  static async deleteBeat(id: string): Promise<Beat> {
    const deletedBeat = await prisma.beat.update({
      where: { id },
      data: { isActive: false }
    })

    return this.convertPrismaBeat(deletedBeat as PrismaBeatResult)
  }

  // Update beat rating
  static async updateBeatRating(id: string, newRating: number): Promise<Beat> {
    const beat = await prisma.beat.findUnique({
      where: { id },
      select: { rating: true, reviewCount: true }
    })

    if (!beat) {
      throw new Error('Beat not found')
    }

    const totalRating = beat.rating * beat.reviewCount + newRating
    const newReviewCount = beat.reviewCount + 1
    const averageRating = totalRating / newReviewCount

    const updatedBeat = await prisma.beat.update({
      where: { id },
      data: {
        rating: averageRating,
        reviewCount: newReviewCount
      }
    })

    return this.convertPrismaBeat(updatedBeat as PrismaBeatResult)
  }

  // Get beats statistics
  static async getBeatStats() {
    const totalBeats = await prisma.beat.count({ where: { isActive: true } })
    const totalGenres = await prisma.beat.groupBy({
      by: ['genre'],
      where: { isActive: true },
      _count: { genre: true }
    })
    const averagePrice = await prisma.beat.aggregate({
      where: { isActive: true },
      _avg: { price: true }
    })
    const totalRevenue = await prisma.beat.aggregate({
      where: { isActive: true },
      _sum: { price: true }
    })

    return {
      totalBeats,
      totalGenres: totalGenres.length,
      averagePrice: averagePrice._avg.price ? Number(averagePrice._avg.price) : 0,
      totalRevenue: totalRevenue._sum.price ? Number(totalRevenue._sum.price) : 0
    }
  }
}
