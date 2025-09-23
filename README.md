# Woodpecker - Plateforme de Vente de Beats

Une plateforme moderne et sophistiquée pour Woodpecker, beatmaker professionnel, construite avec Next.js, TypeScript et Tailwind CSS.

## 🎵 **À propos de Woodpecker**

Woodpecker est un beatmaker talentueux qui crée des instrumentaux uniques pour rappeurs, chanteurs et producteurs. Cette plateforme lui permet de présenter et vendre ses beats de manière professionnelle.

## 🚀 **Fonctionnalités principales**

### **Pages principales**
- **Page d'accueil** - Hero section avec présentation de Woodpecker et statistiques
- **Beats** - Catalogue complet avec filtres, recherche et prévisualisation
- **Kits** - Collection de kits de production musicale
- **Contact** - Formulaire de contact et informations

### **Composants sophistiqués**
- Navigation fixe avec effet glassmorphism et animations
- Hero section avec parallaxe et éléments flottants animés
- Grille de beats avec vue grille/liste et filtres avancés
- Footer moderne avec animations et liens contextuels
- Design responsive et accessible

### **Fonctionnalités pour beatmakers**
- **Prévisualisation des beats** - Boutons play/pause interactifs
- **Informations techniques** - BPM, tonalité, durée
- **Filtres par genre** - Trap, Hip-Hop, Drill, Jazz, etc.
- **Recherche avancée** - Par titre, genre, BPM
- **Vue adaptative** - Grille ou liste selon préférence
- **Tags descriptifs** - Caractéristiques de chaque beat

### **API et base de données**
- **API REST complète** - Gestion des beats et commandes
- **Base de données PostgreSQL** - Stockage sécurisé et performant
- **Prisma ORM** - Requêtes optimisées et type-safe
- **Système de commandes** - Gestion complète des achats
- **Statistiques et analytics** - Suivi des performances

### **Système de panier et commandes** 🛒
- **Panier multi-articles** - Ajout, suppression, modification des quantités
- **Persistence locale** - Sauvegarde automatique dans localStorage
- **Checkout Stripe** - Paiement sécurisé pour un ou plusieurs beats
- **Commandes multi-articles** - Gestion des commandes complexes
- **Téléchargements sécurisés** - Liens individuels pour chaque beat acheté
- **Interface moderne** - Design responsive avec animations fluides

### **Technologies**
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling moderne
- **Framer Motion** pour les animations fluides
- **Lucide React** pour les icônes
- **PostgreSQL** pour la base de données
- **Prisma** comme ORM moderne
- **Cloudinary** pour le stockage des fichiers audio et images

## 🛠️ **Installation**

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd woodpecker-nextjs
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de la base de données et du stockage**
   ```bash
   # Copier le fichier d'environnement
   cp .env.example .env
   
   # Configurer votre DATABASE_URL dans .env
   # Voir DATABASE.md pour plus de détails
   
   # Configurer Cloudinary (voir section Stockage ci-dessous)
   ```

4. **Initialiser la base de données**
   ```bash
   # Générer le client Prisma
   npm run db:generate
   
   # Pousser le schéma vers la base
   npm run db:push
   
   # Peupler avec des données de test
   npm run db:seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📁 **Structure du projet**

```
src/
├── app/                    # App Router Next.js
│   ├── page.tsx          # Page d'accueil
│   ├── beats/            # Page des beats (principale)
│   ├── kits/             # Page des kits
│   ├── contact/          # Page de contact
│   └── api/              # API Routes
│       ├── beats/        # API des beats
│       ├── orders/       # API des commandes
│       └── test/         # Route de test
├── components/            # Composants réutilisables
│   ├── Navigation.tsx    # Navigation fixe avec glassmorphism
│   ├── Hero.tsx          # Section hero avec parallaxe
│   ├── FeaturedProducts.tsx # Beats en vedette
│   └── Footer.tsx        # Footer avec animations
├── services/              # Services de base de données
│   ├── beatService.ts    # Gestion des beats
│   └── orderService.ts   # Gestion des commandes
├── types/                 # Types TypeScript
│   ├── beat.ts           # Types des beats
│   └── order.ts          # Types des commandes
├── config/                # Configuration
│   ├── database.ts       # Config base de données
│   ├── env.ts            # Variables d'environnement
│   └── constants.ts      # Constantes de l'app
└── lib/                   # Utilitaires
    └── prisma.ts         # Client Prisma
