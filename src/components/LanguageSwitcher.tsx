'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
}

export default function LanguageSwitcher({ 
  className = '', 
  variant = 'default' 
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'fr', name: t('language.french'), flag: '🇫🇷' },
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-card/10 backdrop-blur-lg border border-border/20 text-foreground hover:bg-card/20 transition-colors"
          title={t('language.switch')}
        >
          <Languages className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 min-w-[140px] bg-card/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl overflow-hidden"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      language === lang.code
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-foreground hover:bg-card/50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 text-sm font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/10 backdrop-blur-lg border border-border/20 text-foreground hover:bg-card/20 transition-colors"
        >
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 min-w-[160px] bg-card/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl overflow-hidden"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      language === lang.code
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-foreground hover:bg-card/50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 text-sm font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/10 backdrop-blur-lg border border-border/20 text-foreground hover:bg-card/20 transition-colors min-w-[180px]"
      >
        <Languages className="w-5 h-5 text-purple-400" />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium">{currentLanguage?.name}</div>
          <div className="text-xs text-muted-foreground">{t('language.current')}</div>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-card/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl overflow-hidden"
            >
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wide">
                  {t('language.switch')}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-3 py-3 text-left flex items-center gap-3 rounded-lg transition-colors ${
                      language === lang.code
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-foreground hover:bg-card/50'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex-1 font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
