'use client'

// src/shared/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary:   { background: '#6C6BAE', color: '#fff',      border: 'none' },
  secondary: { background: 'transparent', color: '#6C6BAE', border: '1.5px solid #6C6BAE' },
  ghost:     { background: 'transparent', color: '#1D1D1F', border: '1px solid rgba(0,0,0,0.12)' },
  danger:    { background: '#FF3B30', color: '#fff',      border: 'none' },
}

const SIZES: Record<Size, React.CSSProperties> = {
  sm: { fontSize: 11, padding: '4px 10px', borderRadius: 6 },
  md: { fontSize: 13, padding: '7px 16px', borderRadius: 8 },
  lg: { fontSize: 14, padding: '10px 22px', borderRadius: 10 },
}

export function Button({ variant = 'primary', size = 'md', loading = false, children, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || loading
  return (
    <button
      disabled={isDisabled}
      style={{
        fontFamily: 'inherit', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1, transition: 'opacity 0.15s',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        whiteSpace: 'nowrap',
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? '...' : children}
    </button>
  )
}
