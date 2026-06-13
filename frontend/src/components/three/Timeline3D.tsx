import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import type { Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
}

function TimelineNodes({ transactions }: Props) {
  const nodes = transactions.slice(0, 20).map((t, i) => ({
    position: [i * 1.5 - 14, (Math.random() - 0.5) * 2, 0] as [number, number, number],
    color: t.tipo === 'entrada' ? '#10B981' : '#EF4444',
    size: Math.min(0.3, Math.max(0.05, t.valor / 5000)),
    transaction: t,
  }))

  return (
    <group>
      {nodes.map((n, i) => (
        <group key={i}>
          <Sphere args={[n.size, 16, 16]} position={n.position}>
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.3} />
          </Sphere>
          {i < nodes.length - 1 && (
            <Line points={[n.position, nodes[i + 1].position]} color="rgba(255,255,255,0.15)" lineWidth={1} />
          )}
        </group>
      ))}
    </group>
  )
}

export function Timeline3D({ transactions }: Props) {
  if (!transactions.length) return null
  if (!window.WebGLRenderingContext) return null

  return (
    <div className="h-48 w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 5]} color="#3B82F6" intensity={2} />
        <Suspense fallback={null}>
          <TimelineNodes transactions={transactions} />
        </Suspense>
      </Canvas>
    </div>
  )
}
