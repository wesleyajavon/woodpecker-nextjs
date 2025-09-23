'use client'

import Image from 'next/image'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6'
}

export default function UserAvatar({ size = 'md', showName = false, className = '' }: UserAvatarProps) {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const { user } = session

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || user.email || 'Avatar'}
            width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            className={`${sizeClasses[size]} rounded-full border-2 border-white shadow-sm object-cover`}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center`}>
            <User className={`${iconSizes[size]} text-white`} />
          </div>
        )}
      </div>
      
      {showName && (
        <div className="flex flex-col">
          <span className={`font-medium text-gray-900 ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}>
            {user.name || 'Utilisateur'}
          </span>
          <span className={`text-gray-500 ${
            size === 'sm' ? 'text-xs' : 'text-xs'
          }`}>
            {user.email}
          </span>
        </div>
      )}
    </div>
  )
}




