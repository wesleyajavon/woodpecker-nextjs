'use client';

import { motion } from 'framer-motion';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { Shield, FileText, Scale, AlertTriangle, Users, Clock, Mail } from 'lucide-react';

export default function TermsPage() {
  const sections = [
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
      id: 'content-responsibility',
      title: 'Responsabilité du Contenu',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `
        Le Site propose une variété de contenus musicaux. Certains contenus peuvent contenir des paroles explicites ou du matériel inapproprié pour les mineurs.

        Les utilisateurs doivent évaluer et assumer les risques associés à l'utilisation du Site. Nous recommandons aux parents de superviser les activités en ligne de leurs enfants.

        Nous nous réservons le droit d'agir sur les signalements de contenu offensant à notre seule discrétion.
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
    },
    {
      id: 'age-requirements',
      title: 'Exigences d\'Âge',
      icon: <Users className="w-5 h-5" />,
      content: `
        Ce service est disponible pour les personnes âgées de 13 ans ou plus. Si vous avez entre 13 et 18 ans, vous devez examiner ces conditions avec un parent ou tuteur pour vous assurer que vous et votre parent/tuteur comprenez ces conditions.

        Les utilisateurs de moins de 13 ans ne sont pas autorisés à utiliser le Site.
      `
    },
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
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DottedSurface />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Conditions d&apos;Utilisation
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Veuillez lire attentivement ces conditions d&apos;utilisation avant d&apos;utiliser nos services.
                En utilisant l.outsider, vous acceptez d&apos;être lié par ces conditions.
              </p>
              <div className="mt-8 p-4 bg-card/50 backdrop-blur-lg rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 p-6 md:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0 mt-1">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {section.title}
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        {section.content.split('\n').map((paragraph, pIndex) => {
                          if (paragraph.trim() === '') return null;
                          
                          if (paragraph.trim().startsWith('•')) {
                            return (
                              <div key={pIndex} className="flex items-start gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
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
                </motion.div>
              ))}
            </div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Notice Importante
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Ces conditions d&apos;utilisation constituent un accord légalement contraignant entre vous et l.outsider. 
                    En utilisant notre site web ou nos services, vous reconnaissez avoir lu, compris et accepté d&apos;être lié par ces conditions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Si vous avez des questions concernant ces conditions, n&apos;hésitez pas à nous contacter à 
                    <a href="mailto:contact@loutsider.com" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">
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
