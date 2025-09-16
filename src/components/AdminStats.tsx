'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';

interface AdminStatsData {
  totalBeats: number;
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
          >
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      icon: Music,
      value: stats.totalBeats,
      label: 'Total Beats',
      color: 'purple',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: ShoppingCart,
      value: stats.totalOrders,
      label: 'Total Commandes',
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: DollarSign,
      value: `${stats.totalRevenue}€`,
      label: 'Chiffre d\'affaires',
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    {
      icon: Users,
      value: stats.uniqueCustomers,
      label: 'Utilisateurs',
      color: 'yellow',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} backdrop-blur-lg rounded-xl p-6 text-center border ${card.borderColor} hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${card.bgColor} border ${card.borderColor}`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
          <div className={`text-3xl font-bold ${card.textColor} mb-2`}>
            {card.value}
          </div>
          <div className="text-gray-300 text-sm">
            {card.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
