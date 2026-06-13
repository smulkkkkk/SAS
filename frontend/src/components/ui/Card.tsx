import { cn } from '@/utils'
import type { ReactNode } from 'react'

type Variant = 'default' | 'elevated' | 'glass'

interface Props {
  children: ReactNode
  className?: string
  variant?: Variant
  onClick?: () => void
}

const variants: Record<Variant, string> = {
  default: 'bg-[var(--bg-card)] border border-white/5',
  elevated: 'bg-[var(--bg-elevated)] border border-white/10 shadow-card',
  glass: 'glass',
}

export function Card({ children, className, variant = 'default', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn('rounded-2xl p-5', variants[variant], onClick && 'cursor-pointer', className)}
    >
      {children}
    </div>
  )
}
