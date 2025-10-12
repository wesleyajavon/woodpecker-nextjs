import React from 'react'
import { cn } from '@/lib/utils'

interface StatItemProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatItem({ label, value, icon, trend = 'neutral', className }: StatItemProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-foreground'
  }

  return (
    <div className={cn('flex items-center justify-between py-2', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className={cn('font-medium text-sm', trendColors[trend])}>
        {value}
      </span>
    </div>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div className={cn('space-y-3 sm:space-y-4', className)}>
      {children}
    </div>
  )
}
