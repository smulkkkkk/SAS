import { useRef, useEffect } from 'react'
import { cn } from '@/utils'

interface Props {
  className?: string
  children?: React.ReactNode
}

export function AnimatedBackground({ className, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.35, color: '59, 130, 246' },   // blue
      { x: 0.8, y: 0.6, r: 0.3,  color: '139, 92, 246' },   // purple
      { x: 0.5, y: 0.8, r: 0.25, color: '16, 185, 129' },   // green
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0B1020'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((b, i) => {
        const x = canvas.width  * (b.x + 0.05 * Math.sin(t * 0.3 + i))
        const y = canvas.height * (b.y + 0.05 * Math.cos(t * 0.2 + i))
        const r = Math.min(canvas.width, canvas.height) * b.r
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, `rgba(${b.color}, 0.18)`)
        grad.addColorStop(1, `rgba(${b.color}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      t += 0.01
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
