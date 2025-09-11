'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Upload,
    Music,
    Image,
    FileAudio,
    X,
    AlertCircle,
    Check,
    Save
} from 'lucide-react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import { Beat } from '@/types/beat';

export default function BeatEditPage() {
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
        stems: number;
        artwork: number;
    }>({
        preview: 0,
        master: 0,
        stems: 0,
        artwork: 0
    });
    const [uploadedFiles, setUploadedFiles] = useState<{
        preview?: File;
        master?: File;
        stems?: File;
        artwork?: File;
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

    // Upload des fichiers
    const handleUpload = async () => {
        if (!beat) return;

        try {
            setIsUploading(true);
            setUploadProgress({ preview: 0, master: 0, stems: 0, artwork: 0 });

            const formData = new FormData();

            // Ajout des fichiers
            if (uploadedFiles.preview) formData.append('preview', uploadedFiles.preview);
            if (uploadedFiles.master) formData.append('master', uploadedFiles.master);
            if (uploadedFiles.stems) formData.append('stems', uploadedFiles.stems);
            if (uploadedFiles.artwork) formData.append('artwork', uploadedFiles.artwork);

            // Simulation du progrès d'upload
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => ({
                    preview: Math.min(prev.preview + 10, 100),
                    master: Math.min(prev.master + 8, 100),
                    stems: Math.min(prev.stems + 5, 100),
                    artwork: Math.min(prev.artwork + 12, 100)
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
                setUploadProgress({ preview: 0, master: 0, stems: 0, artwork: 0 });
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
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white text-lg">Chargement du beat...</p>
                    </motion.div>
                </div>
            </AdminRoute>
        );
    }

    if (error || !beat) {
        return (
            <AdminRoute>
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md mx-auto p-6"
                    >
                        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Beat non trouvé</h1>
                        <p className="text-gray-300 mb-6">{error || 'Ce beat n\'existe pas ou a été supprimé'}</p>
                        <Link
                            href="/admin/upload"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30"
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href={`/admin/beats/${beatId}`}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Retour
                            </Link>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2">Modifier les fichiers</h1>
                        <p className="text-gray-300 text-lg">{beat.title}</p>
                    </motion.div>

                    {/* Affichage des erreurs */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Section des fichiers */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Fichiers actuels</h3>

                            {/* Preview Audio */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Music className="w-5 h-5" />
                                    Preview Audio
                                </h4>

                                {beat.previewUrl ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-white text-sm">Fichier actuel disponible</p>
                                        </div>
                                        <audio
                                            src={beat.previewUrl}
                                            controls
                                            className="w-full"
                                            
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400">Aucun fichier preview</p>
                                )}

                                <div className="mt-4">
                                    <input
                                        type="file"
                                        accept=".mp3,.wav,.aiff,.flac"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('preview', e.target.files[0])}
                                        className="hidden"
                                        id="preview-upload"
                                    />
                                    <label
                                        htmlFor="preview-upload"
                                        className="block w-full p-4 border-2 border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 transition-colors text-center cursor-pointer"
                                    >
                                        {uploadedFiles.preview ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <Music className="w-5 h-5" />
                                                <span>{uploadedFiles.preview.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, preview: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-5 h-5" />
                                                <span>Remplacer le fichier preview</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Master Audio */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileAudio className="w-5 h-5" />
                                    Master Audio
                                </h4>

                                {beat.fullUrl ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-white text-sm">Fichier actuel disponible</p>
                                        </div>
                                        <audio
                                            src={beat.fullUrl}
                                            controls
                                            className="w-full"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mb-4">Aucun fichier master</p>
                                )}

                                <div>
                                    <input
                                        type="file"
                                        accept=".wav,.aiff,.flac"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('master', e.target.files[0])}
                                        className="hidden"
                                        id="master-upload"
                                    />
                                    <label
                                        htmlFor="master-upload"
                                        className="block w-full p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer"
                                    >
                                        {uploadedFiles.master ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <FileAudio className="w-5 h-5" />
                                                <span>{uploadedFiles.master.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, master: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-5 h-5" />
                                                <span>Remplacer le fichier master</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Stems */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileAudio className="w-5 h-5" />
                                    Stems
                                </h4>

                                {beat.stemsUrl ? (
                                    <div className="p-3 bg-white/5 rounded-lg mb-4">
                                        <p className="text-white text-sm">Archive stems disponible</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mb-4">Aucun fichier stems</p>
                                )}

                                <div>
                                    <input
                                        type="file"
                                        accept=".zip,.rar"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('stems', e.target.files[0])}
                                        className="hidden"
                                        id="stems-upload"
                                    />
                                    <label
                                        htmlFor="stems-upload"
                                        className="block w-full p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer"
                                    >
                                        {uploadedFiles.stems ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <FileAudio className="w-5 h-5" />
                                                <span>{uploadedFiles.stems.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, stems: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-5 h-5" />
                                                <span>Remplacer l'archive stems</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Artwork
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Image className="w-5 h-5" />
                                    Artwork
                                </h4>

                                {beat.artworkUrl ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-white text-sm">Image artwork disponible</p>
                                        </div>
                                        <img
                                            src={beat.artworkUrl}
                                            alt="Artwork actuel"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mb-4">Aucune image artwork</p>
                                )}

                                <div className="mt-4">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect('artwork', e.target.files[0])}
                                        className="hidden"
                                        id="artwork-upload"
                                    />
                                    <label
                                        htmlFor="artwork-upload"
                                        className="block w-full p-4 border-2 border-dashed border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-colors text-center cursor-pointer"
                                    >
                                        {uploadedFiles.artwork ? (
                                            <div className="flex items-center gap-2 text-purple-300">
                                                <Image className="w-5 h-5" />
                                                <span>{uploadedFiles.artwork.name}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setUploadedFiles(prev => ({ ...prev, artwork: undefined }));
                                                    }}
                                                    className="ml-auto text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Upload className="w-5 h-5" />
                                                <span>Remplacer l'image artwork</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div> */}
                        </div>

                        {/* Section des progrès et actions */}
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-white mb-4">Progrès d'upload</h3>

                                <div className="space-y-4">
                                    {uploadedFiles.preview && (
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                                                <span>Preview</span>
                                                <span>{uploadProgress.preview}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.preview}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.master && (
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                                                <span>Master</span>
                                                <span>{uploadProgress.master}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.master}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.stems && (
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                                                <span>Stems</span>
                                                <span>{uploadProgress.stems}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.stems}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {uploadedFiles.artwork && (
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                                                <span>Artwork</span>
                                                <span>{uploadProgress.artwork}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress.artwork}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading || Object.keys(uploadedFiles).length === 0}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Upload en cours...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Save className="w-5 h-5" />
                                                Sauvegarder les fichiers
                                            </div>
                                        )}
                                    </button>

                                    <Link
                                        href={`/admin/beats/${beatId}`}
                                        className="block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
}
