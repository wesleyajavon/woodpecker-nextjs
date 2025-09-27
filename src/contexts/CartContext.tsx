'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Beat } from '@/types/beat'
import { CartItem, CartState, CartContextType, LicenseType } from '@/types/cart'

const CART_STORAGE_KEY = 'woodpecker-cart'

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { beat: Beat; licenseType: LicenseType; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { beatId: string; licenseType: LicenseType } }
  | { type: 'UPDATE_QUANTITY'; payload: { beatId: string; licenseType: LicenseType; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { beat, licenseType, quantity } = action.payload
      const existingItem = state.items.find(item => 
        item.beat.id === beat.id && item.licenseType === licenseType
      )
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(item =>
          item.beat.id === beat.id && item.licenseType === licenseType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...state.items, { beat, licenseType, quantity, addedAt: new Date() }]
      }
      
      const getPrice = (beat: Beat, licenseType: LicenseType): number => {
        switch (licenseType) {
          case 'WAV_LEASE': return beat.wavLeasePrice
          case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
          case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
          default: return beat.wavLeasePrice
        }
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0),
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const { beatId, licenseType } = action.payload
      const newItems = state.items.filter(item => 
        !(item.beat.id === beatId && item.licenseType === licenseType)
      )
      
      const getPrice = (beat: Beat, licenseType: LicenseType): number => {
        switch (licenseType) {
          case 'WAV_LEASE': return beat.wavLeasePrice
          case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
          case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
          default: return beat.wavLeasePrice
        }
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0),
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { beatId, licenseType, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { beatId, licenseType } })
      }
      
      const newItems = state.items.map(item =>
        item.beat.id === beatId && item.licenseType === licenseType
          ? { ...item, quantity }
          : item
      )
      
      const getPrice = (beat: Beat, licenseType: LicenseType): number => {
        switch (licenseType) {
          case 'WAV_LEASE': return beat.wavLeasePrice
          case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
          case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
          default: return beat.wavLeasePrice
        }
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0),
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      }
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      }
    
    case 'LOAD_CART':
      const items = action.payload.items
      const getPrice = (beat: Beat, licenseType: LicenseType): number => {
        switch (licenseType) {
          case 'WAV_LEASE': return beat.wavLeasePrice
          case 'TRACKOUT_LEASE': return beat.trackoutLeasePrice
          case 'UNLIMITED_LEASE': return beat.unlimitedLeasePrice
          default: return beat.wavLeasePrice
        }
      }
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + (getPrice(item.beat, item.licenseType) * item.quantity), 0),
      }
    
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Convert date strings back to Date objects
          const itemsWithDates = parsedCart.items.map((item: CartItem) => ({
            ...item,
            addedAt: new Date(item.addedAt),
          }))
          dispatch({ type: 'LOAD_CART', payload: { items: itemsWithDates } })
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart])

  const addToCart = (beat: Beat, licenseType: LicenseType, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { beat, licenseType, quantity } })
  }

  const removeFromCart = (beatId: string, licenseType: LicenseType) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { beatId, licenseType } })
  }

  const updateQuantity = (beatId: string, licenseType: LicenseType, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { beatId, licenseType, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
