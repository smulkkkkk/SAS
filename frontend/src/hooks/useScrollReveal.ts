// frontend/src/hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAccessibilityStore } from '@/store'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal<T extends HTMLElement>(
  options?: { y?: number; duration?: number; stagger?: number }
) {
  const ref = useRef<T>(null)
  const { animations } = useAccessibilityStore()

  useEffect(() => {
    if (!ref.current || animations === 'none') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const els = ref.current.querySelectorAll('[data-reveal]')
    if (els.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(els,
        { opacity: 0, y: options?.y ?? 24 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.6,
          stagger: options?.stagger ?? 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [animations, options?.y, options?.duration, options?.stagger])

  return ref
}
