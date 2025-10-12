import React from 'react'
import { Download, Music, Archive, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileItemProps {
  name: string
  type: 'preview' | 'master' | 'stems' | 'artwork'
  url?: string
  onDownload?: () => void
  className?: string
}

const fileIcons = {
  preview: Music,
  master: Music,
  stems: Archive,
  artwork: Image
}

const fileColors = {
  preview: 'text-primary',
  master: 'text-green-400',
  stems: 'text-blue-400',
  artwork: 'text-purple-400'
}

export function FileItem({ name, type, url, onDownload, className }: FileItemProps) {
  const Icon = fileIcons[type]
  const colorClass = fileColors[type]

  return (
    <div className={cn('flex items-center justify-between p-3 bg-card/5 rounded-lg hover:bg-card/10 transition-colors', className)}>
      <div className="flex items-center gap-3">
        <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', colorClass)} />
        <span className="text-foreground text-sm sm:text-base">{name}</span>
      </div>
      {(url || onDownload) && (
        <button
          onClick={onDownload}
          className={cn('hover:opacity-80 transition-opacity touch-manipulation', colorClass)}
          title={`Télécharger ${name}`}
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

interface FilesListProps {
  children: React.ReactNode
  className?: string
}

export function FilesList({ children, className }: FilesListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  )
}
