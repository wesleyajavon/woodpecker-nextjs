'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { TextRewind } from '@/components/ui/text-rewind';
import { Shield, FileText, Scale, AlertTriangle, Users, Clock, Mail, ChevronRight, BookOpen, X } from 'lucide-react';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function TermsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState('2 janvier 2025');
  const [activeSection, setActiveSection] = useState('');
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [language]);

  const sectionCategories = [
    {
      id: 'general',
      title: 'General Information',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'indigo',
      sections: [
        {
          id: 'acceptance',
          title: 'Acceptation des Conditions',
          icon: <Shield className="w-5 h-5" />,
          content: `En accédant et en utilisant le site web l.outsider (le "Site"), vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.`
        },
        {
          id: 'definitions',
          title: 'Définitions',
          icon: <FileText className="w-5 h-5" />,
          content: `
            • "Site" : le site web l.outsider et tous les services associés
            • "Contenu" : tous les beats, compositions musicales, fichiers audio et matériaux disponibles
            • "Utilisateur" : toute personne accédant ou utilisant le Site
            • "Licence" : les droits d'utilisation accordés lors de l'achat d'un beat
            • "Producteur" : l.outsider, propriétaire et opérateur du Site
          `
        },
        {
          id: 'age-requirements',
          title: 'Exigences d\'Âge',
          icon: <Users className="w-5 h-5" />,
          content: `
            Ce service est disponible pour les personnes âgées de 13 ans ou plus. Si vous avez entre 13 et 18 ans, vous devez examiner ces conditions avec un parent ou tuteur pour vous assurer que vous et votre parent/tuteur comprenez ces conditions.

            Les utilisateurs de moins de 13 ans ne sont pas autorisés à utiliser le Site.
          `
        }
      ]
    },
    {
      id: 'content',
      title: 'Content & Licenses',
      icon: <FileText className="w-5 h-5" />,
      color: 'purple',
      sections: [
        {
          id: 'use-materials',
          title: 'Utilisation du Contenu',
          icon: <Scale className="w-5 h-5" />,
          content: `
            Le contenu disponible sur le Site est protégé par les lois sur le droit d'auteur et les lois internationales. Vous ne pouvez utiliser le contenu que conformément aux licences spécifiques achetées.

            Restrictions générales :
            • Vous ne pouvez pas redistribuer les beats dans leur forme originale
            • Vous ne pouvez pas prétendre être l'auteur des compositions originales
            • Vous ne pouvez pas revendre ou sous-licencier les beats à des tiers
            • Le crédit producteur "Prod. l.outsider" est obligatoire sur toutes les utilisations
            • Toute utilisation commerciale nécessite l'achat d'une licence appropriée
          `
        },
        {
          id: 'licenses',
          title: 'Types de Licences',
          icon: <FileText className="w-5 h-5" />,
          content: `
            WAV Lease (Licence Non-Exclusive) :
            • Distribution jusqu'à 5 000 copies
            • 100 000 streams audio monétisés
            • 1 clip vidéo monétisé
            • Performances live non-profit illimitées
            • Durée : 10 ans

            Trackout Lease :
            • Distribution jusqu'à 10 000 copies
            • 250 000 streams audio monétisés
            • 3 clips vidéo monétisés
            • Fichiers stems inclus
            • Performances live non-profit illimitées

            Unlimited Lease :
            • Distribution illimitée
            • Streams illimités
            • Clips vidéo illimités
            • Fichiers stems inclus
            • Performances live non-profit illimitées

            Toutes les licences sont NON-EXCLUSIVES sauf accord contraire écrit.
          `
        },
        {
          id: 'copyright',
          title: 'Politique de Droit d\'Auteur',
          icon: <Shield className="w-5 h-5" />,
          content: `
            l.outsider respecte les droits de propriété intellectuelle. Si vous pensez que votre travail a été copié de manière à constituer une violation du droit d'auteur, veuillez nous contacter à contact@loutsider.com avec :

            • Une description du travail protégé par le droit d'auteur
            • Une description du matériel prétendument contrefait
            • Vos coordonnées complètes
            • Une déclaration de bonne foi
            • Une déclaration sous peine de parjure que les informations sont exactes

            Nous examinerons toutes les réclamations et prendrons les mesures appropriées.
          `
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Policies',
      icon: <Scale className="w-5 h-5" />,
      color: 'pink',
      sections: [
        {
          id: 'user-conduct',
          title: 'Conduite de l\'Utilisateur',
          icon: <Users className="w-5 h-5" />,
          content: `
            Vous vous engagez à utiliser le Site uniquement à des fins légales. Il est interdit de :

            • Violer les droits d'autrui ou les lois applicables
            • Publier du contenu menaçant, abusif, diffamatoire ou obscène
            • Tenter de contourner les mesures de sécurité du Site
            • Utiliser des robots, scripts ou autres moyens automatisés
            • Partager vos identifiants de connexion avec des tiers
            • Engager des activités frauduleuses ou trompeuses

            Nous nous réservons le droit de suspendre ou fermer tout compte violant ces règles.
          `
        },
        {
          id: 'refund-policy',
          title: 'Politique de Remboursement',
          icon: <AlertTriangle className="w-5 h-5" />,
          content: `
            Aucun remboursement n'est accordé sur les achats de beats et licences, sauf en cas de :
            • Problème technique empêchant le téléchargement
            • Fichier corrompu ou défectueux
            • Erreur de notre part dans la transaction

            Pour toute réclamation, contactez-nous dans les 48 heures suivant l'achat à contact@loutsider.com. Nous nous efforçons de résoudre tous les problèmes à l'amiable.

            Les services premium peuvent être annulés à tout moment, mais aucun remboursement ne sera accordé pour la période déjà payée.
          `
        },
        {
          id: 'warranty-disclaimer',
          title: 'Exclusion de Garantie',
          icon: <AlertTriangle className="w-5 h-5" />,
          content: `
            VOUS ACCEPTEZ EXPRESSÉMENT QUE L'UTILISATION DU SITE SE FAIT À VOS PROPRES RISQUES. LE SITE ET LES SERVICES SONT FOURNIS "EN L'ÉTAT" ET "SELON DISPONIBILITÉ".

            NOUS NE GARANTISSONS PAS :
            • Que le service sera ininterrompu ou sans erreur
            • L'exactitude, la fiabilité ou l'exhaustivité du contenu
            • Que les défauts seront corrigés
            • Que le site est exempt de virus ou autres composants nuisibles

            CERTAINES JURIDICTIONS N'AUTORISENT PAS L'EXCLUSION DE CERTAINES GARANTIES, DONC CERTAINES LIMITATIONS PEUVENT NE PAS S'APPLIQUER À VOUS.
          `
        },
        {
          id: 'limitation-liability',
          title: 'Limitation de Responsabilité',
          icon: <Scale className="w-5 h-5" />,
          content: `
            EN AUCUN CAS l.outsider NE SERA RESPONSABLE DE DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX OU CONSÉCUTIFS DÉCOULANT DE :

            • L'utilisation ou l'impossibilité d'utiliser le Site
            • Les dysfonctionnements techniques ou pannes de réseau
            • Les erreurs, omissions ou inexactitudes dans le contenu
            • Les violations de sécurité ou l'accès non autorisé
            • Toute perte de revenus ou de profits

            Notre responsabilité totale ne dépassera pas le montant payé par vous au cours des 12 derniers mois.
          `
        }
      ]
    },
    {
      id: 'updates',
      title: 'Updates & Contact',
      icon: <Clock className="w-5 h-5" />,
      color: 'orange',
      sections: [
        {
          id: 'modifications',
          title: 'Modification des Conditions',
          icon: <Clock className="w-5 h-5" />,
          content: `
            Nous pouvons modifier ces Conditions d'Utilisation à tout moment à notre seule discrétion. Les modifications seront effectives dès leur publication sur le Site.

            Il est de votre responsabilité de consulter régulièrement ces conditions pour être informé des modifications. Votre utilisation continue du Site après la publication des modifications constitue votre acceptation de ces modifications.
          `
        },
        {
          id: 'governing-law',
          title: 'Droit Applicable',
          icon: <Scale className="w-5 h-5" />,
          content: `
            Ces Conditions d'Utilisation sont régies par les lois françaises. Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux français.

            Si une disposition de ces conditions est jugée invalide ou inapplicable, les autres dispositions resteront en vigueur.
          `
        },
        {
          id: 'contact',
          title: 'Contact',
          icon: <Mail className="w-5 h-5" />,
          content: `
            Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter :

            Email : contact@loutsider.com
            Site web : loutsider.com

            Nous nous efforçons de répondre à toutes les demandes dans les 48 heures.
          `
        }
      ]
    }
  ];

  // Flatten all sections for easy access
  const allSections = sectionCategories.flatMap(category => 
    category.sections.map(section => ({ ...section, categoryId: category.id, categoryColor: category.color }))
  );

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Trouver la section dans les catégories
    const section = allSections.find(s => s.id === sectionId);
    if (section) {
      setSelectedContent(section);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      indigo: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-400',
      purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400',
      pink: 'from-pink-500/10 to-orange-500/10 border-pink-500/20 text-pink-400',
      orange: 'from-orange-500/10 to-yellow-500/10 border-orange-500/20 text-orange-400'
    };
    return colors[color as keyof typeof colors] || colors.indigo;
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

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="mb-16 mt-6">
                <TextRewind text={`${t('terms.title')} ${t('terms.titleHighlight')}`} />
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                {t('terms.subtitle')}
              </p>
              
              {/* Last Updated Card */}
              <div className="bg-card/20 backdrop-blur-xl rounded-2xl border border-border/30 p-6 shadow-xl max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <strong>{t('terms.lastUpdated')}:</strong> {lastUpdated}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Table of Contents */}
            <motion.div
              id="table-of-contents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <div className="bg-card/20 backdrop-blur-xl rounded-2xl border border-border/30 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {t('terms.tableOfContents')}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                    className="p-2 rounded-lg bg-card/10 hover:bg-card/20 transition-colors"
                  >
                    <ChevronRight className={cn("w-4 h-4 transition-transform", showTableOfContents && "rotate-90")} />
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {showTableOfContents && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sectionCategories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <h3 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", `bg-${category.color}-400`)} />
                              {category.title}
                            </h3>
                            <div className="space-y-1">
                              {category.sections.map((section) => (
                                <button
                                  key={section.id}
                                  onClick={() => scrollToSection(section.id)}
                                  className={cn(
                                    "w-full text-left text-sm p-2 rounded-lg transition-all duration-200",
                                    activeSection === section.id
                                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30"
                                      : "text-muted-foreground hover:text-foreground hover:bg-card/10"
                                  )}
                                >
                                  {section.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Content Display */}
                <AnimatePresence>
                  {selectedContent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="mt-8 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-card/30 to-card/10 backdrop-blur-xl rounded-2xl border border-border/40 p-8 shadow-xl">
                        <div className="flex items-start gap-6">
                          <div className={cn("p-3 rounded-xl flex-shrink-0", `bg-gradient-to-r ${getColorClasses(selectedContent.categoryColor).split(' ')[0]} ${getColorClasses(selectedContent.categoryColor).split(' ')[1]} border ${getColorClasses(selectedContent.categoryColor).split(' ')[2]}`)}>
                            {selectedContent.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-foreground">
                                  {selectedContent.title}
                                </h3>
                                <div className={cn("px-3 py-1 rounded-full text-xs font-medium", `bg-gradient-to-r ${getColorClasses(selectedContent.categoryColor).split(' ')[0]} ${getColorClasses(selectedContent.categoryColor).split(' ')[1]} border ${getColorClasses(selectedContent.categoryColor).split(' ')[2]}`)}>
                                  {sectionCategories.find(cat => cat.id === selectedContent.categoryId)?.title}
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedContent(null)}
                                className="p-2 rounded-lg bg-card/10 hover:bg-card/20 transition-colors text-muted-foreground hover:text-foreground"
                                title="Fermer le contenu"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <div className="prose prose-invert max-w-none">
                              {selectedContent.content.split('\n').map((paragraph: string, pIndex: number) => {
                                if (paragraph.trim() === '') return null;
                                
                                if (paragraph.trim().startsWith('•')) {
                                  return (
                                    <div key={pIndex} className="flex items-start gap-3 mb-3">
                                      <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", `bg-${selectedContent.categoryColor}-400`)} />
                                      <p className="text-muted-foreground leading-relaxed">
                                        {paragraph.trim().substring(1).trim()}
                                      </p>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <p key={pIndex} className="text-muted-foreground leading-relaxed mb-4">
                                    {paragraph.trim()}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>


            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/30 p-8 shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {t('terms.importantNotice')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('terms.importantNoticeDescription')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.questionsContact')}
                    <a href="mailto:contact@loutsider.com" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 font-medium">
                      contact@loutsider.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
