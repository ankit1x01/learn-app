import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SimProps } from '../types'

interface ThreeEngineProps extends SimProps {
  children: React.ReactNode
  enablePhysics?: boolean
  cameraPosition?: [number, number, number]
}

export function ThreeEngine({
  children,
  cameraPosition = [0, 0, 10],
}: ThreeEngineProps) {
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio || 1, 2)}
      gl={{ antialias: true }}
      camera={{ position: cameraPosition, fov: 50 }}
      style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-m3-lg)' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={30} />
    </Canvas>
  )
}
