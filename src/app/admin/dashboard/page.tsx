'use client';

import { motion } from 'framer-motion';
import { BarChart3, Music, ShoppingCart, Users, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { TextRewind } from '@/components/ui/text-rewind';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  // Mock data - à remplacer par de vraies données
  const stats = [
    {
      title: t('admin.totalBeats'),
      value: '17',
      changeType: 'positive',
      icon: Music,
      color: 'text-blue-400'
    },
    {
      title: t('admin.totalOrders'),
      value: '63',
      change: '+8%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-green-400'
    },
    {
      title: t('admin.totalRevenue'),
      value: '€2,989',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-purple-400'
    },
    {
      title: t('admin.activeVisitors'),
      value: '342',
      change: '+12%',
      changeType: 'positive',
      icon: Eye,
      color: 'text-orange-400'
    }
  ];

  const recentActivities = [
    { id: 1, action: t('admin.newBeatUploaded'), beat: 'Trap Beat #24', time: `2h ${t('admin.ago')}`, type: 'upload' },
    { id: 2, action: t('admin.orderReceived'), beat: 'Hip Hop Beat #12', time: `4h ${t('admin.ago')}`, type: 'order' },
    { id: 3, action: t('admin.beatModified'), beat: 'R&B Beat #8', time: `6h ${t('admin.ago')}`, type: 'edit' },
    { id: 4, action: t('admin.newBeatUploaded'), beat: 'Drill Beat #15', time: `8h ${t('admin.ago')}`, type: 'upload' }
  ];

  return (
    <div className="flex-1 pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-8 relative">
      <DottedSurface className="size-full z-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,var(--theme-gradient),transparent_50%)]',
            'blur-[30px]',
          )}
        />
      </div>

      <div className="max-w-6xl mx-auto py-4 sm:py-8 relative z-10">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 px-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 mt-6"
          >
            <TextRewind text={t('admin.dashboardTitle')} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t('admin.dashboardSubtitle')}
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-card/10 backdrop-blur-lg rounded-xl p-6 border border-border/20 hover:border-border/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color === 'text-blue-400' ? 'bg-blue-500/20' : stat.color === 'text-green-400' ? 'bg-green-500/20' : stat.color === 'text-purple-400' ? 'bg-purple-500/20' : 'bg-orange-500/20')}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <span className={cn("text-sm font-medium", stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400')}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Activities */}
          <div className="bg-card/10 backdrop-blur-lg rounded-xl p-6 border border-border/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t('admin.recentActivity')}</h2>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/20 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    activity.type === 'upload' ? 'bg-blue-500/20' :
                      activity.type === 'order' ? 'bg-green-500/20' :
                        'bg-purple-500/20'
                  )}>
                    {activity.type === 'upload' ? (
                      <Music className="w-4 h-4 text-blue-400" />
                    ) : activity.type === 'order' ? (
                      <ShoppingCart className="w-4 h-4 text-green-400" />
                    ) : (
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.beat}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card/10 backdrop-blur-lg rounded-xl p-6 border border-border/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t('admin.quickActions')}</h2>
            </div>
            <div className="space-y-3">
              <motion.a
                href="/admin/upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 transition-all duration-300"
              >
                <Music className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-foreground">{t('admin.uploadBeat')}</span>
              </motion.a>
              <motion.a
                href="/admin/manage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/20 hover:bg-card/30 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t('admin.manageBeats')}</span>
              </motion.a>
              <motion.a
                href="/admin/orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/20 hover:bg-card/30 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t('admin.viewOrders')}</span>
              </motion.a>
              <motion.a
                href="/admin/stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/20 hover:bg-card/30 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t('admin.detailedAnalytics')}</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
