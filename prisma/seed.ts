import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.order.deleteMany()
  await prisma.beat.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create sample beats
  const beats = [
    {
      title: 'Midnight Trap',
      description: 'Beat trap sombre et atmosphérique avec des 808 puissants',
      genre: 'Trap',
      bpm: 140,
      key: 'C#',
      duration: '3:24',
      price: 29.99,
      rating: 4.8,
      reviewCount: 45,
      tags: ['Dark', 'Hard', 'Underground'],
      previewUrl: 'https://example.com/preview/midnight-trap.mp3',
      fullUrl: 'https://example.com/full/midnight-trap.wav',
      stemsUrl: 'https://example.com/stems/midnight-trap.zip',
      isExclusive: false,
      featured: true
    },
    {
      title: 'Summer Vibes',
      description: 'Beat hip-hop mélodique parfait pour l\'été',
      genre: 'Hip-Hop',
      bpm: 135,
      key: 'F',
      duration: '3:18',
      price: 24.99,
      rating: 4.6,
      reviewCount: 32,
      tags: ['Chill', 'Melodic', 'Feel Good'],
      previewUrl: 'https://example.com/preview/summer-vibes.mp3',
      fullUrl: 'https://example.com/full/summer-vibes.wav',
      isExclusive: false,
      featured: true
    },
    {
      title: 'Dark Night',
      description: 'Beat drill UK avec des patterns complexes et des 808 lourds',
      genre: 'Drill',
      bpm: 145,
      key: 'A#',
      duration: '3:45',
      price: 34.99,
      rating: 4.8,
      reviewCount: 28,
      tags: ['Drill', 'UK', 'Aggressive'],
      previewUrl: 'https://example.com/preview/dark-night.mp3',
      fullUrl: 'https://example.com/full/dark-night.wav',
      isExclusive: true,
      featured: true
    },
    {
      title: 'Smooth Jazz',
      description: 'Beat jazz smooth avec des samples authentiques',
      genre: 'Jazz',
      bpm: 120,
      key: 'D',
      duration: '4:12',
      price: 39.99,
      rating: 4.7,
      reviewCount: 19,
      tags: ['Jazz', 'Smooth', 'Soul'],
      previewUrl: 'https://example.com/preview/smooth-jazz.mp3',
      fullUrl: 'https://example.com/full/smooth-jazz.wav',
      isExclusive: false,
      featured: false
    },
    {
      title: 'Electric Dreams',
      description: 'Beat électronique avec des synthés futuristes',
      genre: 'Electronic',
      bpm: 128,
      key: 'E',
      duration: '3:52',
      price: 27.99,
      rating: 4.5,
      reviewCount: 23,
      tags: ['Electronic', 'Synth', 'Futuristic'],
      previewUrl: 'https://example.com/preview/electric-dreams.mp3',
      fullUrl: 'https://example.com/full/electric-dreams.wav',
      isExclusive: false,
      featured: false
    },
    {
      title: 'Street Poetry',
      description: 'Beat boom bap classique dans l\'esprit golden era',
      genre: 'Boom Bap',
      bpm: 90,
      key: 'G',
      duration: '3:30',
      price: 22.99,
      rating: 4.9,
      reviewCount: 41,
      tags: ['Boom Bap', 'Classic', 'Golden Era'],
      previewUrl: 'https://example.com/preview/street-poetry.mp3',
      fullUrl: 'https://example.com/full/street-poetry.wav',
      isExclusive: false,
      featured: true
    },
    {
      title: 'Neon Lights',
      description: 'Beat synthwave avec des influences 80s',
      genre: 'Synthwave',
      bpm: 110,
      key: 'B',
      duration: '3:58',
      price: 31.99,
      rating: 4.4,
      reviewCount: 17,
      tags: ['Synthwave', '80s', 'Retro'],
      previewUrl: 'https://example.com/preview/neon-lights.mp3',
      fullUrl: 'https://example.com/full/neon-lights.wav',
      isExclusive: false,
      featured: false
    },
    {
      title: 'Urban Flow',
      description: 'Beat trap moderne avec des mélodies urbaines',
      genre: 'Trap',
      bpm: 138,
      key: 'F#',
      duration: '3:15',
      price: 26.99,
      rating: 4.6,
      reviewCount: 35,
      tags: ['Trap', 'Urban', 'Modern'],
      previewUrl: 'https://example.com/preview/urban-flow.mp3',
      fullUrl: 'https://example.com/full/urban-flow.wav',
      isExclusive: false,
      featured: false
    }
  ]

  // Insert beats
  for (const beatData of beats) {
    await prisma.beat.create({
      data: {
        ...beatData,
        price: new Decimal(beatData.price)
      }
    })
  }

  console.log(`✅ Created ${beats.length} beats`)

  // Create sample orders
  const orders = [
    {
      customerEmail: 'john.doe@example.com',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      totalAmount: 29.99,
      currency: 'EUR',
      status: 'COMPLETED',
      paymentMethod: 'Stripe',
      paymentId: 'pi_1234567890',
      paidAt: new Date('2024-01-15'),
      licenseType: 'NON_EXCLUSIVE',
      usageRights: ['Commercial Use', 'Streaming', 'Live Performance'],
      beatId: '1' // Will be updated after beats are created
    },
    {
      customerEmail: 'jane.smith@example.com',
      customerName: 'Jane Smith',
      customerPhone: '+0987654321',
      totalAmount: 34.99,
      currency: 'EUR',
      status: 'PAID',
      paymentMethod: 'PayPal',
      paymentId: 'PAY-1234567890',
      paidAt: new Date('2024-01-20'),
      licenseType: 'EXCLUSIVE',
      usageRights: ['Exclusive Rights', 'Commercial Use', 'Streaming', 'Live Performance'],
      beatId: '3' // Will be updated after beats are created
    }
  ]

  // Get the first beat for orders
  const firstBeat = await prisma.beat.findFirst()
  const thirdBeat = await prisma.beat.findMany({ skip: 2, take: 1 })

  if (firstBeat && thirdBeat[0]) {
    // Update order beatIds
    orders[0].beatId = firstBeat.id
    orders[1].beatId = thirdBeat[0].id

    // Insert orders
    for (const orderData of orders) {
      await prisma.order.create({
        data: {
          ...orderData,
          totalAmount: new Decimal(orderData.totalAmount)
        }
      })
    }

    console.log(`✅ Created ${orders.length} orders`)
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
