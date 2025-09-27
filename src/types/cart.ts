import { Beat } from './beat'

export type LicenseType = 'WAV_LEASE' | 'TRACKOUT_LEASE' | 'UNLIMITED_LEASE';

export interface CartItem {
  beat: Beat
  licenseType: LicenseType
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
  addToCart: (beat: Beat, licenseType: LicenseType, quantity?: number) => void
  removeFromCart: (beatId: string, licenseType: LicenseType) => void
  updateQuantity: (beatId: string, licenseType: LicenseType, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}
