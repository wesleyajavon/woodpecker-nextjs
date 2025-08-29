
import Footer from '@/components/Footer';
import { Star, ShoppingCart, Heart, Play } from 'lucide-react';

const KitsPage = () => {
  const kits = [
    {
      id: 1,
      name: 'Kit Trap Premium',
      genre: 'Trap',
      price: 49.99,
      rating: 4.8,
      reviews: 124,
      tracks: 50,
      duration: '2h30',
      badge: 'Populaire'
    },
    {
      id: 2,
      name: 'Pack Hip-Hop Essentials',
      genre: 'Hip-Hop',
      price: 39.99,
      rating: 4.6,
      reviews: 89,
      tracks: 75,
      duration: '3h15',
      badge: 'Nouveau'
    },
    {
      id: 3,
      name: 'Kit R&B Soul',
      genre: 'R&B',
      price: 44.99,
      rating: 4.7,
      reviews: 156,
      tracks: 60,
      duration: '2h45',
      badge: 'Bestseller'
    },
    {
      id: 4,
      name: 'Electronic Dance Pack',
      genre: 'EDM',
      price: 54.99,
      rating: 4.5,
      reviews: 98,
      tracks: 80,
      duration: '4h00',
      badge: 'Éditeur'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kits de Production
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des kits professionnels pour tous les genres musicaux. Prêts à être utilisés dans vos productions.
          </p>
        </div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-2xl flex items-center justify-center">
                  <div className="text-4xl text-gray-400">🎵</div>
                </div>
                {kit.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {kit.badge}
                    </span>
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <button className="absolute bottom-4 left-4 p-3 bg-black/80 hover:bg-black text-white rounded-full transition-colors">
                  <Play className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-sm text-purple-600 font-semibold mb-2">
                  {kit.genre}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {kit.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(kit.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {kit.rating} ({kit.reviews})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Tracks:</span> {kit.tracks}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Durée:</span> {kit.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {kit.price}€
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

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à créer votre prochain hit ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de producteurs qui utilisent déjà nos kits
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default KitsPage;
