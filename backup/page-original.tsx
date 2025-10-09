'use client'

import { motion } from 'framer-motion'
import { Music, Clock, Mail, Instagram, Youtube } from 'lucide-react'
import { DottedSurface } from '@/components/ui/dotted-surface'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <DottedSurface className="size-full z-0" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-yellow-900/20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-foreground px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Music className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            l.outsider
          </h1>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Bientôt Disponible
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Notre plateforme de beats professionnels sera bientôt en ligne avec des fonctionnalités exceptionnelles.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock className="w-5 h-5" />
            <span className="text-sm sm:text-base">Développement en cours...</span>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6">
            Ce qui vous attend :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Music, text: "Catalogue de beats exclusifs" },
              { icon: Clock, text: "Licences flexibles" },
              { icon: Mail, text: "Téléchargements sécurisés" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-card/10 backdrop-blur-lg rounded-xl p-4 border border-border/20"
              >
                <feature.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm sm:text-base text-muted-foreground">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="mb-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Restez connecté
          </h3>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:contact@loutsider.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm sm:text-base">Email</span>
            </a>
            <a
              href="https://instagram.com/loutsider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm sm:text-base">Instagram</span>
            </a>
            <a
              href="https://youtube.com/@loutsider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span className="text-sm sm:text-base">YouTube</span>
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-xs sm:text-sm text-muted-foreground"
        >
          © 2025 l.outsider. Tous droits réservés.
        </motion.div>
      </div>
    </div>
  )
}