'use client'

import { useState, useRef } from 'react'
import { Upload, Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

interface CloudinaryUploadProps {
  beatId: string
  folder: 'previews' | 'artworks'
  onUploadComplete: (result: { url: string; publicId: string }) => void
  onUploadError: (error: string) => void
  maxSize?: number // en MB
  acceptedTypes?: string[]
}

export function CloudinaryUpload({ 
  beatId, 
  folder, 
  onUploadComplete, 
  onUploadError,
  maxSize = 20,
  acceptedTypes = ['image/jpeg', 'image/png', 'audio/wav', 'audio/mpeg']
}: CloudinaryUploadProps) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérification de la taille
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      const error = `Fichier trop volumineux: ${fileSizeMB.toFixed(2)}MB (limite: ${maxSize}MB)`
      setErrorMessage(error)
      setUploadStatus('error')
      onUploadError(error)
      return
    }

    // Vérification du type
    if (!acceptedTypes.includes(file.type)) {
      const error = `Type de fichier non supporté: ${file.type}`
      setErrorMessage(error)
      setUploadStatus('error')
      onUploadError(error)
      return
    }

    await uploadToCloudinary(file)
  }

  const uploadToCloudinary = async (file: File) => {
    setUploading(true)
    setUploadStatus('uploading')
    setProgress(0)
    setErrorMessage('')

    try {
      // Étape 1: Obtenir l'URL signée Cloudinary
      const params = new URLSearchParams({
        fileName: file.name,
        contentType: file.type,
        folder: `beats/${folder}`,
        beatId: beatId,
        fileSize: file.size.toString()
      })

      const presignedResponse = await fetch(`/api/cloudinary/upload?${params}`)
      
      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json()
        throw new Error(errorData.message || 'Erreur lors de la génération de l\'URL signée')
      }

      const presignedData = await presignedResponse.json()
      
      // Étape 2: Upload direct vers Cloudinary avec progression
      setProgress(50) // Progression après obtention de l'URL signée
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('public_id', presignedData.data.publicId)
      formData.append('resource_type', presignedData.data.resourceType)

      const uploadResponse = await fetch(presignedData.data.uploadUrl, {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error(`Erreur lors de l'upload vers Cloudinary: ${uploadResponse.status}`)
      }

      setProgress(100)
      setUploadStatus('success')
      
      // Retourner les données avec la clé Cloudinary et l'URL publique
      onUploadComplete({
        url: presignedData.data.publicUrl,
        publicId: presignedData.data.publicId
      })
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue'
      setErrorMessage(errorMsg)
      setUploadStatus('error')
      onUploadError(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return folder === 'artworks' ? <Image className="w-5 h-5" /> : <Upload className="w-5 h-5" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Upload en cours...'
      case 'success':
        return 'Upload réussi!'
      case 'error':
        return 'Erreur d\'upload'
      default:
        return `Uploader ${folder === 'artworks' ? 'Artwork' : 'Preview'}`
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={triggerFileSelect}
        disabled={uploading}
        className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-lg bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
          <span className="text-xs text-gray-500">
            Max {maxSize}MB • {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
          </span>
        </div>
      </button>

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-500">
            {progress}% - {progress < 50 ? 'Génération URL signée...' : 'Upload vers Cloudinary...'}
          </p>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✅ Fichier uploadé avec succès vers Cloudinary!
          </p>
        </div>
      )}
    </div>
  )
}
