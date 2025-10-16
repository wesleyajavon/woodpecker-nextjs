# 🚀 Script de Migration - Ancien vers Nouveau Système de Panier

## Étapes de Migration

### 1. Remplacer les imports dans les composants

**Rechercher et remplacer :**
```bash
# Ancien import
import { useCart } from '@/hooks/useCart'

# Nouveau import  
import { useCart } from '@/hooks/useCartNew'
```

### 2. Composants à migrer (par ordre de priorité)

#### Priorité 1 - Composants critiques
- [ ] `src/components/Navigation.tsx` - Navigation principale
- [ ] `src/components/AddToCartButton.tsx` - Bouton d'ajout au panier
- [ ] `src/components/CartItem.tsx` - Item du panier
- [ ] `src/components/CartSummary.tsx` - Résumé du panier

#### Priorité 2 - Pages
- [ ] `src/app/cart/page.tsx` - Page du panier
- [ ] `src/app/success/page.tsx` - Page de succès

#### Priorité 3 - Autres composants
- [ ] `src/components/BeatCard.tsx` - Carte de beat
- [ ] `src/components/LicenseSelector.tsx` - Sélecteur de licence
- [ ] `src/components/CheckoutButton.tsx` - Bouton de checkout

### 3. Supprimer l'ancien système

Une fois la migration terminée :
- [ ] Supprimer `src/contexts/CartContext.tsx`
- [ ] Supprimer `src/hooks/useCart.ts` (ancien)
- [ ] Supprimer `src/hooks/useCartSync.ts` (temporaire)
- [ ] Renommer `src/hooks/useCartNew.ts` → `src/hooks/useCart.ts`

### 4. Mettre à jour le layout

Supprimer le CartProvider du layout :
```tsx
// Avant
<CartProvider>
  <div className="flex flex-col min-h-screen">
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
</CartProvider>

// Après
<div className="flex flex-col min-h-screen">
  <Navigation />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

## 🧪 Tests de Validation

### Test 1 - Navigation
- [ ] Le compteur de panier s'affiche correctement
- [ ] Le bouton panier fonctionne

### Test 2 - Ajout au panier
- [ ] Ajouter un beat au panier fonctionne
- [ ] Le compteur se met à jour
- [ ] La persistance localStorage fonctionne

### Test 3 - Panier complet
- [ ] Afficher les items du panier
- [ ] Modifier les quantités
- [ ] Supprimer des items
- [ ] Vider le panier

### Test 4 - Checkout
- [ ] Processus de paiement fonctionne
- [ ] Redirection après paiement
- [ ] Vidage du panier après succès

## ⚠️ Points d'Attention

1. **Persistance** : Vérifier que localStorage fonctionne avec Zustand
2. **Performance** : Mesurer les améliorations de performance
3. **Types** : Vérifier que tous les types TypeScript sont corrects
4. **Tests** : Mettre à jour les tests unitaires

## 🎯 Résultat Attendu

Après migration complète :
- ✅ Un seul système de panier (Zustand)
- ✅ Meilleure performance
- ✅ Code plus simple et maintenable
- ✅ Persistance automatique
- ✅ DevTools intégrées
