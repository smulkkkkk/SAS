import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'

interface Face {
  label: string
  value: string
  path: string
  rotation: [number, number, number]
  position: [number, number, number]
}

const FACES: Face[] = [
  { label: 'Receita',   value: 'R$ 48k', path: '/financial/cashflow',  rotation: [0, 0, 0],                  position: [0, 0, 1.01] },
  { label: 'Despesa',   value: 'R$ 28k', path: '/financial/payables',  rotation: [0, Math.PI, 0],             position: [0, 0, -1.01] },
  { label: 'Lucro',     value: 'R$ 20k', path: '/financial/health',    rotation: [0, Math.PI / 2, 0],         position: [1.01, 0, 0] },
  { label: 'Fluxo',     value: '+R$ 12k',path: '/financial/cashflow',  rotation: [0, -Math.PI / 2, 0],        position: [-1.01, 0, 0] },
  { label: 'Clientes',  value: '50',     path: '/crm/clients',         rotation: [-Math.PI / 2, 0, 0],        position: [0, 1.01, 0] },
  { label: 'Agendados', value: '12',     path: '/scheduling/day',      rotation: [Math.PI / 2, 0, 0],         position: [0, -1.01, 0] },
]

function CubeMesh({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (!paused) {
      groupRef.current.rotation.x += delta * 0.3
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <MeshDistortMaterial
          color="#3B82F6"
          transparent
          opacity={0.6}
          distort={0.05}
          speed={1}
        />
      </mesh>
      {FACES.map((face) => (
        <Text
          key={face.label}
          position={face.position}
          rotation={face.rotation}
          fontSize={0.2}
          color="#E5E7EB"
          anchorX="center"
          anchorY="middle"
        >
          {`${face.label}\n${face.value}`}
        </Text>
      ))}
    </group>
  )
}

export function DataCube3D() {
  const [paused, setPaused] = useState(false)
  const navigate = useNavigate()

  if (!window.WebGLRenderingContext) {
    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {FACES.map((f) => (
          <button key={f.label} onClick={() => navigate(f.path)} className="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-all">
            <p className="text-[var(--text-muted)] text-xs">{f.label}</p>
            <p className="text-[var(--text-primary)] font-bold text-sm">{f.value}</p>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{ width: 280, height: 280 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} color="#3B82F6" intensity={3} />
        <pointLight position={[-4, -4, 4]} color="#8B5CF6" intensity={2} />
        <Suspense fallback={null}>
          <CubeMesh paused={paused} />
        </Suspense>
      </Canvas>
    </div>
  )
}