```

## 🎨 **Design System**

### **Identité visuelle**
- **Logo** : Icône musicale avec animation de rotation continue
- **Palette** : Purple (600-700) et Pink (600-700) avec accents
- **Typographie** : Fonts bold pour les titres, medium pour le corps

## 🔌 **API Routes**

### **Beats API**
- `GET /api/beats` - Liste des beats avec filtres et pagination
- `GET /api/beats/[id]` - Beat spécifique par ID
- `GET /api/beats/featured` - Beats en vedette
- `GET /api/beats/genre/[genre]` - Beats par genre
- `GET /api/beats/stats` - Statistiques des beats
- `GET /api/beats/[id]/purchase-check` - Vérification d'achat

### **Orders API**
- `GET /api/orders` - Liste des commandes avec filtres
- `POST /api/orders` - Créer une nouvelle commande
- `GET /api/orders/[id]` - Commande spécifique
- `PUT /api/orders/[id]` - Mettre à jour une commande
- `PATCH /api/orders/[id]/actions` - Actions spéciales (annuler, rembourser)
- `GET /api/orders/stats` - Statistiques des commandes
- `GET /api/orders/customer/[email]` - Commandes par client

### **Test API**
- `GET /api/test` - Vérification du bon fonctionnement de l'API

**Documentation complète** : Voir `API.md` pour plus de détails et d'exemples.

## 📚 **Documentation du système de panier**

### **Documentation technique**
- `CART_SYSTEM_DOCUMENTATION.md` - Documentation complète du système de panier
- `CART_QUICK_REFERENCE.md` - Guide de référence rapide pour les développeurs
- `CART_ARCHITECTURE.md` - Architecture technique détaillée

### **Pages de test**
- `/cart-test` - Interface de test complète pour le système de panier
- `/cart` - Page de panier principale
- `/success` - Page de confirmation de commande avec téléchargements

## ☁️ **Stockage des fichiers**

### **Configuration Cloudinary**

La plateforme utilise **Cloudinary** pour le stockage sécurisé des fichiers audio et images.

#### **Variables d'environnement requises**
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### **Structure des dossiers**
```
woodpecker-beats/
├── beats/
│   ├── previews/     # Previews audio (30s, MP3)
│   ├── masters/      # Fichiers masters (WAV)
│   └── waveforms/    # Waveforms générés
└── temp/             # Fichiers temporaires
```

#### **Formats supportés**
- **Audio** : MP3, WAV, AIFF, FLAC

#### **Limites de fichiers**
- **Audio** : 100MB max

#### **Transformations automatiques**
- **Previews** : 30 secondes, qualité optimisée
- **Waveforms** : Génération automatique des visualisations audio
- **Animations** : Transitions fluides, effets de survol, parallaxe

### **Composants**
- **Cartes** : Rounded-3xl, shadows dynamiques, effets 3D
- **Boutons** : Gradients, hover effects, animations de scale
- **Navigation** : Glassmorphism, backdrop-blur, transitions
- **Formulaires** : Focus rings, validations, états interactifs

## 🎵 **Fonctionnalités des beats**

### **Informations affichées**
- **Titre** du beat
- **Genre** musical
- **BPM** (beats par minute)
- **Tonalité** (clé musicale)
- **Durée** en minutes:secondes
- **Prix** en euros
- **Note** et nombre d'avis
- **Tags** descriptifs

### **Filtres disponibles**
- **Par genre** : Trap, Hip-Hop, Drill, Jazz, Electronic, Boom Bap
- **Par BPM** : Ranges prédéfinis
- **Par tonalité** : Toutes les clés musicales
- **Recherche textuelle** : Par titre ou description

## 📱 **Responsive Design**

- **Mobile First** : Optimisé pour tous les écrans
- **Breakpoints** : sm (640px), md (768px), lg (1024px)
- **Navigation** : Menu hamburger sur mobile avec animations
- **Grilles** : Adaptatives selon la taille d'écran
- **Touch friendly** : Interactions optimisées pour mobile

## 🚀 **Déploiement**

### **Vercel (Recommandé)**
1. Connecter le repository GitHub
2. Vercel détecte automatiquement Next.js
3. Déploiement automatique à chaque push

### **Autres plateformes**
- **Netlify** : Compatible avec Next.js
- **Railway** : Déploiement simple
- **Docker** : Containerisation possible

## 🔮 **Prochaines étapes**

### **Fonctionnalités implémentées** ✅
- [x] **Système de panier d'achat** - Multi-item cart avec persistence
- [x] **Système de paiement** - Intégration Stripe complète
- [x] **Gestion des commandes** - Single et multi-item orders
- [x] **Système de téléchargement** - Liens sécurisés avec expiration
- [x] **Interface utilisateur moderne** - Design responsive et animations

### **Fonctionnalités à ajouter**
- [ ] **Lecteur audio intégré** pour prévisualisation
- [ ] **Système d'authentification** utilisateur
- [ ] **Gestion des licences** (exclusive, non-exclusive)
- [ ] **Upload de beats** pour Woodpecker
- [ ] **Système de notation et avis** clients
- [ ] **Blog/News** pour partager des actualités
- [ ] **Intégration sociale** (Instagram, YouTube)

### **Améliorations techniques**
- [ ] **Tests unitaires** et E2E
- [ ] **Optimisation des performances** (lazy loading)
- [ ] **SEO avancé** pour les beats
- [ ] **PWA** pour l'expérience mobile
- [ ] **Internationalisation** (EN/FR)
- [ ] **Analytics** et suivi des ventes

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 **Contribution**

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 **Support**

Pour toute question ou support :
- **Email** : contact@woodpecker.com
- **Issues** : Utiliser les GitHub Issues
- **Documentation** : Voir la documentation Next.js

---

**Woodpecker** - Beatmaker professionnel 🎵

*Créez votre son unique avec des beats originaux et authentiques*
