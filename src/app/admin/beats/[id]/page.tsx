'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  Music,
  Tag,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';
import { Beat } from '@/types/beat';

export default function BeatManagementPage() {
  const params = useParams();
  const router = useRouter();
  const beatId = params?.id as string;
  
  const [beat, setBeat] = useState<Beat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Gestion de la lecture audio
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Ici vous pouvez ajouter la logique de lecture audio
  };

  // Gestion des modifications
  const handleEditChange = (field: keyof Beat, value: string | number | boolean) => {
    // Exclure le prix des modifications inline
    if (field === 'price') {
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/admin/upload"
                className="inline-flex items-center mt-20 gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Link>
              
              <div className="flex items-center gap-3 mt-20">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    
                    <Link
                      href={`/admin/beats/${beatId}/edit`}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Upload className="w-4 h-4" />
                      Modifier les fichiers
                    </Link>
                    
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="text-4xl font-bold bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                  placeholder="Titre du beat"
                />
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="text-gray-300 text-lg bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full resize-none"
                  placeholder="Description du beat"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-white mb-2">{beat.title}</h1>
                <p className="text-gray-300 text-lg">{beat.description}</p>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Player audio */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Aperçu
                </h3>
                


                {beat.previewUrl && (
                  <audio
                    src={beat.previewUrl}
                    controls
                    preload="metadata"
                    className="w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                )}
              </div>

              {/* Détails du beat */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Détails</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Genre</label>
                    {isEditing ? (
                      <select
                        value={editData.genre || ''}
                        onChange={(e) => handleEditChange('genre', e.target.value)}
                        className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Trap">Trap</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                        <option value="Drill">Drill</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Boom Bap">Boom Bap</option>
                        <option value="Synthwave">Synthwave</option>
                        <option value="R&B">R&B</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                      </select>
                    ) : (
                      <p className="text-white font-medium">{beat.genre}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">BPM</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.bpm || ''}
                        onChange={(e) => handleEditChange('bpm', parseInt(e.target.value))}
                        className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="60"
                        max="200"
                      />
                    ) : (
                      <p className="text-white font-medium">{beat.bpm}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Tonalité</label>
                    {isEditing ? (
                      <select
                        value={editData.key || ''}
                        onChange={(e) => handleEditChange('key', e.target.value)}
                        className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="C">C</option>
                        <option value="C#">C#</option>
                        <option value="D">D</option>
                        <option value="D#">D#</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="F#">F#</option>
                        <option value="G">G</option>
                        <option value="G#">G#</option>
                        <option value="A">A</option>
                        <option value="A#">A#</option>
                        <option value="B">B</option>
                      </select>
                    ) : (
                      <p className="text-white font-medium">{beat.key}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Durée</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.duration || ''}
                        onChange={(e) => handleEditChange('duration', e.target.value)}
                        className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="3:24"
                      />
                    ) : (
                      <p className="text-white font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {beat.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {beat.tags && beat.tags.length > 0 && (
                  <div className="mt-6">
                    <label className="text-sm text-gray-400 mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {beat.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fichiers disponibles */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Fichiers</h3>
                
                <div className="space-y-3">
                  {beat.previewUrl && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Preview (30s)</span>
                      </div>
                      <button
                        onClick={() => {
                          const url = `/api/download/beat/${beat.id}?type=preview&admin=true`
                          window.location.href = url
                        }}
                        className="text-purple-400 hover:text-purple-300"
                        title="Télécharger la preview"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {beat.fullUrl && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-green-400" />
                        <span className="text-white">Master (WAV)</span>
                      </div>
                      <button
                        onClick={() => {
                          const url = `/api/download/beat/${beat.id}?type=master&admin=true`
                          window.location.href = url
                        }}
                        className="text-green-400 hover:text-green-300"
                        title="Télécharger le master"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {beat.stemsUrl && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Stems (ZIP)</span>
                      </div>
                      <button
                        onClick={() => {
                          const url = `/api/download/beat/${beat.id}?type=stems&admin=true`
                          window.location.href = url
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="Télécharger les stems"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Prix et statut */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Prix
                </h3>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {beat.price}€
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {beat.isExclusive ? 'Exclusif' : 'Non-exclusif'}
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-center justify-center gap-4">
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={editData.isExclusive || false}
                          onChange={(e) => handleEditChange('isExclusive', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
                        />
                        Exclusif
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={editData.featured || false}
                          onChange={(e) => handleEditChange('featured', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
                        />
                        En vedette
                      </label>
                    </div>
                  )}
                  
                  {isEditing && <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      💡 Le prix ne peut pas être modifié ici. Contactez l&apos;administrateur pour changer le prix.
                    </p>
                  </div>}
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistiques
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vues</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Téléchargements</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Achats</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Revenus</span>
                    <span className="text-green-400 font-medium">0€</span>
                  </div>
                </div>
              </div>

              {/* Informations système */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informations
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID</span>
                    <span className="text-white font-mono">{beat.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Créé le</span>
                    <span className="text-white">
                      {new Date(beat.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modifié le</span>
                    <span className="text-white">
                      {new Date(beat.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Statut</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      beat.featured 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {beat.featured ? 'En vedette' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
