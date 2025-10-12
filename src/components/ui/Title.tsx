import React from 'react'
import { cn } from '@/lib/utils'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'hero' | 'page' | 'section' | 'card'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  gradient?: boolean
  children: React.ReactNode
}

export function Title({ 
  variant = 'page', 
  size = 'md',
  gradient = false,
  className = '', 
  children, 
  ...props 
}: TitleProps) {
  const baseClasses = 'font-bold text-foreground leading-tight'
  
  const variantClasses = {
    hero: 'text-center mb-6',
    page: 'mb-4',
    section: 'mb-3',
    card: 'mb-2'
  }
  
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl',
    '3xl': 'text-5xl sm:text-6xl',
    '4xl': 'text-6xl sm:text-7xl'
  }
  
  const gradientClasses = gradient 
    ? 'bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent'
    : ''
  
  const classes = cn(
    baseClasses, 
    variantClasses[variant], 
    sizeClasses[size], 
    gradientClasses,
    className
  )
  
  const Tag = variant === 'hero' ? 'h1' : variant === 'page' ? 'h1' : 'h2'
  
  return React.createElement(Tag, { className: classes, ...props }, children)
}

interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

export function Subtitle({ className = '', children, ...props }: SubtitleProps) {
  return (
    <p className={cn('text-muted-foreground text-base sm:text-lg leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}
