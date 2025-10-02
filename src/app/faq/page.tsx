'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Music, 
  CreditCard, 
  Download, 
  Shield, 
  Users,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Categories will be defined inside the component to use translations

const faqData: FAQItem[] = [
  // Licences
  {
    id: '1',
    category: 'licenses',
    question: 'Quelle est la différence entre les licences WAV, Trackout et Unlimited ?',
    answer: 'La licence WAV inclut les fichiers WAV et MP3 avec des droits limités (5 000 copies, 100 000 streams). La licence Trackout ajoute les stems (pistes séparées) avec plus de droits (10 000 copies, 250 000 streams). La licence Unlimited offre tous les fichiers avec des droits illimités pour un usage commercial complet.'
  },
  {
    id: '2',
    category: 'licenses',
    question: 'Puis-je utiliser le beat pour un usage commercial ?',
    answer: 'Oui, toutes nos licences permettent l\'usage commercial. Cependant, les licences WAV et Trackout ont des limitations sur le nombre de copies et de streams. Seule la licence Unlimited permet un usage commercial illimité.'
  },
  {
    id: '3',
    category: 'licenses',
    question: 'Le crédit producteur est-il obligatoire ?',
    answer: 'Oui, le crédit "Prod. l.outsider" est obligatoire sur tous les titres utilisant nos beats, quelle que soit la licence. Ce crédit doit apparaître clairement dans les métadonnées et crédits du morceau.'
  },
  {
    id: '4',
    category: 'licenses',
    question: 'Les licences sont-elles exclusives ?',
    answer: 'Non, nos licences standard ne sont pas exclusives. Le même beat peut être vendu à plusieurs artistes. Pour une licence exclusive, contactez-nous directement pour un devis personnalisé.'
  },
  {
    id: '5',
    category: 'licenses',
    question: 'Puis-je modifier le beat après l\'achat ?',
    answer: 'Oui, vous pouvez modifier, arranger et personnaliser le beat selon vos besoins artistiques. Les stems inclus dans les licences Trackout et Unlimited facilitent grandement ces modifications.'
  },

  // Paiement
  {
    id: '6',
    category: 'payment',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe, ainsi que PayPal. Tous les paiements sont sécurisés et cryptés.'
  },
  {
    id: '7',
    category: 'payment',
    question: 'Puis-je obtenir un remboursement ?',
    answer: 'Aucun remboursement n\'est possible après le téléchargement des fichiers. Nous vous encourageons à bien écouter les previews avant l\'achat. En cas de problème technique, contactez notre support.'
  },
  {
    id: '8',
    category: 'payment',
    question: 'Puis-je acheter plusieurs beats en une fois ?',
    answer: 'Oui, vous pouvez ajouter plusieurs beats à votre panier et procéder à un paiement unique. Vous recevrez les liens de téléchargement pour tous vos achats par email.'
  },
  {
    id: '9',
    category: 'payment',
    question: 'Les prix incluent-ils les taxes ?',
    answer: 'Les prix affichés sont TTC (toutes taxes comprises) pour les clients français. Pour les clients internationaux, les taxes locales peuvent s\'appliquer selon la législation de votre pays.'
  },

  // Téléchargement
  {
    id: '10',
    category: 'download',
    question: 'Comment télécharger mes beats après l\'achat ?',
    answer: 'Après votre achat, vous recevrez un email avec les liens de téléchargement. Vous pouvez également accéder à vos achats depuis votre profil sur le site. Les liens sont valables pendant 30 jours.'
  },
  {
    id: '11',
    category: 'download',
    question: 'Dans quels formats sont les fichiers ?',
    answer: 'Les previews sont en MP3 320kbps. Les masters sont en WAV 24-bit/44.1kHz. Les stems sont fournis en WAV séparés pour chaque élément (batterie, basse, mélodies, etc.).'
  },
  {
    id: '12',
    category: 'download',
    question: 'Que faire si le téléchargement ne fonctionne pas ?',
    answer: 'Vérifiez d\'abord votre connexion internet et l\'espace disque disponible. Si le problème persiste, contactez notre support avec votre numéro de commande. Nous vous renverrons les liens rapidement.'
  },
  {
    id: '13',
    category: 'download',
    question: 'Combien de fois puis-je télécharger mes fichiers ?',
    answer: 'Vous pouvez télécharger vos fichiers autant de fois que nécessaire pendant la période de validité des liens (30 jours). Après cette période, contactez le support pour un nouveau lien.'
  },

  // Utilisation
  {
    id: '14',
    category: 'usage',
    question: 'Puis-je utiliser le beat sur plusieurs plateformes ?',
    answer: 'Oui, vous pouvez diffuser votre titre sur toutes les plateformes de streaming (Spotify, Apple Music, YouTube, etc.) dans les limites de votre licence (nombre de streams autorisés).'
  },
  {
    id: '15',
    category: 'usage',
    question: 'Puis-je faire des concerts avec le beat ?',
    answer: 'Oui, toutes les licences permettent les performances live non-commerciales illimitées. Pour les concerts payants et événements commerciaux, seule la licence Unlimited est autorisée.'
  },
  {
    id: '16',
    category: 'usage',
    question: 'Puis-je utiliser le beat dans une publicité ou un film ?',
    answer: 'Seule la licence Unlimited permet l\'usage en synchronisation (publicités, films, documentaires). Les licences WAV et Trackout ne couvrent pas ces usages commerciaux spécialisés.'
  },
  {
    id: '17',
    category: 'usage',
    question: 'Que se passe-t-il si je dépasse les limites de ma licence ?',
    answer: 'Si vous dépassez les limites (streams, copies), vous devez upgrader vers une licence supérieure. Contactez-nous pour régulariser votre situation et éviter tout problème de droits d\'auteur.'
  },

  // Compte
  {
    id: '18',
    category: 'account',
    question: 'Dois-je créer un compte pour acheter ?',
    answer: 'Un compte n\'est pas obligatoire pour acheter, mais il est fortement recommandé. Il vous permet de retrouver facilement vos achats, télécharger à nouveau vos fichiers et suivre vos commandes.'
  },
  {
    id: '19',
    category: 'account',
    question: 'Comment modifier mes informations de compte ?',
    answer: 'Connectez-vous à votre compte et accédez à la section "Profil". Vous pouvez y modifier votre email, mot de passe et autres informations personnelles.'
  },
  {
    id: '20',
    category: 'account',
    question: 'J\'ai oublié mon mot de passe, que faire ?',
    answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe. Vérifiez aussi vos spams.'
  },
  {
    id: '21',
    category: 'account',
    question: 'Puis-je supprimer mon compte ?',
    answer: 'Oui, vous pouvez supprimer votre compte en nous contactant. Attention : cette action est irréversible et vous perdrez l\'accès à vos achats précédents.'
  }
];

