# 🔄 Guide de Migration - Syntaxe des Hooks

## ⚠️ Erreurs Courantes Après Migration

### 1. "Cannot read properties of undefined (reading 'totalItems')"

**Cause :** Utilisation de l'ancienne syntaxe de destructuring avec le nouveau hook.

**❌ Ancienne syntaxe (React Context) :**
```tsx
const { cart } = useCart()
// cart.totalItems, cart.items, etc.
```

**✅ Nouvelle syntaxe (Zustand) :**
```tsx
const cart = useCart()
// cart.totalItems, cart.items, etc.
```

### 2. Différences de Structure

**Ancien système (React Context) :**
```tsx
const { cart, addToCart, removeFromCart } = useCart()
// cart.items, cart.totalItems, cart.totalPrice
```

**Nouveau système (Zustand) :**
```tsx
const cart = useCart()
const { addToCart, removeFromCart } = useCartActions()
// cart.items, cart.totalItems, cart.totalPrice
```

## 🔧 Corrections Appliquées

### ✅ Fichiers Corrigés

1. **`src/app/cart/page.tsx`**
   ```tsx
   // Avant
   const { cart } = useCart()
   
   // Après
   const cart = useCart()
   ```

2. **`src/components/CartSummary.tsx`**
   ```tsx
   // Avant
   const { cart } = useCart()
   
   // Après
   const cart = useCart()
   ```

## 📋 Checklist de Migration

### ✅ Composants Migrés
- [x] `src/components/Navigation.tsx`
- [x] `src/components/AddToCartButton.tsx`
- [x] `src/components/CartItem.tsx`
- [x] `src/components/CartSummary.tsx`
- [x] `src/app/cart/page.tsx`

### 🔍 Vérifications à Faire

1. **Syntaxe des hooks :**
   ```tsx
   // ✅ Correct
   const cart = useCart()
   const { addToCart } = useCartActions()
   
   // ❌ Incorrect
   const { cart } = useCart()
   ```

2. **Accès aux propriétés :**
   ```tsx
   // ✅ Correct
   cart.totalItems
   cart.items
   cart.totalPrice
   
   // ❌ Incorrect
   cart.cart.totalItems // Double accès
   ```

3. **Actions du panier :**
   ```tsx
   // ✅ Correct
   const { addToCart, removeFromCart } = useCartActions()
   
   // ❌ Incorrect
   const { addToCart } = useCart() // Actions dans le hook principal
   ```

## 🎯 Bonnes Pratiques

### 1. Utilisation des Hooks Spécialisés
```tsx
// Pour des valeurs spécifiques
const totalItems = useCartCount()
const totalPrice = useCartTotal()
const items = useCartItems()

// Pour des actions spécifiques
const addToCart = useAddToCart()
const removeFromCart = useRemoveFromCart()
```

### 2. Utilisation du Hook Principal
```tsx
// Pour accéder à tout le state
const cart = useCart()
// cart.items, cart.totalItems, cart.totalPrice, cart.isOpen
```

### 3. Utilisation des Actions Groupées
```tsx
// Pour plusieurs actions
const { addToCart, removeFromCart, clearCart } = useCartActions()
```

## 🚨 Erreurs à Éviter

1. **Destructuring incorrect :**
   ```tsx
   // ❌ Ne pas faire
   const { cart } = useCart()
   ```

2. **Accès en double :**
   ```tsx
   // ❌ Ne pas faire
   cart.cart.totalItems
   ```

3. **Mélange d'ancienne et nouvelle syntaxe :**
   ```tsx
   // ❌ Ne pas faire
   const { cart } = useCart() // Ancienne
   const addToCart = useAddToCart() // Nouvelle
   ```

## 🧪 Tests de Validation

### 1. Test de la Page Panier
```tsx
// Vérifier que ces propriétés existent
console.log('Cart:', cart)
console.log('Total items:', cart.totalItems)
console.log('Items:', cart.items)
console.log('Total price:', cart.totalPrice)
```

### 2. Test des Actions
```tsx
// Vérifier que les actions fonctionnent
const { addToCart, removeFromCart } = useCartActions()
console.log('Add to cart:', typeof addToCart)
console.log('Remove from cart:', typeof removeFromCart)
```

## 🎉 Résultat Final

Après ces corrections, votre application devrait fonctionner correctement avec :
- ✅ Syntaxe cohérente dans tous les composants
- ✅ Accès correct aux propriétés du panier
- ✅ Actions fonctionnelles
- ✅ Pas d'erreurs de propriétés undefined

---

**💡 Conseil :** Utilisez les DevTools Zustand pour vérifier que le state est correctement accessible !
