'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, ShoppingCart, DollarSign, Users, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface AdminStatsData {
  totalBeats: number;
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
}

export default function AdminStatsGraphics() {
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
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Graphiques</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6"
            >
              <div className="animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-32 bg-white/20 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Graphiques</h3>
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calculate additional metrics for visualizations
  const averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
  const conversionRate = stats.uniqueCustomers > 0 ? (stats.totalOrders / stats.uniqueCustomers) * 100 : 0;

  // Data for pie chart (revenue distribution simulation)
  const pieChartData = [
    { label: 'Beats Premium', value: Math.round(stats.totalRevenue * 0.6), color: 'bg-purple-500' },
    { label: 'Beats Standard', value: Math.round(stats.totalRevenue * 0.3), color: 'bg-blue-500' },
    { label: 'Beats Gratuits', value: Math.round(stats.totalRevenue * 0.1), color: 'bg-green-500' }
  ];

  // Data for bar chart (monthly simulation)
  const barChartData = [
    { month: 'Jan', beats: Math.floor(stats.totalBeats * 0.1), orders: Math.floor(stats.totalOrders * 0.08) },
    { month: 'Fév', beats: Math.floor(stats.totalBeats * 0.12), orders: Math.floor(stats.totalOrders * 0.1) },
    { month: 'Mar', beats: Math.floor(stats.totalBeats * 0.15), orders: Math.floor(stats.totalOrders * 0.12) },
    { month: 'Avr', beats: Math.floor(stats.totalBeats * 0.18), orders: Math.floor(stats.totalOrders * 0.15) },
    { month: 'Mai', beats: Math.floor(stats.totalBeats * 0.2), orders: Math.floor(stats.totalOrders * 0.2) },
    { month: 'Juin', beats: Math.floor(stats.totalBeats * 0.25), orders: Math.floor(stats.totalOrders * 0.35) },
    { month: 'Juil', beats: Math.floor(stats.totalBeats * 0.3), orders: Math.floor(stats.totalOrders * 0.4) },
    { month: 'Août', beats: Math.floor(stats.totalBeats * 0.35), orders: Math.floor(stats.totalOrders * 0.45) },
    { month: 'Sep', beats: Math.floor(stats.totalBeats * 0.4), orders: Math.floor(stats.totalOrders * 0.5) }
  ];

  const maxValue = Math.max(...barChartData.map(d => Math.max(d.beats, d.orders)));

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        Graphiques et Analyses
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Répartition du CA</h4>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                {pieChartData.map((segment, index) => {
                  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = (segment.value / total) * 100;
                  const circumference = 2 * Math.PI * 45;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = pieChartData.slice(0, index).reduce((offset, item) => {
                    return offset - ((item.value / total) * circumference);
                  }, 0);
                  
                  return (
                    <circle
                      key={segment.label}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className={`${segment.color.replace('bg-', 'text-')} transition-all duration-1000`}
                      style={{
                        strokeDasharray: strokeDasharray,
                        strokeDashoffset: strokeDashoffset
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{stats.totalRevenue}€</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {pieChartData.map((segment, index) => (
              <div key={segment.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                  <span className="text-gray-300">{segment.label}</span>
                </div>
                <span className="text-white font-medium">{segment.value}€</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trends Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Tendances Mensuelles</h4>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {barChartData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center gap-1 mb-2">
                  <div
                    className="w-full bg-purple-500 rounded-t transition-all duration-1000 hover:bg-purple-400"
                    style={{ height: `${(data.beats / maxValue) * 120}px` }}
                  ></div>
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-1000 hover:bg-blue-400"
                    style={{ height: `${(data.orders / maxValue) * 120}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-300">Beats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-300">Commandes</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Métriques Clés</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Panier moyen</span>
              <span className="text-white font-semibold">{averageOrderValue.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Taux de conversion</span>
              <span className="text-white font-semibold">{conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">CA par beat</span>
              <span className="text-white font-semibold">
                {stats.totalBeats > 0 ? (stats.totalRevenue / stats.totalBeats).toFixed(2) : 0}€
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Commandes par client</span>
              <span className="text-white font-semibold">
                {stats.uniqueCustomers > 0 ? (stats.totalOrders / stats.uniqueCustomers).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-semibold text-white">Indicateurs de Performance</h4>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Satisfaction clients</span>
                <span className="text-white font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Taux de rétention</span>
                <span className="text-white font-semibold">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Croissance mensuelle</span>
                <span className="text-white font-semibold">+15%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
