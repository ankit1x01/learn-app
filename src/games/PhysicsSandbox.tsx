import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

const COLORS = {
  primary: '#6750A4',
  primaryContainer: '#EADDFF',
  selected: '#1D192B',
  error: '#BA1A1A',
  surface: '#FFFBFE',
  unselected: '#CAC4D0',
  secondary: '#625B71'
};

function Scene({ angle, friction, mass }: { angle: number, friction: number, mass: number }) {
  // Convert angle from degrees to radians
  const radAngle = (angle * Math.PI) / 180;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

      {/* Physics World */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* The Falling Block */}
        <RigidBody 
          colliders="cuboid" 
          position={[-2, 4 + Math.sin(radAngle) * 5, 0]} 
          rotation={[0, 0, -radAngle]}
          mass={mass}
          friction={friction}
          restitution={0.2}
        >
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={COLORS.primary} />
          </mesh>
        </RigidBody>

        {/* The Inclined Plane (Ramp) */}
        <RigidBody type="fixed" rotation={[0, 0, -radAngle]} position={[0, -1, 0]} friction={friction}>
          <mesh receiveShadow>
            <boxGeometry args={[15, 0.5, 3]} />
            <meshStandardMaterial color={COLORS.primaryContainer} />
          </mesh>
        </RigidBody>

        {/* Floor Catcher / Ground */}
        <RigidBody type="fixed" position={[0, -4, 0]} friction={1}>
          <mesh receiveShadow>
            <boxGeometry args={[30, 1, 10]} />
            <meshStandardMaterial color={COLORS.unselected} transparent opacity={0.5} />
          </mesh>
        </RigidBody>
      </Physics>
      
      <OrbitControls enablePan={false} minDistance={5} maxDistance={20} />
    </>
  );
}

export function PhysicsSandbox({ onBack }: { onBack?: () => void }) {
  const [angle, setAngle] = useState(15);
  const [friction, setFriction] = useState(0.2);
  const [key, setKey] = useState(0); // Used to force-reset the physics engine

  const resetSimulation = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFBFE] font-sans pb-12">
      {/* Header UI */}
      <div 
        className="pb-6 px-6 text-center z-10 shadow-sm relative bg-[#FFFBFE]"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}
      >
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-4 bg-[#EADDFF] text-[#21005D] p-2 rounded-full cursor-pointer hover:bg-[#D0BCFF] transition-colors"
            style={{ top: 'calc(env(safe-area-inset-top) + 16px)' }}
            title="Back"
          >
            <span className="material-symbols-rounded block text-lg leading-none">arrow_back</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-[#1D192B] mb-2 tracking-tight mt-8">
          The Friction Ramp
        </h1>
        <p className="text-sm text-[#49454F] max-w-sm mx-auto">
          Adjust the <strong>Angle</strong> ($\theta$) and <strong>Friction</strong> ($\mu_s$). Find the tipping point where $mg \sin(\theta)$ overcomes static friction!
        </p>
      </div>

      {/* Control Panel */}
      <div className="px-6 py-4 bg-white z-10 border-b border-[#CAC4D0] shadow-sm flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Ramp Angle ($\theta$): {angle}°</span>
          </label>
          <input 
            type="range" min="0" max="60" step="1" 
            value={angle} 
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Friction ($\mu$): {friction.toFixed(2)}</span>
          </label>
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={friction} 
            onChange={(e) => setFriction(Number(e.target.value))}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>

        <button
          onClick={resetSimulation}
          className="w-full py-3 rounded-full font-bold text-white shadow-md transition-colors bg-[#6750A4] hover:bg-[#4F378B] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded">play_arrow</span>
          Run Simulation
        </button>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <Canvas 
          shadows 
          dpr={Math.min(window.devicePixelRatio || 1, 2)} 
          gl={{ antialias: true }} 
          camera={{ position: [0, 2, 10], fov: 50 }}
        >
          <color attach="background" args={['#F4EFF4']} />
          {/* Key forces the entire Scene+Physics world to unmount/remount on reset */}
          <Scene key={key} angle={angle} friction={friction} mass={1} />
        </Canvas>
      </div>
    </div>
  );
}

export default PhysicsSandbox;