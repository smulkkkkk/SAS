// frontend/src/components/inspira/MagicCard.tsx
import { useRef, useCallback } from 'react'
import { cn } from '@/utils'

interface Props {
  className?: string
  children: React.ReactNode
  gradientColor?: string
}

export function MagicCard({ className, children, gradientColor = '59, 130, 246' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--mx', '-200px')
    card.style.setProperty('--my', '-200px')
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{
        '--mx': '-200px',
        '--my': '-200px',
        '--gradient-color': gradientColor,
      } as React.CSSProperties}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(300px circle at var(--mx) var(--my), rgba(var(--gradient-color), 0.12), transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
