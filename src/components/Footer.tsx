'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Music, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
          products: [
        { name: 'Beats', href: '/beats', icon: Music },
        { name: 'Collections', href: '/collections', icon: Sparkles },
        { name: 'Kits', href: '/kits', icon: Music },
        { name: 'Vidéos', href: '/videos', icon: Sparkles },
      ],
    services: [
      { name: 'Services', href: '/services', icon: Sparkles },
      { name: 'Membres', href: '/memberships', icon: Music },
      { name: 'Formation', href: '/training', icon: Sparkles },
      { name: 'Support', href: '/support', icon: Music },
    ],
    company: [
      { name: 'À propos', href: '/about', icon: Heart },
      { name: 'Contact', href: '/contact', icon: Mail },
      { name: 'Blog', href: '/blog', icon: Sparkles },
      { name: 'Carrières', href: '/careers', icon: Music },
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Licences', href: '/licenses' },
      { name: 'Cookies', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Brand section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Music className="h-7 w-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  l.outsider
                </span>
              </Link>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-gray-300 mb-8 max-w-md leading-relaxed">
              Votre destination pour tout ce qui concerne la production musicale. 
              Des produits de qualité, des formations expertes et une communauté passionnée.
            </motion.p>
            
            {/* Contact Info with enhanced design */}
            <motion.div variants={itemVariants} className="space-y-4">
              {[
                { icon: Mail, details: 'contact@loutsider.com', description: 'Envoyez-nous un message' },
                { icon: Phone, details: '+33 1 23 45 67 89', description: 'Lun-Ven, 9h-18h' },
                { icon: MapPin, details: '123 Rue de la Musique', description: '75001 Paris, France' },
              ].map((info, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      {info.details}
                    </p>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {info.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-400" />
              Produits
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                  >
                    <link.icon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                  >
                    <link.icon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-400" />
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                  >
                    <link.icon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom section with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 mt-16 pt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-gray-400 ${social.color} transition-all duration-300 p-3 hover:bg-white/10 rounded-xl backdrop-blur-sm`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              {footerLinks.legal.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-400">
              © 2025 Wesley Ajavon. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Créé avec ❤️ pour la communauté musicale
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
