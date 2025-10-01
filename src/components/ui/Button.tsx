import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'card'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  asChild = false,
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground focus:ring-secondary',
    outline: 'border border-border bg-transparent text-foreground hover:bg-card/20 focus:ring-primary',
    ghost: 'bg-transparent text-foreground hover:bg-card/20 focus:ring-primary',
    destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive',
    card: 'bg-card/20 backdrop-blur-lg hover:bg-card/30 text-foreground border border-border/20 hover:border-border/30 focus:ring-primary'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2'
  }
  
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)
  
  if (asChild) {
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      className: cn(classes, child.props?.className),
      ...props
    })
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}










