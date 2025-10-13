'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import AdminOrders from '@/components/AdminOrders';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { TextRewind } from '@/components/ui/text-rewind';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

export default function AdminOrdersPage() {
  const { t } = useTranslation();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
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
                  <TextRewind text={t('admin.orders')} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  Gérez toutes les commandes, suivez les paiements et analysez les performances de vente
                </motion.p>
              </motion.div>

              {/* Orders Manager */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {t('admin.orders')}
                  </h2>
                </div>

                <AdminOrders />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
