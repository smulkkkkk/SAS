// frontend/src/components/inspira/BorderBeam.tsx
import { cn } from '@/utils'

interface Props {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  colorFrom = 'var(--accent-blue)',
  colorTo = 'var(--accent-purple)',
}: Props) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
      style={{
        background: `
          linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
          conic-gradient(
            from calc(var(--beam-angle, 0deg) - 90deg),
            transparent 0deg,
            ${colorFrom} 60deg,
            ${colorTo} 120deg,
            transparent 180deg
          ) border-box
        `,
        border: '1px solid transparent',
        animation: `beam-rotate ${duration}s linear infinite`,
      }}
      // size prop reserved for potential future masking
      data-size={size}
    />
  )
}
