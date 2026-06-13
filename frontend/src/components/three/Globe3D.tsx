import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

function GlobeMesh() {
  const meshRef = useRef<Mesh>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.15
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1.2, 48, 48]}>
        <MeshDistortMaterial
          color="#1D4ED8"
          transparent
          opacity={0.8}
          distort={0.15}
          speed={1.5}
          wireframe={false}
        />
      </Sphere>
      <Sphere args={[1.25, 48, 48]}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.05} wireframe />
      </Sphere>
    </group>
  )
}

export function Globe3D() {
  if (!window.WebGLRenderingContext) {
    return <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">🌍 Mapa global</div>
  }

  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} color="#3B82F6" intensity={3} />
      <pointLight position={[-3, -3, 3]} color="#8B5CF6" intensity={2} />
      <Suspense fallback={null}>
        <GlobeMesh />
      </Suspense>
    </Canvas>
  )
}
