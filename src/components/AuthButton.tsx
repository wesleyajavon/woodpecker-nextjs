'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { User } from 'lucide-react'
import UserMenu from './UserMenu'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/contexts/LanguageContext'

export default function AuthButton({ variant = 'default' }: { variant?: 'default' | 'floating' } = {}) {
  const { data: session, status } = useSession()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted) {
    return (
      <Button 
        disabled 
        className={`transition-all duration-300 ${variant === 'floating' ? 'bg-transparent text-muted-foreground border-none' : 'bg-muted text-muted-foreground'}`}
      >
{t('common.loading')}
      </Button>
    )
  }

  if (status === 'loading') {
    return (
      <Button 
        disabled 
        className={`transition-all duration-300 ${variant === 'floating' ? 'bg-transparent text-muted-foreground border-none' : 'bg-muted text-muted-foreground'}`}
      >
{t('common.loading')}
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
            <span className="relative z-10 text-foreground">{t('auth.signOut')}</span>
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
          {t('auth.signOut')}
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
        <span className="relative z-10">{t('auth.signIn')}</span>
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
        {t('auth.signIn')}
      </Button>
    </div>
  )
}

