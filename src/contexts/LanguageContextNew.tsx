'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useTranslation, useLanguage, useSetLanguage } from '@/hooks/useApp'

export type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const language = useLanguage()
  const setLanguage = useSetLanguage()
  const { t } = useTranslation()

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}

// Hook de compatibilité pour l'ancienne API
export function useTranslationCompat() {
  return useLanguageContext()
}
