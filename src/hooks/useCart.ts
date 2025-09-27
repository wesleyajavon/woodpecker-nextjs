'use client'

import { useCart as useCartContext } from '@/contexts/CartContext'
import { Beat } from '@/types/beat'
import { LicenseType } from '@/types/cart'

export function useCart() {
  return useCartContext()
}

export function useAddToCart() {
  const { addToCart } = useCartContext()
  return addToCart
}

export function useRemoveFromCart() {
  const { removeFromCart } = useCartContext()
  return removeFromCart
}

export function useUpdateQuantity() {
  const { updateQuantity } = useCartContext()
  return updateQuantity
}

export function useCartCount() {
  const { cart } = useCartContext()
  return cart.totalItems
}

export function useCartTotal() {
  const { cart } = useCartContext()
  return cart.totalPrice
}

export function useCartItems() {
  const { cart } = useCartContext()
  return cart.items
}

export function useIsCartOpen() {
  const { cart } = useCartContext()
  return cart.isOpen
}

export function useCartActions() {
  const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = useCartContext()
  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }
}
