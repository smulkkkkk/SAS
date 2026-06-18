// frontend/src/hooks/useLenis.ts
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAccessibilityStore } from '@/store'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis() { return lenisInstance }

export function useLenis() {
  const { animations } = useAccessibilityStore()

  useEffect(() => {
    if (animations === 'none') {
      lenisInstance?.destroy()
      lenisInstance = null
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function onTick(time: number) {
      lenisInstance?.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(onTick)
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [animations])
}
