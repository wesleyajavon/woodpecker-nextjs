# Woodpecker - MVP Next.js

Un MVP moderne inspiré de [Traplysse](https://traplysse.com/) construit avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

### Pages principales
- **Page d'accueil** - Hero section avec statistiques et CTA
- **Produits** - Catalogue avec filtres et recherche
- **Kits** - Collection de kits de production musicale
- **Contact** - Formulaire de contact et informations

### Composants
- Navigation responsive avec menu mobile
- Hero section animée avec Framer Motion
- Grille de produits avec filtres
- Footer complet avec liens et réseaux sociaux
- Design moderne et responsive

### Technologies
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd woodpecker-nextjs
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js
│   ├── page.tsx          # Page d'accueil
│   ├── prods/            # Page des produits
│   ├── kits/             # Page des kits
│   └── contact/          # Page de contact
├── components/            # Composants réutilisables
│   ├── Navigation.tsx    # Navigation principale
│   ├── Hero.tsx          # Section hero
│   ├── FeaturedProducts.tsx # Produits en vedette
│   └── Footer.tsx        # Pied de page
└── globals.css           # Styles globaux
```

## 🎨 Design System

### Couleurs
- **Primaire** : Purple (600-700)
- **Secondaire** : Pink (600-700)
- **Neutre** : Gray (50-900)
- **Accent** : Yellow (400) pour les étoiles

### Typographie
- **Titres** : Font-bold, tailles 2xl-7xl
- **Corps** : Font-medium, tailles sm-xl
- **Navigation** : Font-semibold

### Composants
- **Cartes** : Rounded-2xl, shadow-lg, hover effects
- **Boutons** : Rounded-full, gradients, hover animations
- **Formulaires** : Rounded-lg, focus rings

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
```

## 📱 Responsive Design

- **Mobile First** : Design optimisé pour mobile
- **Breakpoints** : sm (640px), md (768px), lg (1024px)
- **Navigation** : Menu hamburger sur mobile
- **Grilles** : Adaptatives selon la taille d'écran

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Vercel détecte automatiquement Next.js
3. Déploiement automatique à chaque push

### Autres plateformes
- **Netlify** : Compatible avec Next.js
- **Railway** : Déploiement simple
- **Docker** : Containerisation possible

## 🔮 Prochaines étapes

### Fonctionnalités à ajouter
- [ ] Système d'authentification
- [ ] Panier d'achat
- [ ] Système de paiement
- [ ] Gestion des utilisateurs
- [ ] Dashboard admin
- [ ] API backend
- [ ] Base de données
- [ ] Système de recherche avancé
- [ ] Filtres dynamiques
- [ ] Système de notation et avis

### Améliorations techniques
- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] Optimisation des performances
- [ ] SEO avancé
- [ ] PWA
- [ ] Internationalisation

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support :
- **Email** : contact@woodpecker.com
- **Issues** : Utiliser les GitHub Issues
- **Documentation** : Voir la documentation Next.js

---

**Woodpecker** - Créez votre son unique 🎵
