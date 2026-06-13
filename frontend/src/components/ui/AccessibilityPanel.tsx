import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccessibilityStore } from '@/store'
import { cn } from '@/utils'
import type { Theme, FontFamily, FontSize, AnimationLevel, Density } from '@/types'

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const { theme, fontFamily, fontSize, density, animations, setTheme, setFontFamily, setFontSize, setDensity, setAnimations } = useAccessibilityStore()

  const themes: { value: Theme; label: string }[] = [
    { value: 'dark', label: 'Escuro' },
    { value: 'light', label: 'Claro' },
    { value: 'contrast', label: 'Contraste' },
  ]
  const fonts: { value: FontFamily; label: string }[] = [
    { value: 'inter', label: 'Inter' },
    { value: 'lexend', label: 'Lexend' },
    { value: 'mono', label: 'Mono' },
  ]
  const sizes: FontSize[] = [12, 14, 16, 18, 20]
  const densities: { value: Density; label: string }[] = [
    { value: 'compact', label: 'Compacto' },
    { value: 'normal', label: 'Normal' },
    { value: 'comfortable', label: 'Confortável' },
  ]
  const animLevels: { value: AnimationLevel; label: string }[] = [
    { value: 'full', label: 'Completas' },
    { value: 'reduced', label: 'Reduzidas' },
    { value: 'none', label: 'Sem animações' },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-[90]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mb-3 w-72 bg-[var(--bg-elevated)] border border-white/10 rounded-2xl shadow-card p-4 space-y-4"
          >
            <h3 className="text-[var(--text-primary)] font-semibold text-sm">Acessibilidade</h3>

            <div>
              <p className="text-[var(--text-muted)] text-xs mb-2">Tema</p>
              <div className="flex gap-1.5">
                {themes.map((t) => (
                  <button key={t.value} onClick={() => setTheme(t.value)}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      theme === t.value ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)] hover:border-white/20'
                    )}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[var(--text-muted)] text-xs mb-2">Tamanho da fonte</p>
              <div className="flex gap-1">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs border transition-all',
                      fontSize === s ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)] hover:border-white/20'
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[var(--text-muted)] text-xs mb-2">Tipografia</p>
              <div className="flex gap-1.5">
                {fonts.map((f) => (
                  <button key={f.value} onClick={() => setFontFamily(f.value)}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs border transition-all',
                      fontFamily === f.value ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)] hover:border-white/20'
                    )}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[var(--text-muted)] text-xs mb-2">Animações</p>
              <div className="flex flex-col gap-1">
                {animLevels.map((a) => (
                  <button key={a.value} onClick={() => setAnimations(a.value)}
                    className={cn('w-full py-1.5 rounded-lg text-xs border text-left px-2 transition-all',
                      animations === a.value ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)] hover:border-white/20'
                    )}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[var(--text-muted)] text-xs mb-2">Densidade</p>
              <div className="flex gap-1.5">
                {densities.map((d) => (
                  <button key={d.value} onClick={() => setDensity(d.value)}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs border transition-all',
                      density === d.value ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white' : 'border-white/10 text-[var(--text-muted)] hover:border-white/20'
                    )}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold text-sm shadow-glow flex items-center justify-center"
      >
        A
      </motion.button>
    </div>
  )
}
