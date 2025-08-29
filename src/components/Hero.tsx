'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Sparkles, Music, Headphones, Mic, Drum, Radio } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const floatingIcons = [
    { icon: Drum, delay: 0, position: "top-20 left-20" },
    { icon: Radio, delay: 2, position: "top-40 right-20" },
    { icon: Mic, delay: 4, position: "bottom-20 left-40" },
    { icon: Music, delay: 1, position: "top-60 left-60" },
    { icon: Headphones, delay: 3, position: "bottom-40 right-40" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-30" />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-purple-500/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl"
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-20 h-20 border border-pink-500/20 rounded-lg"
          animate={{ rotate: 180, scale: [1, 0.8, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating music icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} text-purple-400/30`}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              delay: item.delay, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <item.icon className="h-8 w-8" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
        >
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-medium">Nouveau : Pack Trap 2024</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="block">Woodpecker</span>
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Beatmaker
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Découvrez ma collection exclusive de beats originaux. Des instrumentaux uniques pour rappeurs, chanteurs et producteurs. 
          Chaque beat raconte une histoire.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/beats"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <span>Écouter mes beats</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="group relative inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-2xl">
              <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Démo live</span>
              <motion.div
                className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Stats with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { number: '200+', label: 'Beats', icon: Drum },
            { number: '15+', label: 'Genres', icon: Music },
            { number: '50+', label: 'Clients', icon: Headphones },
            { number: '5+', label: 'Années', icon: Sparkles },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center group"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-purple-400" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {stat.number}
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
