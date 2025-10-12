'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Music,
    FileAudio,
    X,
    AlertCircle,
    Save,
    Image,
    Archive
} from 'lucide-react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import { S3Upload } from '@/components/S3Upload';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Title, Subtitle } from '@/components/ui/Title';
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
    const handleFileSelect = (field: keyof typeof uploadedFiles, file: File) => {
        setUploadedFiles(prev => ({ ...prev, [field]: file }));
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
            <div className="min-h-screen bg-background pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-8">
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
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8"
                    >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <Link
                                href={`/admin/beats/${beatId}`}
                                className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30 text-sm sm:text-base touch-manipulation"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                {t('common.back')}
                            </Link>
                        </div>

                        <Title variant="page" size="4xl" gradient={true}>
                            {t('admin.editFiles')}
                        </Title>
                        <Subtitle>
                            {beat.title}
                        </Subtitle>
                    </motion.div>

                    {/* Affichage des erreurs */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Section des fichiers */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{t('admin.currentFiles')}</h3>

                            {/* Preview Audio */}
                            <Card variant="elevated">
                                <CardHeader>
                                    <CardTitle icon={<Music className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('upload.previewAudio')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>

                                {beat.previewUrl ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="p-3 bg-card/5 rounded-lg">
                                            <p className="text-foreground text-xs sm:text-sm">{t('admin.currentFileAvailable')}</p>
                                        </div>
                                        <audio
                                            src={beat.previewUrl}
                                            controls
                                            className="w-full"

                                        />
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">{t('admin.noPreviewFile')}</p>
                                )}

                                <div className="mt-3 sm:mt-4">
                                    <input
                                        type="file"
                                        accept=".mp3,.wav,.aiff,.flac"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('preview', e.target.files[0])}
                                        className="hidden"
                                        id="preview-upload"
                                    />
                                    <label
                                        htmlFor="preview-upload"
                                        className="block w-full p-3 sm:p-4 border-2 border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 transition-colors text-center cursor-pointer touch-manipulation"
                                    >
                                        {uploadedFiles.preview ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm truncate">{uploadedFiles.preview.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, preview: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300 touch-manipulation"
                                                >
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm">{t('admin.replacePreviewFile')}</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                </CardContent>
                            </Card>

                            {/* Master Audio */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle icon={<FileAudio className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('upload.masterAudio')} - AWS S3
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>

                                {beat.s3MasterUrl ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                            <div className="flex items-center gap-2">
                                                <FileAudio className="w-4 h-4 text-green-400" />
                                                <p className="text-green-300 text-xs sm:text-sm">{t('admin.masterFileOnS3')}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-foreground text-xs sm:text-sm">
                                                ✅ {t('admin.masterUploadedToS3')} (limite: 500MB)
                                            </p>
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {t('admin.s3Key')}: {beat.s3MasterKey}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-muted-foreground text-sm">{t('admin.noMasterFileOnS3')}</p>
                                        <S3Upload
                                            beatId={beatId}
                                            folder="masters"
                                            onUploadComplete={(result) => handleS3UploadComplete('master', result)}
                                            onUploadError={handleS3UploadError}
                                            maxSize={500} // 500MB
                                            acceptedTypes={['audio/wav', 'audio/aiff', 'audio/flac']}
                                        />
                                    </div>
                                )}
                                </CardContent>
                            </Card>

                        </div>

                        {/* Section Artwork - Troisième colonne */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{t('upload.artwork')}</h3>

                            {/* Artwork */}
                            <Card variant="outlined">
                                <CardHeader>
                                    <CardTitle icon={<Image className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('upload.artwork')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>

                                {beat.artworkUrl ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <p className="text-foreground text-xs sm:text-sm">{t('admin.currentImageAvailable')}</p>
                                            <button
                                                onClick={() => handleRemoveArtwork()}
                                                className="text-red-400 hover:text-red-300 transition-colors touch-manipulation"
                                                title={t('common.remove')}
                                            >
                                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <img
                                                src={beat.artworkUrl}
                                                alt={t('upload.artwork')}
                                                className="w-full h-32 sm:h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm mb-3 sm:mb-4">{t('admin.noCoverImage')}</p>
                                )}

                                <div className="mt-3 sm:mt-4">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('artwork', e.target.files[0])}
                                        className="hidden"
                                        id="artwork-upload"
                                    />
                                    <label
                                        htmlFor="artwork-upload"
                                        className="block w-full p-3 sm:p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer touch-manipulation"
                                    >
                                        {uploadedFiles.artwork ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm truncate">{uploadedFiles.artwork.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, artwork: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300 touch-manipulation"
                                                >
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm">{t('admin.replaceCoverImage')}</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Section des progrès et actions */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Stems */}
                            <Card variant="elevated">
                                <CardHeader>
                                    <CardTitle icon={<Archive className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('upload.stems')} - AWS S3
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {beat.stemsUrl ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <p className="text-foreground text-xs sm:text-sm">{t('admin.stemsFileAvailable')}</p>
                                                <button
                                                    onClick={() => handleRemoveStems()}
                                                    className="text-red-400 hover:text-red-300 transition-colors touch-manipulation"
                                                    title={t('common.remove')}
                                                >
                                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <p className="text-foreground text-xs sm:text-sm">{t('upload.stemsZipOptional')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-muted-foreground text-sm">{t('admin.noStemsFile')}</p>
                                            <S3Upload
                                                beatId={beatId}
                                                folder="stems"
                                                onUploadComplete={(result) => handleS3UploadComplete('stems', result)}
                                                onUploadError={handleS3UploadError}
                                                maxSize={1024} // 1GB
                                                acceptedTypes={['application/zip', 'application/x-zip-compressed']}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-3 sm:mt-4">
                                        <input
                                            type="file"
                                            accept=".zip"
                                            onChange={(e) => e.target.files?.[0] && handleFileSelect('stems', e.target.files[0])}
                                            className="hidden"
                                            id="stems-upload"
                                        />
                                        <label
                                            htmlFor="stems-upload"
                                            className="block w-full p-3 sm:p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer touch-manipulation"
                                        >
                                            {uploadedFiles.stems ? (
                                                <div className="flex items-center gap-2 text-purple-300">
                                                    <Archive className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm truncate">{uploadedFiles.stems.name}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setUploadedFiles(prev => ({ ...prev, stems: undefined }));
                                                        }}
                                                        className="ml-auto text-red-400 hover:text-red-300 touch-manipulation"
                                                    >
                                                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm">{t('admin.replaceStemsFile')}</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle icon={<Upload className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('admin.uploadProgress')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>

                                <div className="space-y-3 sm:space-y-4">
                                    {uploadedFiles.preview && (
                                        <div>
                                            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1">
                                                <span>Preview</span>
                                                <span>{uploadProgress.preview}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.preview}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.master && (
                                        <div>
                                            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1">
                                                <span>Master</span>
                                                <span>{uploadProgress.master}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.master}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.artwork && (
                                        <div>
                                            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1">
                                                <span>Artwork</span>
                                                <span>{uploadProgress.artwork}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.artwork}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.stems && (
                                        <div>
                                            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-1">
                                                <span>Stems</span>
                                                <span>{uploadProgress.stems}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.stems}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                </div>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardHeader>
                                    <CardTitle icon={<Save className="w-4 h-4 sm:w-5 sm:h-5" />}>
                                        {t('admin.actions')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>

                                <div className="space-y-3 sm:space-y-4">
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading || Object.keys(uploadedFiles).length === 0}
                                        className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-muted disabled:to-muted disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none text-sm sm:text-base touch-manipulation"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-primary-foreground"></div>
                                                <span className="text-xs sm:text-sm">{t('admin.uploading')}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="text-xs sm:text-sm">{t('admin.saveFiles')}</span>
                                            </div>
                                        )}
                                    </button>

                                    <Link
                                        href={`/admin/beats/${beatId}`}
                                        className="block w-full px-4 sm:px-6 py-3 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground text-center rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30 text-sm sm:text-base touch-manipulation"
                                    >
                                        {t('common.cancel')}
                                    </Link>
                                </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
}
