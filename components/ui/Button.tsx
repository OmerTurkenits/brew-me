'use client'

import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  }

  const variants = {
    primary: 'bg-brand-dark text-amber-text hover:opacity-90',
    secondary: 'border border-border-line text-brand-dark bg-transparent hover:bg-warm-tint',
    ghost: 'text-brand-dark bg-transparent hover:bg-warm-tint',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
