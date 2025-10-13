'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { TextRewind } from '@/components/ui/text-rewind';
import BeatInfoCard from '@/components/ui/BeatInfoCard';
import { cn } from '@/lib/utils';
import { Beat } from '@/types/beat';
import { useTranslation } from '@/contexts/LanguageContext';

export default function BeatManagementPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const beatId = params?.id as string;
  
  const [beat, setBeat] = useState<Beat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Beat>>({});

  // Chargement des données du beat
  useEffect(() => {
    const fetchBeat = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/beats/${beatId}`);
        
        if (!response.ok) {
          throw new Error('Beat non trouvé');
        }
        
        const data = await response.json();
        setBeat(data.data);
        setEditData(data.data); // Initialiser les données d'édition
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (beatId) {
      fetchBeat();
    }
  }, [beatId]);

  // Gestion des modifications
  const handleEditChange = (field: keyof Beat, value: string | number | boolean | string[]) => {
    // Exclure les prix des modifications inline
    if (field === 'wavLeasePrice' || field === 'trackoutLeasePrice' || field === 'unlimitedLeasePrice') {
      return;
    }
    
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sauvegarde des modifications
  const handleSave = async () => {
    if (!beat) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/beats/${beatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      setBeat(result.data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Annulation des modifications
  const handleCancel = () => {
    setEditData(beat || {});
    setIsEditing(false);
  };

  // Suppression du beat
  const handleDelete = async () => {
    if (!beat || !confirm('Êtes-vous sûr de vouloir supprimer ce beat ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/beats/${beatId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      router.push('/admin/upload');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center relative z-10"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground text-lg">{t('admin.loadingBeat')}</p>
          </motion.div>
        </div>
      </AdminRoute>
    );
  }

  if (error || !beat) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-6 relative z-10"
          >
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('admin.beatNotFound')}</h1>
            <p className="text-muted-foreground mb-6">{error || t('admin.beatNotFoundDescription')}</p>
            <Link
              href="/admin/upload"
              className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground px-6 py-3 rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30"
            >
              <ArrowLeft className="w-5 h-5" />
{t('admin.backToManagement')}
            </Link>
          </motion.div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar beatId={beatId} />
        
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

            <div className="max-w-4xl mx-auto py-4 sm:py-8 relative z-10">
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
              <TextRewind text={t('admin.beatManagement')} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t('admin.beatManagementDescription')}
            </motion.p>
            </motion.div>

          {/* Beat Info Card */}
          <BeatInfoCard
            beat={beat}
            isEditing={isEditing}
            editData={editData}
            onEditChange={handleEditChange}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onEditFiles={() => router.push(`/admin/beats/${beatId}/edit`)}
            onStartEdit={() => setIsEditing(true)}
            isSaving={isSaving}
            isDeleting={isDeleting}
          />
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
