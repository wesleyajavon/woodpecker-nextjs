'use client'

import React from 'react'
import { useLanguage, useSetLanguage } from '@/hooks/useApp'
import { Button } from './ui/Button'
import { Languages } from 'lucide-react'

export default function LanguageSwitcherNew() {
  const language = useLanguage()
  const setLanguage = useSetLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Languages className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </Button>
  )
}
