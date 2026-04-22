import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, DragControls, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { SimProps } from '../../types'
import { ThreeEngine } from '../../engines/ThreeEngine'

const K = 9e9
const NUM_LINES = 12
const STEP = 0.08
const MAX_STEPS = 120

interface ChargeDef {
  id: number
  q: number
  pos: [number, number, number]
}

function Charge({ id, q, initialPos, onMove }: { id: number, q: number, initialPos: [number,number,number], onMove: (id: number, p: [number,number,number]) => void }) {
  const color = q > 0 ? '#BA1A1A' : '#004A77'
  const sign = q > 0 ? '+' : '−'
  
  if (q === 0) return null

  return (
    <DragControls axisLock="z" onDrag={(l, d, w) => {
      const p = new THREE.Vector3().setFromMatrixPosition(w)
      onMove(id, [p.x, p.y, 0])
    }}>
      <group position={initialPos}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
        <Billboard>
          <Text position={[0, 0.55, 0]} fontSize={0.3} color="#FFFBFE" anchorX="center" outlineWidth={0.02} outlineColor={color}>
            {sign}{Math.abs(q).toFixed(1)} μC
          </Text>
        </Billboard>
      </group>
    </DragControls>
  )
}

function TestCharge({ charges }: { charges: ChargeDef[] }) {
  const [pos, setPos] = useState<[number,number,number]>([0, 1.5, 0])
  const [forceVec, setForceVec] = useState<[number,number,number]>([0, 0, 0])

  useEffect(() => {
    let ex = 0, ey = 0
    for (const c of charges) {
      if (c.q === 0) continue
      const dx = pos[0] - c.pos[0]
      const dy = pos[1] - c.pos[1]
      const r2 = dx*dx + dy*dy
      if (r2 < 0.05) continue
      const r = Math.sqrt(r2)
      const mag = (K * Math.abs(c.q * 1e-6)) / r2
      const sign = c.q > 0 ? 1 : -1
      ex += sign * mag * (dx / r)
      ey += sign * mag * (dy / r)
    }
    setForceVec([ex, ey, 0])
  }, [charges, pos])

  const fMag = Math.sqrt(forceVec[0]*forceVec[0] + forceVec[1]*forceVec[1])
  
  const arrowHelper = useMemo(() => new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xff9900, 0.4, 0.2), [])

  useEffect(() => {
    if (fMag < 1e-4) {
      arrowHelper.visible = false
      return
    }
    arrowHelper.visible = true
    const dir = new THREE.Vector3(forceVec[0], forceVec[1], 0).normalize()
    const length = Math.min(3.5, Math.max(0.6, fMag * 0.000005))
    arrowHelper.setDirection(dir)
    arrowHelper.setLength(length, 0.4, 0.2)
  }, [forceVec, fMag, arrowHelper])

  return (
    <DragControls axisLock="z" onDrag={(l, d, w) => {
      const p = new THREE.Vector3().setFromMatrixPosition(w)
      setPos([p.x, p.y, 0])
    }}>
      <group position={pos}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#E6B800" emissive="#B38600" emissiveIntensity={0.5} />
        </mesh>
        <Billboard>
          <Text position={[0, -0.4, 0]} fontSize={0.25} color="#E6B800" outlineWidth={0.015} outlineColor="#000000">
            Test (+1μC)
          </Text>
          <Text position={[0, -0.7, 0]} fontSize={0.20} color="#E6B800" outlineWidth={0.015} outlineColor="#000000">
            {fMag > 1000 ? `F = ${(fMag / 1000).toFixed(1)} kN` : `F = ${fMag.toFixed(1)} N`}
          </Text>
        </Billboard>
        <primitive object={arrowHelper} />
      </group>
    </DragControls>
  )
}

function FieldLines({ charges }: { charges: ChargeDef[] }) {
  const geomRef = useRef<THREE.BufferGeometry>(null)

  useEffect(() => {
    if (!geomRef.current) return
    const result: number[] = []
    const startCharges = charges.filter(c => c.q > 0)
    
    for (const sc of startCharges) {
      for (let i = 0; i < NUM_LINES; i++) {
        const theta = (2 * Math.PI * i) / NUM_LINES
        const pts: THREE.Vector3[] = []
        let pos = new THREE.Vector3(
          sc.pos[0] + 0.35 * Math.cos(theta),
          sc.pos[1] + 0.35 * Math.sin(theta),
          0
        )

        for (let s = 0; s < MAX_STEPS; s++) {
          pts.push(pos.clone())
          if (pos.length() > 8) break

          let ex = 0, ey = 0
          let hitCharge = false
          for (const ch of charges) {
            if (ch.q === 0) continue
            const dx = pos.x - ch.pos[0]
            const dy = pos.y - ch.pos[1]
            const r2 = dx * dx + dy * dy
            if (r2 < 0.12) { hitCharge = true; break }
            const r = Math.sqrt(r2)
            const mag = (K * Math.abs(ch.q * 1e-6)) / r2
            const sign = ch.q > 0 ? 1 : -1
            ex += sign * mag * (dx / r)
            ey += sign * mag * (dy / r)
          }
          if (hitCharge) break

          const mag = Math.sqrt(ex * ex + ey * ey)
          if (mag < 1e-8) break
          pos.add(new THREE.Vector3((ex / mag) * STEP, (ey / mag) * STEP, 0))
        }
        
        if (pts.length > 2) {
          // create line segments
          for (let j = 0; j < pts.length - 1; j++) {
            result.push(pts[j].x, pts[j].y, pts[j].z)
            result.push(pts[j+1].x, pts[j+1].y, pts[j+1].z)
          }
        }
      }
    }

    geomRef.current.setAttribute('position', new THREE.Float32BufferAttribute(result, 3))
  }, [charges])

  return (
    <lineSegments>
      <bufferGeometry ref={geomRef} />
      <lineBasicMaterial color="#6750A4" opacity={0.35} transparent />
    </lineSegments>
  )
}

function Scene({ q1, q2, q3, q4 }: { q1: number, q2: number, q3: number, q4: number }) {
  const [positions, setPositions] = useState<Record<number, [number,number,number]>>({
    1: [-2, 0, 0],
    2: [2, 0, 0],
    3: [0, 2, 0],
    4: [0, -2, 0]
  })

  const handleMove = useCallback((id: number, pos: [number,number,number]) => {
    setPositions(prev => ({ ...prev, [id]: pos }))
  }, [])

  const charges: ChargeDef[] = useMemo(() => [
    { id: 1, q: q1, pos: positions[1] },
    { id: 2, q: q2, pos: positions[2] },
    { id: 3, q: q3, pos: positions[3] },
    { id: 4, q: q4, pos: positions[4] }
  ], [q1, q2, q3, q4, positions])

  return (
    <>
      {charges.map(c => <Charge key={c.id} id={c.id} q={c.q} initialPos={c.pos} onMove={handleMove} />)}
      <FieldLines charges={charges} />
      <TestCharge charges={charges} />
      <gridHelper args={[20, 20, '#CAC4D0', '#E7E0EC']} rotation={[Math.PI / 2, 0, 0]} />
    </>
  )
}

export function ElectricFieldSim(props: SimProps) {
  const q1 = props.controls['q1'] ?? 2
  const q2 = props.controls['q2'] ?? -2
  const q3 = props.controls['q3'] ?? 0
  const q4 = props.controls['q4'] ?? 0

  return (
    <ThreeEngine {...props} cameraPosition={[0, 0, 10]}>
      <Scene q1={q1} q2={q2} q3={q3} q4={q4} />
    </ThreeEngine>
  )
}
