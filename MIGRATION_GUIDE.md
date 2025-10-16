# 🚀 Guide de Migration - Architecture Moderne de Gestion d'État

## Vue d'ensemble

Ce guide vous aide à migrer de l'ancienne architecture (React Context + useReducer) vers la nouvelle architecture moderne :

- **🏠 État local** : `useState`, `useReducer` + hooks personnalisés
- **🌐 État global UI** : Zustand
- **🔁 État serveur** : TanStack Query

## 📋 Checklist de Migration

### ✅ Étapes Complétées

- [x] Installation des dépendances (Zustand, TanStack Query)
- [x] Configuration des stores Zustand
- [x] Configuration de TanStack Query
- [x] Création des hooks personnalisés
- [x] Intégration dans le layout principal
- [x] Création d'exemples pratiques

### 🔄 Prochaines Étapes

- [ ] Migration du CartContext vers Zustand
- [ ] Migration des appels API vers TanStack Query
- [ ] Mise à jour des composants existants
- [ ] Tests et validation

## 🏠 État Local - useState/useReducer

### Avant (ancien système)
```tsx
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)
const [isOpen, setIsOpen] = useState(false)
```

### Après (nouveau système)
```tsx
import { useLoading, useError, useModal } from '@/hooks/local'

function MyComponent() {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const { error, setErrorMessage, clearError } = useError()
  const { isOpen, open, close, toggle } = useModal()
  
  // Utilisation plus simple et réutilisable
}
```

### Hooks Disponibles

- `useLoading()` - Gestion de l'état de chargement
- `useError()` - Gestion des erreurs
- `useForm<T>()` - Gestion des formulaires
- `useModal()` - Gestion des modals/dialogs
- `usePagination()` - Gestion de la pagination
- `useMultiSelect<T>()` - Sélection multiple
- `useSearch()` - Recherche avec debounce

## 🌐 État Global UI - Zustand

### Avant (React Context)
```tsx
// CartContext.tsx
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)
  // ... logique complexe
}

// Dans le composant
const { cart, addToCart } = useContext(CartContext)
```

### Après (Zustand)
```tsx
// cartStore.ts
export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isOpen: false,
      addToCart: (beat, licenseType, quantity = 1) => {
        // Logique simplifiée
      },
      // ... autres actions
    }),
    { name: 'loutsider-cart' }
  )
)

// Dans le composant
const { items, addToCart, totalItems } = useCartStore()
```

### Stores Disponibles

- `useCartStore` - Gestion du panier
- `useAppStore` - État global de l'app (thème, langue, notifications)
- `useUserStore` - État utilisateur

### Avantages de Zustand

- ✅ Moins de boilerplate
- ✅ Pas de Provider nécessaire
- ✅ Persistance automatique
- ✅ DevTools intégrées
- ✅ Meilleure performance

## 🔁 État Serveur - TanStack Query

### Avant (appels API directs)
```tsx
function BeatsList() {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBeats = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/beats')
        const data = await response.json()
        setBeats(data.beats)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBeats()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>
  return <div>{beats.map(beat => ...)}</div>
}
```

### Après (TanStack Query)
```tsx
import { useBeats } from '@/hooks/queries/useBeats'

function BeatsList() {
  const { data: beats, isLoading, error } = useBeats({
    page: 1,
    limit: 10,
    sortBy: 'newest'
  })

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>
  return <div>{beats?.beats.map(beat => ...)}</div>
}
```

### Hooks Disponibles

- `useBeats()` - Récupération des beats
- `useBeat(id)` - Récupération d'un beat
- `useFeaturedBeats()` - Beats en vedette
- `useCreateBeat()` - Création d'un beat
- `useUpdateBeat()` - Mise à jour d'un beat
- `useDeleteBeat()` - Suppression d'un beat
- `useUserOrders()` - Commandes utilisateur
- `useCreateStripeCheckout()` - Paiement Stripe
- `useProfile()` - Profil utilisateur

