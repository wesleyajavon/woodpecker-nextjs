'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Music, Sparkles, Upload } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { FloatingNav } from './ui/floating-navbar';
import { useCartCount } from '@/hooks/useCart';

const Navigation = () => {
  const cartCount = useCartCount();

  const navItems = [
    { 
      name: 'Home', 
      link: '/', 
      icon: <Music className="h-4 w-4 text-foreground" />
    },
    { 
      name: 'Beats', 
      link: '/beats', 
      icon: <Music className="h-4 w-4 text-foreground" />
    },
    { 
      name: 'Contact', 
      link: '/contact', 
      icon: <Sparkles className="h-4 w-4 text-foreground" />
    },
    { 
      name: 'Admin', 
      link: '/admin/upload', 
      icon: <Upload className="h-4 w-4 text-foreground" />
    },
  ];

  return (
    <>
      {/* Floating Navigation */}
      <FloatingNav navItems={navItems} />
      
      {/* Fixed elements for cart, theme toggle, and auth */}
      <div className="fixed top-4 right-4 z-[5001] flex items-center space-x-3">
        {/* <ThemeToggle /> */}
        
        <Link href="/cart">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.div>
            )}
          </motion.button>
        </Link>
        
      </div>
    </>
  );
};

export default Navigation;