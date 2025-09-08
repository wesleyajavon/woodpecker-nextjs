'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { User } from 'lucide-react'
import UserMenu from './UserMenu'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button disabled className="bg-gray-300 text-gray-500">
        Chargement...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">

        <UserMenu />

        
        {/* Bouton de déconnexion */}
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="outline"
          className="text-sm"
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
        className="text-sm"
      >
        Connexion
      </Button>
    </div>
  )
}

