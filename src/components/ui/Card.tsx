import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  children: React.ReactNode
}

export function Card({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}: CardProps) {
  const baseClasses = 'rounded-xl sm:rounded-2xl transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-card/10 backdrop-blur-lg border border-border/20',
    elevated: 'bg-card/20 backdrop-blur-lg border border-border/30 shadow-lg shadow-black/10',
    outlined: 'bg-transparent border-2 border-border/40 backdrop-blur-sm',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20'
  }
  
  const classes = cn(baseClasses, variantClasses[variant], className)
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('p-4 sm:p-6 pb-3 sm:pb-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  icon?: React.ReactNode
}

export function CardTitle({ className = '', children, icon, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2', className)} {...props}>
      {icon && <span className="text-primary">{icon}</span>}
      {children}
    </h3>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-4 sm:p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={cn('p-4 sm:p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}
