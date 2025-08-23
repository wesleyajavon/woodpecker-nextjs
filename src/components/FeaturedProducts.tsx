'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Kit Trap Premium',
      category: 'Kits',
      price: 49.99,
      rating: 4.8,
      image: '/api/placeholder/300/300',
      badge: 'Populaire'
    },
    {
      id: 2,
      name: 'Pack Samples Drums',
      category: 'Samples',
      price: 29.99,
      rating: 4.6,
      image: '/api/placeholder/300/300',
      badge: 'Nouveau'
    },
    {
      id: 3,
      name: 'Masterclass Production',
      category: 'Formation',
      price: 99.99,
      rating: 4.9,
      image: '/api/placeholder/300/300',
      badge: 'Bestseller'
    },
    {
      id: 4,
      name: 'Plugin EQ Pro',
      category: 'Plugins',
      price: 79.99,
      rating: 4.7,
      image: '/api/placeholder/300/300',
      badge: 'Éditeur'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Produits en vedette
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos produits les plus populaires et nos dernières nouveautés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-2xl flex items-center justify-center">
                  <div className="text-4xl text-gray-400">🎵</div>
                </div>
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}€
                  </span>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-105">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/prods"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les produits
            <span className="text-2xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
