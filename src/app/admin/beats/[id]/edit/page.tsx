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
import BeatEditCard from '@/components/ui/BeatEditCard';
import { cn } from '@/lib/utils';
import { Beat } from '@/types/beat';
import { useTranslation } from '@/contexts/LanguageContext';

export default function BeatEditPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const beatId = params?.id as string;

    const [beat, setBeat] = useState<Beat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{
        preview: number;
        master: number;
        artwork: number;
        stems: number;
    }>({
        preview: 0,
        master: 0,
        artwork: 0,
        stems: 0
    });
    const [uploadedFiles, setUploadedFiles] = useState<{
        preview?: File;
        master?: File;
        artwork?: File;
        stems?: File;
    }>({});

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

    // Gestion des fichiers sélectionnés
    const handleFileSelect = (field: 'preview' | 'master' | 'artwork' | 'stems', file: File) => {
        setUploadedFiles(prev => ({ ...prev, [field]: file }));
    };

    // Suppression des fichiers sélectionnés
    const handleRemoveFile = (field: 'preview' | 'master' | 'artwork' | 'stems') => {
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[field];
            return newFiles;
        });
    };

    // Suppression de l'artwork
    const handleRemoveArtwork = async () => {
        if (!beat) return;

        try {
            setIsUploading(true);
            
            const response = await fetch(`/api/beats/${beatId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artworkUrl: null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression');
            }

            const result = await response.json();
            if (result.success) {
                setBeat(result.data);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Gestion des uploads S3
    const handleS3UploadComplete = (type: 'master' | 'stems', result: { url: string; key: string }) => {
        if (!beat) return;
        
        const updateData = type === 'master' 
            ? { s3MasterUrl: result.url, s3MasterKey: result.key }
            : { s3StemsUrl: result.url, s3StemsKey: result.key };
            
        setBeat(prev => prev ? { ...prev, ...updateData } : null);
    };

    const handleS3UploadError = (error: string) => {
        setError(error);
    };

    // Suppression des stems
    const handleRemoveStems = async () => {
        if (!beat) return;

        try {
            setIsUploading(true);
            
            const response = await fetch(`/api/beats/${beatId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stemsUrl: null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression');
            }

            const result = await response.json();
            if (result.success) {
                setBeat(result.data);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Upload des fichiers
    const handleUpload = async () => {
        if (!beat) return;

        try {
            setIsUploading(true);
            setUploadProgress({ preview: 0, master: 0, artwork: 0, stems: 0 });

            const formData = new FormData();

            // Ajout des fichiers
            if (uploadedFiles.preview) formData.append('preview', uploadedFiles.preview);
            if (uploadedFiles.master) formData.append('master', uploadedFiles.master);
            if (uploadedFiles.artwork) formData.append('artwork', uploadedFiles.artwork);
            if (uploadedFiles.stems) formData.append('stems', uploadedFiles.stems);

            // Simulation du progrès d'upload
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => ({
                    preview: Math.min(prev.preview + 10, 100),
                    master: Math.min(prev.master + 8, 100),
                    artwork: Math.min(prev.artwork + 12, 100),
                    stems: Math.min(prev.stems + 15, 100)
                }));
            }, 200);

            const response = await fetch(`/api/beats/${beatId}/files`, {
                method: 'PUT',
                body: formData
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'upload');
            }

            const result = await response.json();

            if (result.success) {
                setBeat(result.data);
                setUploadedFiles({});
                setUploadProgress({ preview: 0, master: 0, artwork: 0, stems: 0 });
                router.push(`/admin/beats/${beatId}`);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
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
                        <p className="text-foreground text-lg">Chargement du beat...</p>
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
                        <h1 className="text-2xl font-bold text-foreground mb-2">Beat non trouvé</h1>
                        <p className="text-muted-foreground mb-6">{error || 'Ce beat n\'existe pas ou a été supprimé'}</p>
                        <Link
                            href="/admin/upload"
                            className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground px-6 py-3 rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour à la gestion
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
                            <TextRewind text={t('admin.editFiles')} />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        >
                            {t('admin.editFilesDescription')}
                        </motion.p>
                    </motion.div>


                    {/* Beat Edit Card */}
                    <BeatEditCard
                        beat={beat}
                        beatId={beatId}
                        uploadedFiles={uploadedFiles}
                        uploadProgress={uploadProgress}
                        isUploading={isUploading}
                        error={error}
                        onFileSelect={handleFileSelect}
                        onRemoveFile={handleRemoveFile}
                        onS3UploadComplete={handleS3UploadComplete}
                        onS3UploadError={handleS3UploadError}
                        onRemoveArtwork={handleRemoveArtwork}
                        onRemoveStems={handleRemoveStems}
                        onUpload={handleUpload}
                    />
                        </div>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
}
