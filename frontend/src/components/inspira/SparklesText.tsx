// frontend/src/components/inspira/SparklesText.tsx
import { useEffect, useRef } from 'react'
import { cn } from '@/utils'
import { useAccessibilityStore } from '@/store'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

function generateSparkle(id: number): Sparkle {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 4,
    duration: Math.random() * 800 + 600,
    delay: Math.random() * 400,
  }
}

interface Props {
  children: React.ReactNode
  className?: string
  sparkleCount?: number
}

export function SparklesText({ children, className, sparkleCount = 5 }: Props) {
  const { animations } = useAccessibilityStore()
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (animations === 'none') return
    const container = containerRef.current
    if (!container) return

    const sparkles = Array.from({ length: sparkleCount }, (_, i) => generateSparkle(i))
    const timers: ReturnType<typeof setInterval>[] = []

    sparkles.forEach((s) => {
      const el = document.createElement('span')
      el.style.cssText = `
        position:absolute;
        left:${s.x}%;
        top:${s.y}%;
        width:${s.size}px;
        height:${s.size}px;
        pointer-events:none;
        animation:sparkle-pop ${s.duration}ms ease-in-out ${s.delay}ms infinite;
        transform-origin:center;
      `
      el.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 14l-1.5-5.5L1 7l5.5-1.5L8 0Z" fill="var(--accent-blue)" opacity="0.9"/>
      </svg>`
      container.appendChild(el)

      const timer = setInterval(() => {
        el.style.left = `${Math.random() * 100}%`
        el.style.top = `${Math.random() * 100}%`
      }, s.duration * 2)
      timers.push(timer)
    })

    return () => {
      timers.forEach(clearInterval)
      container.querySelectorAll('span').forEach((el) => el.remove())
    }
  }, [animations, sparkleCount])

  return (
    <span className={cn('relative inline-block', className)}>
      <span ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden />
      <span className="relative">{children}</span>
    </span>
  )
}
