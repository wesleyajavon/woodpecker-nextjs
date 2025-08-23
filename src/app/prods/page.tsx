import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';

const ProductsPage = () => {
  const products = [
    {
      id: 1,
      name: 'Kit Trap Premium',
      category: 'Kits',
      price: 49.99,
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/300',
      badge: 'Populaire',
      description: 'Kit complet pour la production de trap avec 50 patterns uniques'
    },
    {
      id: 2,
      name: 'Pack Samples Drums',
      category: 'Samples',
      price: 29.99,
      rating: 4.6,
      reviews: 89,
      image: '/api/placeholder/300/300',
      badge: 'Nouveau',
      description: 'Collection de 200 samples de batterie haute qualité'
    },
    {
      id: 3,
      name: 'Masterclass Production',
      category: 'Formation',
      price: 99.99,
      rating: 4.9,
      reviews: 256,
      image: '/api/placeholder/300/300',
      badge: 'Bestseller',
      description: 'Formation complète sur la production musicale professionnelle'
    },
    {
      id: 4,
      name: 'Plugin EQ Pro',
      category: 'Plugins',
      price: 79.99,
      rating: 4.7,
      reviews: 167,
      image: '/api/placeholder/300/300',
      badge: 'Éditeur',
      description: 'Equaliseur professionnel avec 10 bandes paramétriques'
    },
    {
      id: 5,
      name: 'Pack Melodies Hip-Hop',
      category: 'Melodies',
      price: 39.99,
      rating: 4.5,
      reviews: 78,
      image: '/api/placeholder/300/300',
      description: '100 mélodies hip-hop originales en différents tons'
    },
    {
      id: 6,
      name: 'Tutorial Mixing',
      category: 'Formation',
      price: 59.99,
      rating: 4.8,
      reviews: 145,
      image: '/api/placeholder/300/300',
      description: 'Guide complet du mixage audio étape par étape'
    }
  ];

  const categories = ['Tous', 'Kits', 'Samples', 'Formation', 'Plugins', 'Melodies'];
  const priceRanges = ['Tous', '0-25€', '25-50€', '50-100€', '100€+'];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Produits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection complète de produits pour la production musicale
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'Tous'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Prix:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Grid className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
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
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
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
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}€
                  </span>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
              Précédent
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">2</button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">3</button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductsPage;
