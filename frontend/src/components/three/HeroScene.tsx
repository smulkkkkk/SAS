import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import type { Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const PARTICLE_OPTIONS = {
  background: { color: { value: 'transparent' } },
  particles: {
    color: { value: ['#3B82F6', '#8B5CF6', '#10B981'] },
    number: { value: 60 },
    opacity: { value: { min: 0.1, max: 0.4 } },
    size: { value: { min: 1, max: 3 } },
    move: { enable: true, speed: 0.6 },
    links: { enable: true, color: '#3B82F6', opacity: 0.1, distance: 120 },
  },
} as const

function FloatingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere args={[0.4 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial color={color} transparent opacity={0.6} distort={0.4} speed={2} />
      </Sphere>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} color="#3B82F6" intensity={2} />
      <pointLight position={[-4, -4, 4]} color="#8B5CF6" intensity={2} />
      <Stars radius={30} depth={15} count={800} factor={2} fade />
      <FloatingOrb position={[-2, 1, 0]} color="#3B82F6" scale={1.2} />
      <FloatingOrb position={[2, -0.5, -1]} color="#8B5CF6" />
      <FloatingOrb position={[0, 2, -2]} color="#10B981" scale={0.6} />
    </>
  )
}

interface Props {
  onComplete: () => void
}

function HeroContent({ onComplete }: Props) {
  const [visible, setVisible] = useState(true)
  const escTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, 3000)
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false)
        escTimerRef.current = setTimeout(onComplete, 300)
      }
    }
    window.addEventListener('keydown', keyHandler)
    return () => {
      clearTimeout(timer)
      if (escTimerRef.current) clearTimeout(escTimerRef.current)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-[#0B1020] flex flex-col items-center justify-center overflow-hidden"
        >
          <Particles
            id="hero-particles"
            className="absolute inset-0"
            options={PARTICLE_OPTIONS}
          />

          <div className="relative h-64 w-full max-w-lg">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center z-10"
          >
            <h1 className="text-5xl font-bold text-gradient mb-2">PulseFlow</h1>
            <p className="text-[var(--text-muted)] text-sm">Business Suite · Carregando...</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 text-[var(--text-muted)] text-xs"
          >
            Pressione ESC para pular
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function HeroScene({ onComplete }: Props) {
  const initEngine = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <ParticlesProvider init={initEngine}>
      <HeroContent onComplete={onComplete} />
    </ParticlesProvider>
  )
}