export default function FAQPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const faqCategories = [
    { id: 'all', name: t('faq.categories.all'), icon: HelpCircle },
    { id: 'licenses', name: t('faq.categories.licenses'), icon: Shield },
    { id: 'payment', name: t('faq.categories.payment'), icon: CreditCard },
    { id: 'download', name: t('faq.categories.download'), icon: Download },
    { id: 'usage', name: t('faq.categories.usage'), icon: Music },
    { id: 'account', name: t('faq.categories.account'), icon: Users }
  ];
  
  const ITEMS_PER_PAGE = 6;

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFAQs = filteredFAQs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of FAQ section
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('faq.title')}{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
                {t('faq.titleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('faq.subtitle')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card/10 backdrop-blur-lg border border-border/20 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card/10 backdrop-blur-lg text-muted-foreground hover:text-foreground hover:bg-card/20'
                  )}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Info */}
          {filteredFAQs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                {filteredFAQs.length === 1 
                  ? t('faq.resultsCountSingle') 
                  : t('faq.resultsCount', { count: filteredFAQs.length })
                }
                {totalPages > 1 && (
                  <span> • {t('faq.pageInfo', { current: currentPage, total: totalPages })}</span>
                )}
              </p>
            </motion.div>
          )}

          {/* FAQ Items */}
          <motion.div
            id="faq-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{t('faq.noQuestionsFound')}</h3>
                <p className="text-muted-foreground">
                  {t('faq.noQuestionsFoundDescription')}
                </p>
              </div>
            ) : (
              paginatedFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-card/10 backdrop-blur-lg rounded-xl border border-border/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-card/5 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                    {expandedItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-border/20 pt-4">
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                    currentPage === 1
                      ? 'bg-card/5 text-muted-foreground cursor-not-allowed'
                      : 'bg-card/10 backdrop-blur-lg text-foreground hover:bg-card/20'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('pagination.previous')}
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    // Show ellipsis
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        
                        {showPage && (
                          <button
                            onClick={() => goToPage(page)}
                            className={cn(
                              'w-10 h-10 rounded-lg transition-all flex items-center justify-center',
                              page === currentPage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card/10 backdrop-blur-lg text-foreground hover:bg-card/20'
                            )}
                          >
                            {page}
                          </button>
                        )}
                        
                        {showEllipsisAfter && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                    currentPage === totalPages
                      ? 'bg-card/5 text-muted-foreground cursor-not-allowed'
                      : 'bg-card/10 backdrop-blur-lg text-foreground hover:bg-card/20'
                  )}
                >
                  {t('pagination.next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-card/10 backdrop-blur-lg rounded-2xl border border-border/20 p-8">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('faq.needHelp')}</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t('faq.needHelpDescription')}
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
    </div>
  );
}
