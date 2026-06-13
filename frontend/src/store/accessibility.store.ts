import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, FontFamily, FontSize, Density, AnimationLevel } from '@/types'

interface AccessibilityState {
  theme: Theme
  fontFamily: FontFamily
  fontSize: FontSize
  density: Density
  animations: AnimationLevel
  setTheme: (theme: Theme) => void
  setFontFamily: (family: FontFamily) => void
  setFontSize: (size: FontSize) => void
  setDensity: (density: Density) => void
  setAnimations: (level: AnimationLevel) => void
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-contrast')
  if (theme === 'light') root.classList.add('theme-light')
  if (theme === 'contrast') root.classList.add('theme-contrast')
}

function applyFont(family: FontFamily) {
  const families = { inter: 'Inter, system-ui, sans-serif', lexend: 'Lexend, sans-serif', mono: 'JetBrains Mono, monospace' }
  document.documentElement.style.setProperty('--font-family', families[family])
}

function applyFontSize(size: FontSize) {
  document.documentElement.style.setProperty('--font-size-base', `${size}px`)
}

const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontFamily: 'inter',
      fontSize: 16,
      density: 'normal',
      animations: prefersReduced ? 'reduced' : 'full',
      setTheme: (theme) => { applyTheme(theme); set({ theme }) },
      setFontFamily: (fontFamily) => { applyFont(fontFamily); set({ fontFamily }) },
      setFontSize: (fontSize) => { applyFontSize(fontSize); set({ fontSize }) },
      setDensity: (density) => set({ density }),
      setAnimations: (animations) => set({ animations }),
    }),
    {
      name: 'pulseflow-a11y',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
          applyFont(state.fontFamily)
          applyFontSize(state.fontSize)
        }
      },
    }
  )
)
