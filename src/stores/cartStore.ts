import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Beat } from '@/types/beat'
import { CartItem, LicenseType } from '@/types/cart'

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

interface CartActions {
  addToCart: (beat: Beat, licenseType: LicenseType, quantity?: number) => void
  removeFromCart: (beatId: string, licenseType: LicenseType) => void
  updateQuantity: (beatId: string, licenseType: LicenseType, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const getPrice = (beat: Beat, licenseType: LicenseType): number => {
  switch (licenseType) {
    case 'WAV_LEASE': return beat.wavLeasePrice
    case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
    case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
    default: return beat.wavLeasePrice
  }
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // État initial
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isOpen: false,

      // Actions
      addToCart: (beat, licenseType, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(item => 
          item.beat.id === beat.id && item.licenseType === licenseType
        )
        
        let newItems: CartItem[]
        if (existingItem) {
          newItems = items.map(item =>
            item.beat.id === beat.id && item.licenseType === licenseType
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...items, { beat, licenseType, quantity, addedAt: new Date() }]
        }
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = newItems.reduce((sum, item) => 
          sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0
        )
        
        set({ items: newItems, totalItems, totalPrice })
      },

      removeFromCart: (beatId, licenseType) => {
        const { items } = get()
        const newItems = items.filter(item => 
          !(item.beat.id === beatId && item.licenseType === licenseType)
        )
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = newItems.reduce((sum, item) => 
          sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0
        )
        
        set({ items: newItems, totalItems, totalPrice })
      },

      updateQuantity: (beatId, licenseType, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(beatId, licenseType)
          return
        }
        
        const { items } = get()
        const newItems = items.map(item =>
          item.beat.id === beatId && item.licenseType === licenseType
            ? { ...item, quantity }
            : item
        )
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = newItems.reduce((sum, item) => 
          sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0
        )
        
        set({ items: newItems, totalItems, totalPrice })
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },
    }),
    {
      name: 'loutsider-cart', // nom de la clé dans localStorage
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      }), // ne persiste que les données du panier, pas l'état d'ouverture
    }
  )
)
