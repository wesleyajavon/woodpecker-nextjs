import { Beat } from './beat'

export interface CartItem {
  beat: Beat
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

export interface CartContextType {
  cart: CartState
  addToCart: (beat: Beat, quantity?: number) => void
  removeFromCart: (beatId: string) => void
  updateQuantity: (beatId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}
