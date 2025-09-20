'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { User } from 'lucide-react'
import UserMenu from './UserMenu'

interface AuthButtonProps {
  scrolled?: boolean
}

export default function AuthButton({ scrolled = false }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button 
        disabled 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-gray-100 text-gray-500' 
            : 'bg-gray-300 text-white/90'
        }`}
      >
        Chargement...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">

        <UserMenu scrolled={scrolled} />

        
        {/* Bouton de déconnexion */}
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="outline"
          className={`text-sm transition-all duration-300 ${
            scrolled 
              ? 'border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50' 
              : 'border-gray-300 text-white/90 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          Déconnexion
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => window.location.href = '/auth/signin'}
        variant="outline"
        className={`text-sm transition-all duration-300 ${
          scrolled 
            ? 'border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50' 
            : 'border-gray-300 text-white/90 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50'
        }`}
      >
        Connexion
      </Button>
    </div>
  )
}

