'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminRoute from '@/components/AdminRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  // Extraire le beatId depuis l'URL si on est sur une page de beat
  const beatIdMatch = pathname?.match(/\/admin\/beats\/([^\/]+)/);
  const beatId = beatIdMatch ? beatIdMatch[1] : undefined;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar beatId={beatId} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {children}
        </div>
      </div>
    </AdminRoute>
  );
}
