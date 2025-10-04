import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCompleteFAQData() {
  try {
    console.log('🌱 Seeding complete FAQ data...');

    // Get all categories
    const categories = await prisma.fAQCategory.findMany();
    const categoryMap = Object.fromEntries(
      categories.map(cat => [cat.slug, cat.id])
    );

    console.log(`📁 Found ${categories.length} categories:`, Object.keys(categoryMap));

    // Complete FAQ data
    const faqItems = [
      // Licences
      {
        id: 'faq-licenses-1',
        category: 'licenses',
        question: 'Quelle est la différence entre les licences WAV, Trackout et Unlimited ?',
          answer: 'La licence WAV inclut les fichiers WAV et MP3 avec des droits limités (5 000 copies, 100 000 streams). La licence Trackout ajoute les stems (pistes séparées) avec plus de droits (10 000 copies, 250 000 streams). La licence Unlimited offre tous les fichiers avec des droits illimités pour un usage commercial complet.',
        slug: 'difference-licences-wav-trackout-unlimited',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'faq-licenses-2',
        category: 'licenses',
        question: 'Puis-je utiliser le beat pour un usage commercial ?',
        answer: 'Oui, toutes nos licences permettent l\'usage commercial. Cependant, les licences WAV et Trackout ont des limitations sur le nombre de copies et de streams. Seule la licence Unlimited permet un usage commercial illimité.',
        slug: 'usage-commercial-beat',
        featured: true,
        sortOrder: 2,
      },
      {
        id: 'faq-licenses-3',
        category: 'licenses',
        question: 'Le crédit producteur est-il obligatoire ?',
        answer: 'Oui, le crédit "Prod. l.outsider" est obligatoire sur tous les titres utilisant nos beats, quelle que soit la licence. Ce crédit doit apparaître clairement dans les métadonnées et crédits du morceau.',
        slug: 'credit-producteur-obligatoire',
        featured: true,
        sortOrder: 3,
      },
      {
        id: 'faq-licenses-4',
        category: 'licenses',
        question: 'Les licences sont-elles exclusives ?',
        answer: 'Non, nos licences standard ne sont pas exclusives. Le même beat peut être vendu à plusieurs artistes. Pour une licence exclusive, contactez-nous directement pour un devis personnalisé.',
        slug: 'licences-exclusives',
        featured: false,
        sortOrder: 4,
      },
      {
        id: 'faq-licenses-5',
        category: 'licenses',
        question: 'Puis-je modifier le beat après l\'achat ?',
        answer: 'Oui, vous pouvez modifier, arranger et personnaliser le beat selon vos besoins artistiques. Les stems inclus dans les licences Trackout et Unlimited facilitent grandement ces modifications.',
        slug: 'modifier-beat-apres-achat',
        featured: false,
        sortOrder: 5,
      },

      // Paiement
      {
        id: 'faq-payment-1',
        category: 'payment',
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe, ainsi que PayPal. Tous les paiements sont sécurisés et cryptés.',
        slug: 'moyens-paiement-acceptes',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'faq-payment-2',
        category: 'payment',
        question: 'Puis-je obtenir un remboursement ?',
        answer: 'Aucun remboursement n\'est possible après le téléchargement des fichiers. Nous vous encourageons à bien écouter les previews avant l\'achat. En cas de problème technique, contactez notre support.',
        slug: 'remboursement-apres-achat',
        featured: false,
        sortOrder: 2,
      },
      {
        id: 'faq-payment-3',
        category: 'payment',
        question: 'Puis-je acheter plusieurs beats en une fois ?',
        answer: 'Oui, vous pouvez ajouter plusieurs beats à votre panier et procéder à un paiement unique. Vous recevrez les liens de téléchargement pour tous vos achats par email.',
        slug: 'acheter-pluieurs-beats',
        featured: false,
        sortOrder: 3,
      },
      {
        id: 'faq-payment-4',
        category: 'payment',
        question: 'Les prix incluent-ils les taxes ?',
        answer: 'Les prix affichés sont TTC (toutes taxes comprises) pour les clients français. Pour les clients internationaux, les taxes locales peuvent s\'appliquer selon la législation de votre pays.',
        slug: 'prix-incluent-taxes',
        featured: false,
        sortOrder: 4,
      },

      // Téléchargement
      {
        id: 'faq-download-1',
        category: 'download',
        question: 'Comment télécharger mes beats après l\'achat ?',
        answer: 'Après votre achat, vous recevrez un email avec les liens de téléchargement. Vous pouvez également accéder à vos achats depuis votre profil sur le site. Les liens sont valables pendant 30 jours.',
        slug: 'comment-telecharger-beats',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'faq-download-2',
        category: 'download',
        question: 'Dans quels formats sont les fichiers ?',
        answer: 'Les previews sont en MP3 320kbps. Les masters sont en WAV 24-bit/44.1kHz. Les stems sont fournis en WAV séparés pour chaque élément (batterie, basse, mélodies, etc.).',
        slug: 'formats-fichiers-telechargement',
        featured: true,
        sortOrder: 2,
      },
      {
        id: 'faq-download-3',
        category: 'download',
        question: 'Que faire si le téléchargement ne fonctionne pas ?',
        answer: 'Vérifiez d\'abord votre connexion internet et l\'espace disque disponible. Si le problème persiste, contactez notre support avec votre numéro de commande. Nous vous renverrons les liens rapidement.',
        slug: 'telechargement-ne-fonctionne-pas',
        featured: false,
        sortOrder: 3,
      },
      {
        id: 'faq-download-4',
        category: 'download',
        question: 'Combien de fois puis-je télécharger mes fichiers ?',
        answer: 'Vous pouvez télécharger vos fichiers autant de fois que nécessaire pendant la période de validité des liens (30 jours). Après cette période, contactez le support pour un nouveau lien.',
        slug: 'combien-fois-telecharger-fichiers',
        featured: false,
        sortOrder: 4,
      },

      // Utilisation
      {
        id: 'faq-usage-1',
        category: 'usage',
        question: 'Puis-je utiliser le beat sur plusieurs plateformes ?',
        answer: 'Oui, vous pouvez diffuser votre titre sur toutes les plateformes de streaming (Spotify, Apple Music, YouTube, etc.) dans les limites de votre licence (nombre de streams autorisés).',
        slug: 'utiliser-beat-plusieurs-plateformes',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'faq-usage-2',
        category: 'usage',
        question: 'Puis-je faire des concerts avec le beat ?',
        answer: 'Oui, toutes les licences permettent les performances live non-commerciales illimitées. Pour les concerts payants et événements commerciaux, seule la licence Unlimited est autorisée.',
        slug: 'concerts-avec-beat',
        featured: false,
        sortOrder: 2,
      },
      {
        id: 'faq-usage-3',
        category: 'usage',
        question: 'Puis-je utiliser le beat dans une publicité ou un film ?',
        answer: 'Seule la licence Unlimited permet l\'usage en synchronisation (publicités, films, documentaires). Les licences WAV et Trackout ne couvrent pas ces usages commerciaux spécialisés.',
        slug: 'utiliser-beat-publicite-film',
        featured: false,
        sortOrder: 3,
      },
      {
        id: 'faq-usage-4',
        category: 'usage',
        question: 'Que se passe-t-il si je dépasse les limites de ma licence ?',
        answer: 'Si vous dépassez les limites (streams, copies), vous devez upgrader vers une licence supérieure. Contactez-nous pour régulariser votre situation et éviter tout problème de droits d\'auteur.',
        slug: 'depasser-limites-licence',
        featured: false,
        sortOrder: 4,
      },

      // Compte
      {
        id: 'faq-account-1',
        category: 'account',
        question: 'Dois-je créer un compte pour acheter ?',
        answer: 'Un compte n\'est pas obligatoire pour acheter, mais il est fortement recommandé. Il vous permet de retrouver facilement vos achats, télécharger à nouveau vos fichiers et suivre vos commandes.',
        slug: 'creer-compte-pour-acheter',
        featured: true,
        sortOrder: 1,
      },
      {
        id: 'faq-account-2',
        category: 'account',
        question: 'Comment modifier mes informations de compte ?',
        answer: 'Connectez-vous à votre compte et accédez à la section "Profil". Vous pouvez y modifier votre email, mot de passe et autres informations personnelles.',
        slug: 'modifier-informations-compte',
        featured: false,
        sortOrder: 2,
      },
      {
        id: 'faq-account-3',
        category: 'account',
        question: 'J\'ai oublié mon mot de passe, que faire ?',
        answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe. Vérifiez aussi vos spams.',
        slug: 'oublie-mot-passe',
        featured: false,
        sortOrder: 3,
      },
      {
        id: 'faq-account-4',
        category: 'account',
        question: 'Puis-je supprimer mon compte ?',
        answer: 'Oui, vous pouvez supprimer votre compte en nous contactant. Attention : cette action est irréversible et vous perdrez l\'accès à vos achats précédents.',
        slug: 'supprimer-compte',
        featured: false,
        sortOrder: 4,
      },
    ];

    console.log(`📝 Adding ${faqItems.length} FAQ items to database...`);

    for (const item of faqItems) {
      const categoryId = categoryMap[item.category];
      if (!categoryId) {
        console.error(`❌ Category not found: ${item.category}`);
        continue;
      }

      await prisma.fAQItem.upsert({
        where: { slug: item.slug },
        update: {
          question: item.question,
          answer: item.answer,
          featured: item.featured,
          sortOrder: item.sortOrder,
        },
        create: {
          question: item.question,
          answer: item.answer,
          slug: item.slug,
          featured: item.featured,
          sortOrder: item.sortOrder,
          categoryId: categoryId,
          isActive: true,
        },
      });
      console.log(`✅ Added FAQ: ${item.question.substring(0, 50)}...`);
    }

    console.log('🎉 Successfully seeded all FAQ data!');

    // Summary
    const totalFAQs = await prisma.fAQItem.count();
    const totalCategories = await prisma.fAQCategory.count();
    console.log(`📊 Final stats: ${totalFAQs} FAQs across ${totalCategories} categories`);

  } catch (error) {
    console.error('❌ Error seeding FAQ data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteFAQData();
