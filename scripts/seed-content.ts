#!/usr/bin/env tsx

/**
 * Content Seeding Script for Woodpecker
 * Migrates hardcoded content to database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting content seeding...');

  try {
    // Create FAQ Categories
    console.log('📁 Creating FAQ categories...');
    
    const faqCategories = [
      {
        name: 'licenses',
        slug: 'licenses',
        displayName: 'Licenses',
        icon: 'Shield',
        sortOrder: 1,
      },
      {
        name: 'payment',
        slug: 'payment',
        displayName: 'Payment',
        icon: 'CreditCard',
        sortOrder: 2,
      },
      {
        name: 'download',
        slug: 'download',
        displayName: 'Download',
        icon: 'Download',
        sortOrder: 3,
      },
      {
        name: 'usage',
        slug: 'usage',
        displayName: 'Usage',
        icon: 'Music',
        sortOrder: 4,
      },
      {
        name: 'account',
        slug: 'account',
        displayName: 'Account',
        icon: 'Users',
        sortOrder: 5,
      },
    ];

    for (const categoryData of faqCategories) {
      await prisma.fAQCategory.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });
    }

    // Create FAQ Items (License)
    console.log('💬 Creating FAQ items (Licenses)...');
    const licensesCategory = await prisma.fAQCategory.findUnique({
      where: { slug: 'licenses' }
    });

    if (licensesCategory) {
      const licenseFAQs = [
        {
          question: 'Quelle est la différence entre les licences WAV, Trackout et Unlimited ?',
          answer: 'La licence WAV inclut les fichiers WAV et MP3 avec des droits limités (5 000 copies, 100 000 streams). La licence Trackout ajoute les stems (pistes séparées) avec plus de droits (10 000 copies, 250 000 streams). La licence Unlimited offre tous les fichiers avec des droits illimités pour un usage commercial complet.',
          categoryId: licensesCategory.id,
          sortOrder: 1,
        },
        {
          question: 'Puis-je utiliser le beat pour un usage commercial ?',
          answer: 'Oui, toutes nos licences permettent l\'usage commercial. Cependant, les licences WAV et Trackout têm des limitations sur le nombre de copies et de streams. Seule la licence Unlimited permet un usage commercial illimité.',
          categoryId: licensesCategory.id,
          sortOrder: 2,
        },
        {
          question: 'Le crédit producteur est-il obligatoire ?',
          answer: 'Oui, le crédit "Prod. l.outsider" est obligatoire sur tous les titres utilisant nos beats, quelle que soit la licence. Ce crédit doit apparaître clairement dans les métadonnées et crédits du morceau.',
          categoryId: licensesCategory.id,
          sortOrder: 3,
        },
        {
          question: 'Les licences sont-elles exclusives ?',
          answer: 'Non, nos licences standard ne sont pas exclusives. Le même beat peut être vendu à plusieurs artistes. Pour une licence exclusive, contactez-nous directement pour un devis personnalisé.',
          categoryId: licensesCategory.id,
          sortOrder: 4,
        },
        {
          question: 'Puis-je modifier le beat après l\'achat ?',
          answer: 'Oui, vous pouvez modifier, arranger et personnaliser le beat selon vos besoins artistiques. Les stems inclus dans les licences Trackout et Unlimited facilitent grandement ces modifications.',
          categoryId: licensesCategory.id,
          sortOrder: 5,
        },
      ];

      for (const faqData of licenseFAQs) {
        await prisma.fAQItem.create({
          data: {
            ...faqData,
            slug: faqData.question.toLowerCase()
              .replace(/[àáâãäå]/g, 'a')
              .replace(/[èéêë]/g, 'e')
              .replace(/[ìíîï]/g, 'i')
              .replace(/[òóôõö]/g, 'o')
              .replace(/[ùúûü]/g, 'u')
              .replace(/[ç]/g, 'c')
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-'),
          },
        });
      }
    }

    // Create License Types
    console.log('📄 Creating license types...');
    
    const licenseTypes = [
      {
        name: 'wav',
        slug: 'wav',
        displayName: 'WAV Lease - Licence Non-Exclusive',
        description: 'Licence non-exclusive de 10 ans permettant l\'usage commercial du beat avec des droits essentiels pour artistes et producteurs.',
        basePrice: 19.99,
        features: [
          'Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps',
          'Droit d\'enregistrer des voix sur le beat pour créer une nouvelle chanson',
          'Modification autorisée (arrangement, tempo, tonalité, durée)',
          'Distribution jusqu\'à 5 000 copies physiques et digitales',
          'Jusqu\'à 100 000 streams audio monétisés',
          '1 clip vidéo monétisé (max 5 minutes)',
          'Performances live non-profit illimitées',
          'Vente en format single, EP ou album',
          'Partage des droits d\'auteur : 50% Producteur / 50% Artiste',
          'Pas de redevances supplémentaires à payer'
        ],
        limitations: [
          'Licence NON-EXCLUSIVE (le beat peut être vendu à d\'autres)',
          'Pas de fichiers stems/trackouts inclus',
          'Aucune performance live payante autorisée',
          'Pas de diffusion radio/TV commerciale',
          'Pas de synchronisation (films, pubs, jeux vidéo)',
          'Interdiction de revendre le beat dans sa forme originale',
          'Pas de droit de sous-licencier à des tiers',
          'Crédit producteur \'Prod. l.outsider\' OBLIGATOIRE',
          'Durée limitée à 10 ans à partir de l\'achat',
          'Interdiction d\'enregistrer le beat seul avec Content ID'
        ],
        useCases: [
          'Singles et projets musicaux indépendants',
          'Mixtapes et compilations gratuites',
          'Streaming sur Spotify, Apple Music, Deezer',
          'Concerts et festivals non-commerciaux',
          'Promotion sur réseaux sociaux',
          'Vente digitale et physique limitée'
        ],
        maxCopies: 5000,
        maxStreams: 100000,
        maxVideos: 1,
        includesStems: false,
      },
      {
        name: 'trackout',
        slug: 'trackout',
        displayName: 'Trackout Lease - Licence Premium avec Stems',
        description: 'Licence non-exclusive de 10 ans incluant les stems pour un contrôle créatif total et des droits commerciaux étendus.',
        basePrice: 39.99,
        features: [
          'Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps',
          'Stems/Trackouts complets (pistes séparées)',
          'Droit d\'enregistrer et modifier librement le beat',
          'Remixage et arrangements personnalisés autorisés',
          'Distribution jusqu\'à 10 000 copies physiques et digitales',
          'Jusqu\'à 250 000 streams audio monétisés',
          '3 clips vidéo monétisés (max 5 minutes chacun)',
          'Performances live non-profit illimitées',
          'Vente en format single, EP ou album',
          'Partage des droits d\'auteur : 50% Producteur / 50% Artiste',
          'Pas de redevances supplémentaires à payer'
        ],
        limitations: [
          'Licence NON-EXCLUSIVE (le beat peut être vendu à d\'autres)',
          'Aucune performance live payante autorisée',
          'Pas de diffusion radio/TV commerciale',
          'Pas de synchronisation (films, pubs, jeux vidéo)',
          'Interdiction de revendre le beat ou les stems dans leur forme originale',
          'Pas de droit de sous-licencier à des tiers',
          'Crédit producteur \'Prod. l.outsider\' OBLIGATOIRE',
          'Durée limitée à 10 ans à partir de l\'achat'
        ],
        useCases: [
          'Albums et EPs professionnels',
          'Remixage et production avancée',
          'Collaborations artistiques',
          'Clips vidéo multiples et promotion',
          'Distribution élargie sur plateformes',
          'Projets créatifs nécessitant les stems'
        ],
        maxCopies: 10000,
        maxStreams: 250000,
        maxVideos: 3,
        includesStems: true,
      },
      {
        name: 'unlimited',
        slug: 'unlimited',
        displayName: 'Unlimited Lease - Licence Commerciale Complète',
        description: 'Licence non-exclusive de 10 ans offrant tous les droits commerciaux pour une utilisation professionnelle sans limitations de distribution.',
        basePrice: 79.99,
        features: [
          'Fichiers WAV haute qualité (24-bit/44.1kHz) et MP3 320kbps',
          'Stems/Trackouts complets (pistes séparées)',
          'Droit d\'enregistrer et modifier librement le beat',
          'Distribution ILLIMITÉE de copies physiques et digitales',
          'Streams audio monétisés ILLIMITÉS',
          'Clips vidéo monétisés ILLIMITÉS',
          'Performances live payantes AUTORISÉES',
          'Diffusion radio et télévision commerciale',
          'Synchronisation (films, publicités, documentaires, jeux vidéo)',
          'Vente en format single, EP ou album sans restriction',
          'Partage des droits d\'auteur : 50% Producteur / 50% Artiste',
          'Pas de redevances supplémentaires à payer'
        ],
        limitations: [
          'Licence NON-EXCLUSIVE (le beat peut être vendu à d\'autres)',
          'Interdiction de revendre le beat ou les stems dans leur forme originale',
          'Pas de droit de sous-licencier à des tiers',
          'Crédit producteur \'Prod. l.outsider\' OBLIGATOIRE',
          'Durée limitée à 10 ans à partir de l\'achat'
        ],
        useCases: [
          'Projets commerciaux majeurs et albums',
          'Tournées et concerts payants',
          'Campagnes publicitaires et marketing',
          'Films, documentaires et contenus audiovisuels',
          'Diffusion radio/TV et podcasts',
          'Distribution mondiale sans restriction',
          'Synchronisation pour médias et jeux vidéo',
          'Projets nécessitant une flexibilité commerciale totale'
        ],
        maxCopies: null, // Unlimited
        maxStreams: null, // Unlimited
        maxVideos: null, // Unlimited
        includesStems: true,
        allowsLiveProfit: true,
        allowsRadioTV: true,
        allowsSync: true,
      },
    ];

    for (this: licenseData of licenseTypes) {
      await prisma.licenseInfo.upsert({
        where: { slug: licenseData.slug },
        update: licenseData,
        create: const licenseTypes = [
      {

      },
    ];

    for (const licenseData of licenseTypes) {
      await prisma.licenseInfo.upsert({
        where: { slug: licenseData.slug },
        update: licenseData,
        create: licenseData,
      });
    }

    console.log('✅ Content seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`- ${faqCategories.length} FAQ categories`);
    console.log(`- ${await prisma.fAQItem.count()} FAQ items`);
    console.log(`- ${licenseTypes.length} license types`);

  } catch (error) {
    console.error('❌ Error seeding content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('💥 Seeding failed:', e);
    process.exit(1);
  });