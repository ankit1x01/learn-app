import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const COLORS = {
  positive: '#BA1A1A', // Red for positive charge
  negative: '#004A77', // Blue for negative charge
  neutral: '#CAC4D0',
  target: '#146C2E',
  background: '#FFFBFE',
  text: '#1D192B'
};

const K_CONSTANT = 50; // Scaled up Coulomb constant for visual gameplay
const TEST_Q = 1; // +1 test charge

function FixedCharge({ position, q }: { position: [number, number, number], q: number }) {
  const color = q > 0 ? COLORS.positive : q < 0 ? COLORS.negative : COLORS.neutral;
  const sign = q > 0 ? '+' : q < 0 ? '-' : '';
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={Math.abs(q) * 0.1} />
      </mesh>
      <Text position={[0, 0.7, 0]} fontSize={0.4} color={COLORS.text}>
        {`${sign}${Math.abs(q)} Q`}
      </Text>
    </group>
  );
}

function TestCharge({ q1, q2, fireKey, onHit, active }: any) {
  const rbRef = useRef<RapierRigidBody>(null);
  
  useFrame((state, delta) => {
    if (!rbRef.current || !active) return;
    
    // Position of test charge
    const pos = rbRef.current.translation();
    const pPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    
    let totalForce = new THREE.Vector3(0, 0, 0);

    // Calculate force from Q1 (at x=-3, z=0)
    if (q1 !== 0) {
      const q1Pos = new THREE.Vector3(-3, 0, 0);
      const distSq1 = Math.max(pPos.distanceToSquared(q1Pos), 0.5); // protect from singularity
      const forceMag1 = (K_CONSTANT * TEST_Q * q1) / distSq1;
      const dir1 = new THREE.Vector3().subVectors(pPos, q1Pos).normalize();
      totalForce.add(dir1.multiplyScalar(forceMag1));
    }

    // Calculate force from Q2 (at x=3, z=0)
    if (q2 !== 0) {
      const q2Pos = new THREE.Vector3(3, 0, 0);
      const distSq2 = Math.max(pPos.distanceToSquared(q2Pos), 0.5);
      const forceMag2 = (K_CONSTANT * TEST_Q * q2) / distSq2;
      const dir2 = new THREE.Vector3().subVectors(pPos, q2Pos).normalize();
      totalForce.add(dir2.multiplyScalar(forceMag2));
    }
    
    // Apply continuous force (multiply by delta for frame-rate independence)
    const impulse = totalForce.multiplyScalar(delta);
    rbRef.current.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
  });

  return (
    <RigidBody
      ref={rbRef}
      colliders="ball"
      position={[0, 0, 6]}
      linearVelocity={[0, 0, -4]} // initial push forward
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'target') {
          onHit(true);
        } else if (other.rigidBodyObject?.name === 'wall') {
          onHit(false);
        }
      }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={COLORS.positive} />
      </mesh>
      {/* Velocity trail or glowing effect could be added here */}
    </RigidBody>
  );
}

function Scene({ q1, q2, fireKey, setHitStatus, active }: any) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <Physics gravity={[0, 0, 0]}> {/* No gravity! Strictly electric forces */}
        
        {/* Fixed Charges */}
        <FixedCharge position={[-3, 0, 0]} q={q1} />
        <FixedCharge position={[3, 0, 0]} q={q2} />

        {/* The Dynamic Test Charge (+1) */}
        <TestCharge key={fireKey} q1={q1} q2={q2} fireKey={fireKey} onHit={setHitStatus} active={active} />

        {/* Target Zone */}
        <RigidBody name="target" type="fixed" position={[0, 0, -6]}>
          <mesh receiveShadow>
            <boxGeometry args={[4, 1, 1]} />
            <meshStandardMaterial color={COLORS.target} opacity={0.8} transparent />
          </mesh>
          <Text position={[0, 0.6, 0]} fontSize={0.6} color={COLORS.text} rotation={[-Math.PI/2, 0, 0]}>
            TARGET
          </Text>
        </RigidBody>

        {/* Containment Walls (to detect miss) */}
        <RigidBody name="wall" type="fixed" position={[0, 0, -8]}>
          <mesh><boxGeometry args={[20, 2, 1]} /><meshBasicMaterial visible={false} /></mesh>
        </RigidBody>
        <RigidBody name="wall" type="fixed" position={[-8, 0, 0]}>
          <mesh><boxGeometry args={[1, 2, 20]} /><meshBasicMaterial visible={false} /></mesh>
        </RigidBody>
        <RigidBody name="wall" type="fixed" position={[8, 0, 0]}>
          <mesh><boxGeometry args={[1, 2, 20]} /><meshBasicMaterial visible={false} /></mesh>
        </RigidBody>
      </Physics>
      
      {/* Top-down view */}
      <OrbitControls enableRotate={false} enablePan={false} />
    </>
  );
}

