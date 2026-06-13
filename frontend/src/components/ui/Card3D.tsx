// @ts-expect-error no proper types for react-tilt
import { Tilt } from 'react-tilt'
import { useAccessibilityStore } from '@/store'
import { cn } from '@/utils'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function Card3D({ children, className }: Props) {
  const { animations } = useAccessibilityStore()
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  if (animations === 'none' || isTouchDevice) {
    return (
      <div className={cn('rounded-2xl p-5 bg-[var(--bg-card)] border border-white/5 shadow-card', className)}>
        {children}
      </div>
    )
  }

  return (
    <Tilt
      options={{ max: 12, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.15 }}
      className={cn('rounded-2xl', className)}
    >
      <div className="rounded-2xl p-5 bg-[var(--bg-card)] border border-white/5 shadow-card h-full">
        {children}
      </div>
    </Tilt>
  )
}