### Avantages de TanStack Query

- ✅ Cache automatique
- ✅ Synchronisation en arrière-plan
- ✅ Retry automatique
- ✅ Optimistic updates
- ✅ DevTools intégrées
- ✅ Gestion des états de chargement/erreur

## 🔄 Plan de Migration

### Phase 1 : Préparation
1. ✅ Installer les dépendances
2. ✅ Configurer les providers
3. ✅ Créer les stores et hooks

### Phase 2 : Migration Graduelle
1. **Composants simples** - Migrer les composants qui utilisent seulement useState
2. **État global** - Remplacer CartContext par useCartStore
3. **Appels API** - Remplacer les useEffect + fetch par TanStack Query
4. **Composants complexes** - Migrer les composants avec logique métier

### Phase 3 : Nettoyage
1. Supprimer les anciens Context
2. Supprimer les anciens hooks
3. Mettre à jour les tests
4. Documentation finale

## 📝 Exemples Pratiques

### Migration d'un Composant Simple

**Avant :**
```tsx
function BeatCard({ beat }) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(beat, 'WAV_LEASE')
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? 'Ajout...' : 'Ajouter au panier'}
    </button>
  )
}
```

**Après :**
```tsx
function BeatCard({ beat }) {
  const { addToCart } = useCartStore()
  const { isLoading, startLoading, stopLoading } = useLoading()

  const handleAddToCart = async () => {
    startLoading()
    try {
      addToCart(beat, 'WAV_LEASE')
    } catch (error) {
      console.error(error)
    } finally {
      stopLoading()
    }
  }

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Ajout...' : 'Ajouter au panier'}
    </button>
  )
}
```

### Migration d'une Liste avec API

**Avant :**
```tsx
function BeatsList() {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBeats()
  }, [])

  const fetchBeats = async () => {
    try {
      const response = await fetch('/api/beats')
      const data = await response.json()
      setBeats(data.beats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>
  
  return (
    <div>
      {beats.map(beat => <BeatCard key={beat.id} beat={beat} />)}
    </div>
  )
}
```

**Après :**
```tsx
import { useBeats } from '@/hooks/queries/useBeats'

function BeatsList() {
  const { data, isLoading, error } = useBeats({
    page: 1,
    limit: 20
  })

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>
  
  return (
    <div>
      {data?.beats.map(beat => <BeatCard key={beat.id} beat={beat} />)}
    </div>
  )
}
```

## 🧪 Tests et Validation

### Tests des Stores Zustand
```tsx
import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/stores/cartStore'

test('should add item to cart', () => {
  const { result } = renderHook(() => useCartStore())
  
  act(() => {
    result.current.addToCart(mockBeat, 'WAV_LEASE')
  })
  
  expect(result.current.items).toHaveLength(1)
  expect(result.current.totalItems).toBe(1)
})
```

### Tests des Hooks TanStack Query
```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBeats } from '@/hooks/queries/useBeats'

test('should fetch beats', async () => {
  const queryClient = new QueryClient()
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  const { result } = renderHook(() => useBeats(), { wrapper })
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })
  
  expect(result.current.data?.beats).toBeDefined()
})
```

## 🎯 Prochaines Étapes

1. **Tester la démo** : Visitez `/state-demo` pour voir l'architecture en action
2. **Migrer un composant** : Commencez par un composant simple
3. **Valider les performances** : Vérifiez que les performances sont améliorées
4. **Former l'équipe** : Partagez ce guide avec votre équipe

## 📚 Ressources

- [Documentation Zustand](https://zustand-demo.pmnd.rs/)
- [Documentation TanStack Query](https://tanstack.com/query/latest)
- [React Hooks Patterns](https://reactjs.org/docs/hooks-patterns.html)

---

**Note** : Cette migration peut être faite progressivement. Vous pouvez garder l'ancien système en parallèle pendant la transition.