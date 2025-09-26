'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, Music, Clock, Tag } from 'lucide-react'
import { CartItem as CartItemType } from '@/types/cart'
import { useCartActions } from '@/hooks/useCart'
import { Button } from './ui/Button'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartActions()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove()
    } else {
      updateQuantity(item.beat.id, newQuantity)
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeFromCart(item.beat.id)
    }, 300)
  }

  const formatDuration = (duration: string) => {
    // Convert "3:45" format to "3m 45s"
    const parts = duration.split(':')
    if (parts.length === 2) {
      const minutes = parseInt(parts[0])
      const seconds = parseInt(parts[1])
      return `${minutes}m ${seconds}s`
    }
    return duration
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-600 rounded-xl border border-gray-500 p-4 shadow-sm transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:shadow-gray-900/20'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Beat Artwork */}
        {item.beat.artworkUrl && (
          <div className="flex-shrink-0">
            <img
              src={item.beat.artworkUrl}
              alt={`${item.beat.title} artwork`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}
        
        {/* Beat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {item.beat.title}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {item.beat.genre} • {item.beat.bpm} BPM • {item.beat.key}
              </p>
              
              {/* Beat Details */}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(item.beat.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Music className="h-4 w-4" />
                  <span>{item.beat.rating.toFixed(1)} ⭐</span>
                </div>
                {item.beat.isExclusive && (
                  <div className="flex items-center space-x-1 text-purple-400">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">Exclusive</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                €{(item.beat.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                €{item.beat.price.toFixed(2)} each
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-500">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isRemoving}
            className="h-8 w-8 p-0 rounded-full bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="text-lg font-medium text-white min-w-[2rem] text-center">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isRemoving}
            className="h-8 w-8 p-0 rounded-full bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-500/50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </motion.div>
  )
}
