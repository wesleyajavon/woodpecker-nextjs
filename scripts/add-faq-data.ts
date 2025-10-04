#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding FAQ data...');

  try {
    // Find or create the licenses category
    let licensesCategory = await prisma.fAQCategory.findUnique({
      where: { slug: 'licenses' },
    });

    if (!licensesCategory) {
      console.log('❌ Licenses category not found, creating it first...');
      licensesCategory = await prisma.fAQCategory.create({
        data: {
          name: 'licenses',
          slug: 'licenses',
          displayName: 'Licenses',
          icon: 'Shield',
          sortOrder: 1,
        },
      });
    }

    // Add FAQ items for licenses
    await Promise.all([
      prisma.fAQItem.upsert({
        where: { slug: 'quelle-est-la-difference-entre-les-licences' },
        update: {},
        create: {
          question: 'Quelle est la différence entre les licences WAV, Trackout et Unlimited ?',
          answer: 'La licence WAV inclut les fichiers WAV et MP3 avec des droits limités (5 000 copies, 100 000 streams). La licence Trackout ajoute les stems (pistes séparées) avec plus de droits (10 000 copies, 250 000 streams). La licence Unlimited offre tous les fichiers avec des droits illimités pour un usage commercial complet.',
          categoryId: licensesCategory.id,
          slug: 'quelle-est-la-difference-entre-les-licences',
          sortOrder: 1,
          featured: true,
        },
      }),
      prisma.fAQItem.upsert({
        where: { slug: 'puis-je-utiliser-le-beat-pour-un-usage-commercial' },
        update: {},
        create: {
          question: 'Puis-je utiliser le beat pour un usage commercial ?',
          answer: 'Oui, toutes nos licences permettent l\'usage commercial. Cependant, les licences WAV et Trackout têm des limitations sur le nombre de copies et de streams. Seule la licence Unlimited permet un usage commercial illimité.',
          categoryId: licensesCategory.id,
          slug: 'puis-je-utiliser-le-beat-pour-un-usage-commercial',
          sortOrder: 2,
          featured: false,
        },
      }),
      prisma.fAQItem.upsert({
        where: { slug: 'le-credit-producteur-est-il-obligatoire' },
        update: {},
        create: {
          question: 'Le crédit producteur est-il obligatoire ?',
          answer: 'Oui, le crédit "Prod. l.outsider" est obligatoire sur tous les titres utilisant nos beats, quelle que soit la licence. Ce crédit doit apparaître clairement dans les métadonnées et crédits du morceau.',
          categoryId: licensesCategory.id,
          slug: 'le-credit-producteur-est-il-obligatoire',
          sortOrder: 3,
          featured: true,
        },
      }),
    ]);

    console.log('✅ Created FAQ items');

  } catch (error) {
    console.error('❌ Error adding FAQ data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('💥 Adding FAQ data failed:', e);
    process.exit(1);
  });