export function CoulombsCollider({ onBack }: { onBack?: () => void }) {
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [fireKey, setFireKey] = useState(0);
  const [active, setActive] = useState(false);
  const [hitStatus, setHitStatus] = useState<boolean | null>(null);

  const fire = () => {
    setHitStatus(null);
    setActive(true);
    setFireKey(prev => prev + 1);
  };

  const stop = () => {
    setActive(false);
    setHitStatus(null);
    setFireKey(prev => prev + 1); // reset position
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFBFE] font-sans pb-12">
      <div className="p-6 text-center z-10 shadow-sm relative bg-[#FFFBFE]">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-4 top-4 bg-[#EADDFF] text-[#21005D] p-2 rounded-full cursor-pointer hover:bg-[#D0BCFF] transition-colors"
          >
            <span className="material-symbols-rounded block text-lg leading-none">arrow_back</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-[#1D192B] mb-2 tracking-tight mt-8">
          Coulomb's Collider
        </h1>
        <p className="text-sm text-[#49454F] max-w-sm mx-auto">
          Fire a <strong>+1 Q</strong> test charge through the electric field. Adjust the fixed charges to deflect its path into the Target Zone!
        </p>
      </div>

      <div className="px-6 py-4 bg-white z-10 border-b border-[#CAC4D0] shadow-sm flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Left Charge ($Q_1$): {q1 > 0 ? `+${q1}` : q1}</span>
          </label>
          <input 
            type="range" min="-5" max="5" step="1" 
            value={q1} 
            onChange={(e) => { setQ1(Number(e.target.value)); stop(); }}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Right Charge ($Q_2$): {q2 > 0 ? `+${q2}` : q2}</span>
          </label>
          <input 
            type="range" min="-5" max="5" step="1" 
            value={q2} 
            onChange={(e) => { setQ2(Number(e.target.value)); stop(); }}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>

        {hitStatus === true ? (
          <button
            onClick={stop}
            className="w-full py-3 rounded-full font-bold text-white shadow-md transition-colors bg-[#146C2E] hover:bg-[#0F5223] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-rounded">check_circle</span>
            Success! Reset Field
          </button>
        ) : (
          <button
            onClick={fire}
            className={`w-full py-3 rounded-full font-bold text-white shadow-md transition-colors flex items-center justify-center gap-2 ${hitStatus === false ? 'bg-[#BA1A1A] hover:bg-[#8C1D18]' : 'bg-[#6750A4] hover:bg-[#4F378B]'}`}
          >
            <span className="material-symbols-rounded">{active ? 'replay' : 'bolt'}</span>
            {active ? 'Reset Simulation' : hitStatus === false ? 'Missed! Adjust & Fire Again' : 'Fire Test Charge!'}
          </button>
        )}
      </div>

      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ position: [0, 15, 0], fov: 50 }}>
          <color attach="background" args={['#F0F4F8']} />
          <Scene q1={q1} q2={q2} fireKey={fireKey} setHitStatus={setHitStatus} active={active} />
        </Canvas>
      </div>
    </div>
  );
}

export default CoulombsCollider;