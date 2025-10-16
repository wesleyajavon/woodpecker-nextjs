# 🛠️ Guide de Débogage - Zustand et TanStack Query

## 🚨 Erreurs Courantes et Solutions

### 1. "The result of getSnapshot should be cached to avoid an infinite loop"

**Cause :** Création d'un nouvel objet à chaque render dans un sélecteur Zustand.

**❌ Code problématique :**
```tsx
export function useCartActions() {
  return useCartStore(state => ({
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    // ... autres actions
  }))
}
```

**✅ Solutions :**

**Option 1 - Sélecteurs individuels :**
```tsx
export function useCartActions() {
  const addToCart = useCartStore(state => state.addToCart)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  
  return {
    addToCart,
    removeFromCart,
  }
}
```

**Option 2 - useMemo :**
```tsx
export function useCartActions() {
  const addToCart = useCartStore(state => state.addToCart)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  
  return useMemo(() => ({
    addToCart,
    removeFromCart,
  }), [addToCart, removeFromCart])
}
```

**Option 3 - Hooks séparés :**
```tsx
export function useAddToCart() {
  return useCartStore(state => state.addToCart)
}

export function useRemoveFromCart() {
  return useCartStore(state => state.removeFromCart)
}
```

### 2. "Maximum update depth exceeded"

**Cause :** Boucle infinie causée par des dépendances circulaires.

**Solutions :**
- Vérifier les `useEffect` avec des dépendances incorrectes
- Éviter les mutations directes du state
- Utiliser des sélecteurs stables

### 3. Problèmes de Persistance localStorage

**Cause :** Données corrompues ou format incompatible.

**Solutions :**
```tsx
// Dans le store Zustand
persist(
  (set, get) => ({
    // ... state et actions
  }),
  {
    name: 'cart-storage',
    partialize: (state) => ({ 
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice
    }),
    onRehydrateStorage: () => (state) => {
      if (state) {
        // Validation des données après rehydration
        if (!Array.isArray(state.items)) {
          state.items = []
        }
      }
    }
  }
)
```

### 4. Erreurs TanStack Query

**Cause :** Requêtes mal configurées ou erreurs réseau.

**Solutions :**
```tsx
// Configuration robuste
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false // Pas de retry pour les erreurs client
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})
```

## 🔧 Outils de Débogage

### 1. DevTools Zustand
```tsx
import { devtools } from 'zustand/middleware'

export const useCartStore = create<CartState & CartActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ... state et actions
      }),
      { name: 'cart-storage' }
    ),
    { name: 'cart-store' }
  )
)
```

### 2. DevTools TanStack Query
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 3. Console Debugging
```tsx
// Dans vos composants
const cart = useCartStore()
console.log('Cart state:', cart)

// Dans vos requêtes
const { data, error, isLoading } = useBeats()
console.log('Beats query:', { data, error, isLoading })
```

## 📊 Monitoring des Performances

### 1. Mesurer les Re-renders
```tsx
import { useRef, useEffect } from 'react'

function MyComponent() {
  const renderCount = useRef(0)
  renderCount.current++
  
  useEffect(() => {
    console.log(`Component rendered ${renderCount.current} times`)
  })
  
  // ... reste du composant
}
```

### 2. Profiler Zustand
```tsx
// Ajouter des logs dans le store
export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      addToCart: (beat, licenseType, quantity = 1) => {
        console.log('Adding to cart:', { beat: beat.title, licenseType, quantity })
        // ... logique
      },
    }),
    { name: 'cart-storage' }
  )
)
```

## 🎯 Bonnes Pratiques

### 1. Sélecteurs Optimisés
```tsx
// ✅ Bon - sélecteur simple
const totalItems = useCartStore(state => state.totalItems)

// ❌ Éviter - calculs complexes dans le sélecteur
const expensiveCalculation = useCartStore(state => {
  return state.items.reduce((acc, item) => {
    // Calcul complexe ici
    return acc + complexCalculation(item)
  }, 0)
})
```

### 2. Actions Pures
```tsx
// ✅ Bon - action pure
addToCart: (beat, licenseType, quantity = 1) => {
  set(state => {
    const existingItem = state.items.find(item => 
      item.beat.id === beat.id && item.licenseType === licenseType
    )
    
    if (existingItem) {
      return {
        ...state,
        items: state.items.map(item =>
          item.beat.id === beat.id && item.licenseType === licenseType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
    }
    
    return {
      ...state,
      items: [...state.items, { beat, licenseType, quantity, addedAt: new Date() }]
    }
  })
}
```

### 3. Gestion d'Erreurs
```tsx
// Dans TanStack Query
const { data, error, isLoading } = useQuery({
  queryKey: ['beats'],
  queryFn: fetchBeats,
  onError: (error) => {
    console.error('Failed to fetch beats:', error)
    // Optionnel : notification à l'utilisateur
  }
})
```

## 🚀 Performance Tips

1. **Utilisez des sélecteurs spécifiques** au lieu de sélectionner tout le state
2. **Évitez les objets dans les sélecteurs** - utilisez des valeurs primitives
3. **Utilisez `useMemo`** pour les calculs coûteux
4. **Séparez les actions** en hooks individuels quand possible
5. **Configurez correctement** les options de cache TanStack Query

---

**💡 Conseil :** En cas de problème, utilisez les DevTools et les logs de console pour identifier la source du problème !
