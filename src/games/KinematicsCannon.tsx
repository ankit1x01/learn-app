import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Physics, RigidBody, InstancedRigidBodies } from '@react-three/rapier';
import * as THREE from 'three';

const COLORS = {
  primary: '#6750A4',
  primaryContainer: '#EADDFF',
  selected: '#1D192B',
  error: '#BA1A1A',
  success: '#146C2E',
  surface: '#FFFBFE',
  unselected: '#CAC4D0',
};

// The Projectile Component
function Projectile({ velocity, angle, onHit }: { velocity: number, angle: number, onHit: (hit: boolean) => void }) {
  const radAngle = (angle * Math.PI) / 180;
  // Calculate initial x and y velocity components
  const vx = velocity * Math.cos(radAngle);
  const vy = velocity * Math.sin(radAngle);

  return (
    <RigidBody
      colliders="ball"
      position={[0, 1, 0]}
      linearVelocity={[vx, vy, 0]}
      restitution={0.5}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'target') {
          onHit(true);
        } else if (other.rigidBodyObject?.name === 'floor') {
          onHit(false);
        }
      }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={COLORS.error} />
      </mesh>
    </RigidBody>
  );
}

function Scene({ angle, fireKey, velocity, targetPos, setHitStatus }: any) {
  const radAngle = (angle * Math.PI) / 180;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        
        {/* The Cannon Barrel (Visual Only) */}
        <group position={[0, 0.5, 0]}>
          <mesh rotation={[0, 0, radAngle]} position={[Math.cos(radAngle)*0.5, Math.sin(radAngle)*0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
            <meshStandardMaterial color={COLORS.selected} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color={COLORS.primary} />
          </mesh>
        </group>

        {/* The Projectile: Re-renders when fireKey changes */}
        {fireKey > 0 && <Projectile key={fireKey} velocity={velocity} angle={angle} onHit={setHitStatus} />}

        {/* The Target */}
        <RigidBody name="target" type="fixed" position={[targetPos, 0.5, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[3, 1, 3]} />
            <meshStandardMaterial color={COLORS.success} />
          </mesh>
          <Text position={[0, 1, 0]} fontSize={0.5} color={COLORS.selected} rotation={[0, -Math.PI/2, 0]}>
            TARGET
          </Text>
        </RigidBody>

        {/* Floor */}
        <RigidBody name="floor" type="fixed" position={[5, -0.5, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[40, 1, 10]} />
            <meshStandardMaterial color={COLORS.unselected} transparent opacity={0.5} />
          </mesh>
        </RigidBody>
      </Physics>
      
      {/* Position camera to see both cannon and target */}
      <OrbitControls enablePan={false} target={[targetPos / 2, 0, 0]} />
    </>
  );
}

export function KinematicsCannon({ onBack }: { onBack?: () => void }) {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(15);
  const [fireKey, setFireKey] = useState(0);
  const [targetPos, setTargetPos] = useState(15); // Distance in meters
  const [hitStatus, setHitStatus] = useState<boolean | null>(null);

  const fire = () => {
    setHitStatus(null);
    setFireKey(prev => prev + 1);
  };

  const nextLevel = () => {
    setHitStatus(null);
    setFireKey(0);
    setTargetPos(Math.floor(Math.random() * 15) + 10); // Random distance 10-25m
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFBFE] font-sans pb-12">
      {/* Header UI */}
      <div className="p-6 text-center z-10 shadow-sm relative bg-[#FFFBFE]">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-4 top-4 bg-[#EADDFF] text-[#21005D] p-2 rounded-full cursor-pointer hover:bg-[#D0BCFF] transition-colors"
            title="Back"
          >
            <span className="material-symbols-rounded block text-lg leading-none">arrow_back</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-[#1D192B] mb-2 tracking-tight mt-8">
          The Kinematics Cannon
        </h1>
        <p className="text-sm text-[#49454F] max-w-sm mx-auto">
          The target is <strong>{targetPos}m</strong> away. Adjust velocity ($v_0$) and angle ({String.raw`$\theta$`}) so the range {String.raw`$R = \frac{v_0^2 \sin(2\theta)}{g}$`} hits the green platform!
        </p>
      </div>

      {/* Control Panel */}
      <div className="px-6 py-4 bg-white z-10 border-b border-[#CAC4D0] shadow-sm flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Launch Angle ({String.raw`$\theta$`}): {angle}°</span>
          </label>
          <input 
            type="range" min="10" max="80" step="1" 
            value={angle} 
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-[#1D192B] flex justify-between">
            <span>Velocity ($v_0$): {velocity.toFixed(1)} m/s</span>
          </label>
          <input 
            type="range" min="5" max="30" step="0.5" 
            value={velocity} 
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full mt-1 accent-[#6750A4]"
          />
        </div>

        {hitStatus === true ? (
          <button
            onClick={nextLevel}
            className="w-full py-3 rounded-full font-bold text-white shadow-md transition-colors bg-[#146C2E] hover:bg-[#0F5223] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-rounded">check_circle</span>
            Target Destroyed! Next Level
          </button>
        ) : (
          <button
            onClick={fire}
            className={`w-full py-3 rounded-full font-bold text-white shadow-md transition-colors flex items-center justify-center gap-2 ${hitStatus === false ? 'bg-[#BA1A1A] hover:bg-[#8C1D18]' : 'bg-[#6750A4] hover:bg-[#4F378B]'}`}
          >
            <span className="material-symbols-rounded">local_fire_department</span>
            {hitStatus === false ? 'Missed! Adjust & Fire Again' : 'Fire Cannon!'}
          </button>
        )}
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ position: [targetPos / 2, 5, targetPos * 0.8], fov: 50 }}>
          <color attach="background" args={['#87CEEB']} />
          <Scene angle={angle} velocity={velocity} targetPos={targetPos} fireKey={fireKey} setHitStatus={setHitStatus} />
        </Canvas>
      </div>
    </div>
  );
}

export default KinematicsCannon;