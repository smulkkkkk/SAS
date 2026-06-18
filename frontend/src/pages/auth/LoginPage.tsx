import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { AnimatedBackground } from '@/components/inspira/AnimatedBackground'
import { useAuthStore } from '@/store'
import { cn } from '@/utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, accessToken } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (accessToken) { navigate('/dashboard', { replace: true }); return }
    if (!formRef.current) return
    const els = formRef.current.querySelectorAll('.reveal-item')
    gsap.fromTo(els,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    )
  }, [accessToken, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedBackground className="min-h-screen flex items-center justify-center">
      <div ref={formRef} className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="reveal-item mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            PulseFlow
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Gestao que acompanha o ritmo do seu negocio
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            'reveal-item relative rounded-2xl p-8',
            'bg-[var(--bg-card)]/80 backdrop-blur-xl',
            'border border-white/8',
          )}
        >
          <div className="space-y-5">
            {/* E-mail */}
            <div className="reveal-item">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-widest">
                E-MAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm',
                  'bg-white/5 border border-white/10',
                  'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                  'focus:outline-none focus:border-[var(--accent-blue)]/60',
                  'transition-colors duration-200',
                )}
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div className="reveal-item">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-widest">
                SENHA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm',
                  'bg-white/5 border border-white/10',
                  'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                  'focus:outline-none focus:border-[var(--accent-blue)]/60',
                  'transition-colors duration-200',
                )}
                placeholder="••••••••"
              />
            </div>

            {/* Erro */}
            {error && (
              <p className="text-[var(--status-error)] text-sm">{error}</p>
            )}

            {/* Botao */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'reveal-item w-full py-3 rounded-xl text-sm font-semibold',
                'bg-[var(--accent-blue)] text-white',
                'hover:bg-[var(--accent-blue)]/90',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200',
              )}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <p className="reveal-item mt-6 text-center text-xs text-[var(--text-muted)]">
          admin@pulseflow.com · admin123
        </p>
      </div>
    </AnimatedBackground>
  )
}
