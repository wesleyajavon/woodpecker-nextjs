'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { User } from 'lucide-react'
import UserMenu from './UserMenu'

export default function AuthButton({ variant = 'default' }: { variant?: 'default' | 'floating' } = {}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button 
        disabled 
        className={`transition-all duration-300 ${variant === 'floating' ? 'bg-transparent text-muted-foreground border-none' : 'bg-muted text-muted-foreground'}`}
      >
        Chargement...
      </Button>
    )
  }

  if (session) {
    if (variant === 'floating') {
      return (
        <div className="flex items-center space-x-2">
          <UserMenu />
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm font-medium relative hover:text-muted-foreground transition-colors px-4 py-2 bg-transparent border-none hover:bg-transparent"
          >
            <span className="relative z-10 text-foreground">Déconnexion</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px" />
          </Button>
        </div>
      )
    }
    
    return (
      <div className="flex items-center space-x-3">
        <UserMenu />
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="outline"
          className="text-sm transition-all duration-300 border-border text-foreground hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          Déconnexion
        </Button>
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <Button
        onClick={() => window.location.href = '/auth/signin'}
        className="text-sm font-medium relative text-foreground hover:text-muted-foreground transition-colors px-4 py-2 bg-transparent border-none hover:bg-transparent"
      >
        <span className="relative z-10">Connexion</span>
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px" />
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => window.location.href = '/auth/signin'}
        variant="outline"
        className="text-sm transition-all duration-300 border-border text-foreground hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      >
        Connexion
      </Button>
    </div>
  )
}

