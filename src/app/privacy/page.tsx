'use client';

import { motion } from 'framer-motion';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Database, 
  Globe, 
  Mail, 
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Trash2,
  Download,
  Share2
} from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Shield className="w-5 h-5" />,
      content: `
        l.outsider ("nous", "notre", "nos") s'engage à protéger votre vie privée et vos données personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme de beats.

        En utilisant notre site web, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas ces pratiques, veuillez ne pas utiliser nos services.

        Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) et aux lois françaises sur la protection des données.
      `
    },
    {
      id: 'data-controller',
      title: 'Responsable du Traitement',
      icon: <UserCheck className="w-5 h-5" />,
      content: `
        l.outsider est le responsable du traitement de vos données personnelles.

        Coordonnées :
        • Email : contact@loutsider.com
        • Site web : loutsider.com
        • Adresse : France

        Pour toute question concernant cette politique ou vos données personnelles, vous pouvez nous contacter à l'adresse email ci-dessus.
      `
    },
    {
      id: 'data-collection',
      title: 'Informations que Nous Collectons',
      icon: <Database className="w-5 h-5" />,
      content: `
        Données Personnelles Directes :
        • Nom et prénom lors de l'inscription
        • Adresse email pour la communication
        • Informations de paiement (traitées par Stripe)
        • Adresse de facturation si nécessaire
        • Préférences musicales et historique d'achats

        Données Techniques Automatiques :
        • Adresse IP et localisation approximative
        • Type de navigateur et système d'exploitation
        • Pages visitées et temps passé sur le site
        • Référents et liens cliqués
        • Données d'utilisation et de performance

        Cookies et Technologies Similaires :
        • Cookies de session pour le fonctionnement du site
        • Cookies de préférences pour personnaliser l'expérience
        • Cookies analytiques pour améliorer nos services
        • Cookies publicitaires (avec votre consentement)
      `
    },
    {
      id: 'legal-basis',
      title: 'Base Légale du Traitement',
      icon: <FileText className="w-5 h-5" />,
      content: `
        Nous traitons vos données personnelles sur les bases légales suivantes :

        Exécution du Contrat :
        • Traitement des commandes et livraison des beats
        • Gestion de votre compte utilisateur
        • Support client et service après-vente

        Intérêts Légitimes :
        • Amélioration de nos services et de l'expérience utilisateur
        • Prévention de la fraude et sécurité du site
        • Analyses statistiques et marketing direct

        Consentement :
        • Newsletters et communications marketing
        • Cookies non essentiels
        • Partage de données avec des partenaires

        Obligations Légales :
        • Conservation des factures et données comptables
        • Respect des obligations fiscales
        • Coopération avec les autorités compétentes
      `
    },
    {
      id: 'data-usage',
      title: 'Utilisation de Vos Données',
      icon: <Settings className="w-5 h-5" />,
      content: `
        Nous utilisons vos données personnelles pour :

        Services Principaux :
        • Créer et gérer votre compte utilisateur
        • Traiter vos commandes et paiements
        • Fournir l'accès aux beats achetés
        • Assurer le support client et technique

        Amélioration des Services :
        • Personnaliser votre expérience sur le site
        • Recommander des beats selon vos goûts
        • Analyser l'utilisation pour améliorer la plateforme
        • Développer de nouvelles fonctionnalités

        Communication :
        • Envoyer des confirmations de commande
        • Informer des mises à jour importantes
        • Proposer des offres personnalisées (avec consentement)
        • Répondre à vos questions et demandes

        Sécurité et Conformité :
        • Prévenir la fraude et les abus
        • Respecter nos obligations légales
        • Protéger nos droits et ceux des utilisateurs
        • Maintenir la sécurité de la plateforme
      `
    },
    {
      id: 'data-sharing',
      title: 'Partage de Vos Données',
      icon: <Share2 className="w-5 h-5" />,
      content: `
        Nous ne vendons jamais vos données personnelles. Nous pouvons les partager dans les cas suivants :

        Prestataires de Services :
        • Stripe pour le traitement des paiements
        • Services d'hébergement et de stockage cloud
        • Outils d'analyse web (Google Analytics)
        • Services de support client et de communication

        Obligations Légales :
        • Autorités judiciaires ou administratives
        • Organismes de régulation compétents
        • Forces de l'ordre en cas d'enquête
        • Respect des décisions de justice

        Transferts d'Entreprise :
        • En cas de fusion, acquisition ou cession d'actifs
        • Avec notification préalable et protection des droits
        • Sous réserve des mêmes garanties de confidentialité

        Tous nos partenaires sont tenus par des accords de confidentialité stricts et ne peuvent utiliser vos données que pour les fins spécifiées.
      `
    },
    {
      id: 'data-retention',
      title: 'Conservation des Données',
      icon: <Clock className="w-5 h-5" />,
      content: `
        Nous conservons vos données personnelles uniquement le temps nécessaire :

        Données de Compte :
        • Tant que votre compte est actif
        • 3 ans après la dernière connexion
        • Suppression automatique après cette période

        Données de Transaction :
        • 10 ans pour les obligations comptables et fiscales
        • Conformément à la législation française
        • Archivage sécurisé avec accès restreint

        Données Marketing :
        • Jusqu'à votre désinscription
        • Maximum 3 ans sans interaction
        • Suppression immédiate sur demande

        Données Techniques :
        • 13 mois pour les cookies analytiques
        • 6 mois pour les logs de sécurité
        • Anonymisation après ces périodes

        Vous pouvez demander la suppression anticipée de vos données à tout moment, sous réserve de nos obligations légales.
      `
    },
    {
      id: 'user-rights',
      title: 'Vos Droits',
      icon: <CheckCircle className="w-5 h-5" />,
      content: `
        Conformément au RGPD, vous disposez des droits suivants :

        Droit d'Accès :
        • Connaître les données que nous détenons sur vous
        • Obtenir une copie de vos données personnelles
        • Comprendre comment elles sont utilisées

        Droit de Rectification :
        • Corriger les données inexactes ou incomplètes
        • Mettre à jour vos informations personnelles
        • Modifier vos préférences de communication

        Droit à l'Effacement :
        • Demander la suppression de vos données
        • "Droit à l'oubli" dans certaines conditions
        • Suppression immédiate sauf obligations légales

        Droit à la Portabilité :
        • Récupérer vos données dans un format structuré
        • Transférer vos données à un autre service
        • Format lisible par machine (JSON, CSV)

        Droit d'Opposition :
        • Vous opposer au traitement pour marketing direct
        • Refuser le profilage automatisé
        • Retirer votre consentement à tout moment

        Pour exercer ces droits, contactez-nous à contact@loutsider.com avec une pièce d'identité.
      `
    },
    {
      id: 'cookies',
      title: 'Cookies et Technologies Similaires',
      icon: <Globe className="w-5 h-5" />,
      content: `
        Notre site utilise différents types de cookies :

        Cookies Essentiels (Obligatoires) :
        • Fonctionnement du panier d'achat
        • Authentification et sécurité
        • Préférences de langue et région
        • Protection contre les attaques CSRF

        Cookies de Performance :
        • Google Analytics pour les statistiques
        • Mesure de l'audience et du trafic
        • Optimisation des performances du site
        • Tests A/B pour améliorer l'expérience

        Cookies de Personnalisation :
        • Recommandations de beats personnalisées
        • Historique de navigation et préférences
        • Sauvegarde des filtres et recherches
        • Interface adaptée à vos habitudes

        Cookies Publicitaires (Avec Consentement) :
        • Publicités ciblées sur d'autres sites
        • Mesure de l'efficacité des campagnes
        • Remarketing et retargeting
        • Partenaires publicitaires tiers

        Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur ou via notre bandeau de consentement.
      `
    },
    {
      id: 'security',
      title: 'Sécurité des Données',
      icon: <Lock className="w-5 h-5" />,
      content: `
        Nous mettons en œuvre des mesures de sécurité robustes :

        Sécurité Technique :
        • Chiffrement SSL/TLS pour toutes les communications
        • Hachage sécurisé des mots de passe (bcrypt)
        • Authentification à deux facteurs disponible
        • Surveillance continue des intrusions

        Sécurité Organisationnelle :
        • Accès aux données sur principe du moindre privilège
        • Formation régulière du personnel à la sécurité
        • Audits de sécurité périodiques
        • Procédures de réponse aux incidents

        Protection des Paiements :
        • Aucune donnée bancaire stockée sur nos serveurs
        • Traitement sécurisé via Stripe (PCI DSS)
        • Tokenisation des informations sensibles
        • Détection automatique de la fraude

        Sauvegarde et Récupération :
        • Sauvegardes chiffrées quotidiennes
        • Stockage redondant dans plusieurs centres
        • Plan de continuité d'activité
        • Tests réguliers de récupération

        Malgré ces mesures, aucun système n'est 100% sécurisé. Nous nous engageons à vous informer rapidement en cas d'incident de sécurité.
      `
    },
    {
      id: 'international-transfers',
      title: 'Transferts Internationaux',
      icon: <Globe className="w-5 h-5" />,
      content: `
        Certains de nos prestataires peuvent être situés hors de l'Union Européenne :

        Garanties de Protection :
        • Clauses contractuelles types de la Commission européenne
        • Décisions d'adéquation pour certains pays
        • Certifications Privacy Shield ou équivalentes
        • Mesures de sécurité supplémentaires

        Prestataires Principaux :
        • Stripe (États-Unis) - Traitement des paiements
        • Google Analytics (États-Unis) - Analyses web
        • Services cloud (UE et États-Unis) - Hébergement
        • Support client (UE) - Communication

        Vos Droits :
        • Information sur tous les transferts
        • Opposition possible dans certains cas
        • Garanties équivalentes au niveau européen
        • Recours en cas de violation

        Nous évaluons régulièrement la nécessité et la sécurité de ces transferts pour minimiser les risques.
      `
    },
    {
      id: 'minors',
      title: 'Protection des Mineurs',
      icon: <Users className="w-5 h-5" />,
      content: `
        Notre service est destiné aux personnes âgées de 13 ans et plus :

        Utilisateurs de 13-15 ans :
        • Consentement parental requis
        • Vérification de l'autorisation parentale
        • Droits exercés par les représentants légaux
        • Protection renforcée des données

        Utilisateurs de 16-17 ans :
        • Consentement personnel valide
        • Information des parents recommandée
        • Droits exercés directement
        • Accompagnement si nécessaire

        Mesures de Protection :
        • Pas de collecte intentionnelle chez les moins de 13 ans
        • Suppression immédiate si découverte
        • Procédures de vérification d'âge
        • Sensibilisation à la protection des données

        Si vous êtes parent et découvrez que votre enfant nous a fourni des données sans autorisation, contactez-nous immédiatement.
      `
    },
    {
      id: 'updates',
      title: 'Modifications de cette Politique',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `
        Cette politique peut être mise à jour pour refléter :

        Raisons de Modification :
        • Évolution de nos services et fonctionnalités
        • Changements dans la réglementation
        • Amélioration de la protection des données
        • Retours et demandes des utilisateurs

        Processus de Notification :
        • Email à tous les utilisateurs enregistrés
        • Notification sur le site web
        • Période de transition de 30 jours minimum
        • Possibilité de refuser les nouveaux termes

        Versions Antérieures :
        • Archivage de toutes les versions précédentes
        • Accès aux anciennes politiques sur demande
        • Traçabilité des modifications importantes
        • Respect des droits acquis

        Nous vous encourageons à consulter régulièrement cette politique pour rester informé de nos pratiques de confidentialité.
      `
    },
    {
      id: 'contact',
      title: 'Nous Contacter',
      icon: <Mail className="w-5 h-5" />,
      content: `
        Pour toute question concernant cette politique ou vos données personnelles :

        Contact Principal :
        • Email : contact@loutsider.com
        • Réponse sous 72 heures maximum
        • Support en français et anglais

        Demandes Spécifiques :
        • Exercice de vos droits RGPD
        • Questions sur l'utilisation de vos données
        • Signalement d'incident de sécurité
        • Réclamations et suggestions

        Autorité de Contrôle :
        En cas de litige non résolu, vous pouvez saisir la CNIL :
        • Site web : cnil.fr
        • Téléphone : 01 53 73 22 22
        • Adresse : 3 Place de Fontenoy, 75007 Paris

        Nous nous engageons à traiter toutes vos demandes avec diligence et transparence.
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
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Politique de{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Confidentialité
                  </span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Nous nous engageons à protéger votre vie privée et vos données personnelles. 
                Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
              <div className="mt-8 p-4 bg-card/50 backdrop-blur-lg rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • <strong>Conforme RGPD</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Content */}
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
                    <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0 mt-1">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {section.title}
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        {section.content.split('\n').map((paragraph, pIndex) => {
                          if (paragraph.trim() === '') return null;
                          
                          // Handle bullet points
                          if (paragraph.trim().startsWith('•')) {
                            return (
                              <div key={pIndex} className="flex items-start gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-muted-foreground leading-relaxed">
                                  {paragraph.trim().substring(1).trim()}
                                </p>
                              </div>
                            );
                          }
                          
                          // Handle section headers (lines ending with :)
                          if (paragraph.trim().endsWith(':') && paragraph.trim().length < 50) {
                            return (
                              <h3 key={pIndex} className="text-lg font-semibold text-foreground mt-6 mb-3">
                                {paragraph.trim()}
                              </h3>
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

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Questions sur vos Données ?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Notre équipe est à votre disposition pour répondre à toutes vos questions concernant 
                    la protection de vos données personnelles et l&apos;exercice de vos droits.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="mailto:contact@loutsider.com"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Nous contacter
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-card/20 hover:bg-card/30 text-foreground px-6 py-3 rounded-xl transition-colors font-medium border border-border/50"
                    >
                      <Eye className="w-4 h-4" />
                      Exercer mes droits
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GDPR Compliance Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Conforme RGPD • Données protégées</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
