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
import { DottedSurface } from '@/components/ui/dotted-surface';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
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
      <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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

        <div className="max-w-6xl mx-auto py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/admin/upload"
                className="inline-flex items-center mt-20 gap-2 bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground px-4 py-2 rounded-lg transition-all duration-300 border border-border/20 hover:border-border/30"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Link>
              
              <div className="flex items-center gap-3 mt-20">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      variant="primary"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Edit className="w-4 h-4" />
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    
                    <Button
                      onClick={handleCancel}
                      disabled={isSaving}
                      variant="card"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="card"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>
                    
                    <Button
                      asChild
                      variant="primary"
                    >
                      <Link href={`/admin/beats/${beatId}/edit`}>
                        <Upload className="w-4 h-4" />
                        Modifier les fichiers
                      </Link>
                    </Button>
                    
                    <Button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
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
                  className="text-4xl font-bold bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  placeholder="Titre du beat"
                />
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="text-lg bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full resize-none"
                  placeholder="Description du beat"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-foreground mb-2">{beat.title}</h1>
                <p className="text-muted-foreground text-lg">{beat.description}</p>
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
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
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
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4">Détails</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Genre</label>
                    {isEditing ? (
                      <select
                        value={editData.genre || ''}
                        onChange={(e) => handleEditChange('genre', e.target.value)}
                        className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <p className="text-foreground font-medium">{beat.genre}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">BPM</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.bpm || ''}
                        onChange={(e) => handleEditChange('bpm', parseInt(e.target.value))}
                        className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        min="60"
                        max="200"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{beat.bpm}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Tonalité</label>
                    {isEditing ? (
                      <select
                        value={editData.key || ''}
                        onChange={(e) => handleEditChange('key', e.target.value)}
                        className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <p className="text-foreground font-medium">{beat.key}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Durée</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.duration || ''}
                        onChange={(e) => handleEditChange('duration', e.target.value)}
                        className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="3:24"
                      />
                    ) : (
                      <p className="text-foreground font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {beat.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <label className="text-sm text-muted-foreground mb-2 block">Tags</label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {(editData.tags || []).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              onClick={() => {
                                const newTags = [...(editData.tags || [])];
                                newTags.splice(index, 1);
                                handleEditChange('tags', newTags);
                              }}
                              className="ml-1 text-primary/70 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ajouter un tag..."
                          className="flex-1 p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const newTag = input.value.trim();
                              if (newTag && !(editData.tags || []).includes(newTag)) {
                                const newTags = [...(editData.tags || []), newTag];
                                handleEditChange('tags', newTags);
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                            const newTag = input.value.trim();
                            if (newTag && !(editData.tags || []).includes(newTag)) {
                              const newTags = [...(editData.tags || []), newTag];
                              handleEditChange('tags', newTags);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Appuyez sur Entrée ou cliquez sur &quot;Ajouter&quot; pour ajouter un tag
                      </p>
                    </div>
                  ) : (
                    beat.tags && beat.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {beat.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucun tag</p>
                    )
                  )}
                </div>
              </div>

              {/* Fichiers disponibles */}
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4">Fichiers</h3>
                
                <div className="space-y-3">
                  {beat.previewUrl && (
                    <div className="flex items-center justify-between p-3 bg-card/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-primary" />
                        <span className="text-foreground">Preview (30s)</span>
                      </div>
                      <button
                        onClick={() => {
                          const url = `/api/download/beat/${beat.id}?type=preview&admin=true`
                          window.location.href = url
                        }}
                        className="text-primary hover:text-primary/80"
                        title="Télécharger la preview"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {beat.fullUrl && (
                    <div className="flex items-center justify-between p-3 bg-card/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-green-400" />
                        <span className="text-foreground">Master (WAV)</span>
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
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Prix
                </h3>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground mb-2">
                    WAV: {beat.wavLeasePrice}€
                  </div>
                  <div className="text-lg font-bold text-foreground mb-2">
                    Trackout: {beat.trackoutLeasePrice}€
                  </div>
                  <div className="text-lg font-bold text-foreground mb-2">
                    Unlimited: {beat.unlimitedLeasePrice}€
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {beat.isExclusive ? 'Exclusif' : 'Non-exclusif'}
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-center justify-center gap-4">
                      <label className="flex items-center gap-2 text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={editData.isExclusive || false}
                          onChange={(e) => handleEditChange('isExclusive', e.target.checked)}
                          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                        />
                        Exclusif
                      </label>
                      <label className="flex items-center gap-2 text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={editData.featured || false}
                          onChange={(e) => handleEditChange('featured', e.target.checked)}
                          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
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
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistiques
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vues</span>
                    <span className="text-foreground font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Téléchargements</span>
                    <span className="text-foreground font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Achats</span>
                    <span className="text-foreground font-medium">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Revenus</span>
                    <span className="text-green-400 font-medium">0€</span>
                  </div>
                </div>
              </div>

              {/* Informations système */}
              <div className="bg-card/10 backdrop-blur-lg rounded-2xl p-6 border border-border/20">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informations
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="text-foreground font-mono">{beat.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le</span>
                    <span className="text-foreground">
                      {new Date(beat.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modifié le</span>
                    <span className="text-foreground">
                      {new Date(beat.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
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
