import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Game Logic ---
// We want to hit a target at (xt, yt) using y = ax^2 + bx + c
const TARGET_X = 5;
const TARGET_Y = 2;

const Projectile = ({ a, b, c, firing, onHit }: { a: number, b: number, c: number, firing: boolean, onHit: () => void }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [t, setT] = useState(-5); // start at x = -5
  const hitReported = useRef(false);

  useFrame((state, delta) => {
    if (firing && ref.current) {
      if (t <= 10) {
        setT(prev => prev + delta * 5); // move along x axis
      }
      
      const currentY = a * (t * t) + b * t + c;
      ref.current.position.set(t, currentY, 0);

      // Check collision
      const dist = Math.sqrt(Math.pow(t - TARGET_X, 2) + Math.pow(currentY - TARGET_Y, 2));
      if (dist < 0.5 && !hitReported.current) {
        hitReported.current = true;
        onHit();
      }
    } else if (!firing) {
      setT(-5);
      hitReported.current = false;
      if (ref.current) {
        ref.current.position.set(-5, a * 25 - b * 5 + c, 0);
      }
    }
  });

  return (
    <Sphere ref={ref} args={[0.2, 16, 16]}>
      <meshStandardMaterial color="#F43F5E" />
    </Sphere>
  );
};

export const ParabolaCannon: React.FC = () => {
  const [a, setA] = useState(-0.2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [firing, setFiring] = useState(false);
  const [message, setMessage] = useState("Adjust a, b, and c to hit the green target!");

  // Generate line points for the trajectory preview
  const points = useMemo(() => {
    const pts = [];
    for (let x = -5; x <= 10; x += 0.2) {
      pts.push(new THREE.Vector3(x, a * x * x + b * x + c, 0));
    }
    return pts;
  }, [a, b, c]);

  const handleFire = () => {
    setFiring(true);
    setMessage("Firing...");
    setTimeout(() => {
      setFiring(false);
      setMessage("Adjust a, b, and c to hit the green target!");
    }, 3000);
  };

  const handleHit = () => {
    setMessage("Direct Hit! Excellent quadratic mastery! 🎉");
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen flex flex-col items-center justify-start p-4">
      {/* HUD Board */}
      <div className="bg-[var(--color-surface-container)] rounded-2xl w-full max-w-3xl p-6 mb-6 shadow-sm border border-[var(--color-outline-variant)]">
        <h2 className="text-[22px] font-bold text-[var(--color-on-surface)] mb-2 flex justify-between items-center">
          <span>Parabolic Artillery</span>
          <span className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-3 py-1 rounded-full text-sm font-mono">
            {`y = ${a.toFixed(2)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)}`}
          </span>
        </h2>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-4 font-medium">{message}</p>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <label className="flex flex-col text-sm font-bold text-[var(--color-on-surface)]">
            Coefficient 'a' (Width/Direction): {a.toFixed(2)}
            <input type="range" min="-1" max="1" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} disabled={firing} className="mt-2 accent-[var(--color-primary)]" />
          </label>
          <label className="flex flex-col text-sm font-bold text-[var(--color-on-surface)]">
            Coefficient 'b' (Shift): {b.toFixed(2)}
            <input type="range" min="-5" max="5" step="0.1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} disabled={firing} className="mt-2 accent-[var(--color-primary)]" />
          </label>
          <label className="flex flex-col text-sm font-bold text-[var(--color-on-surface)]">
            Constant 'c' (Height): {c.toFixed(2)}
            <input type="range" min="-10" max="10" step="0.5" value={c} onChange={(e) => setC(parseFloat(e.target.value))} disabled={firing} className="mt-2 accent-[var(--color-primary)]" />
          </label>
        </div>

        <button 
          onClick={handleFire} 
          disabled={firing}
          className="w-full bg-[var(--color-primary)] hover:bg-[#5a4691] text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {firing ? "Projectile in motion..." : "FIRE CANNON"}
        </button>
      </div>

      {/* Physics Canvas */}
      <div 
        className="w-full max-w-3xl overflow-hidden rounded-[32px] border-4 border-[var(--color-surface-container-highest)] bg-[#1A1A1A] relative shadow-lg"
        style={{ height: 500 }}
      >
        <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <OrbitControls enableZoom={false} enablePan={false} />

          <Grid infiniteGrid fadeDistance={20} sectionColor="#444" cellColor="#222" position={[0, -5, 0]} />
          
          {/* Target */}
          <Sphere position={[TARGET_X, TARGET_Y, 0]} args={[0.5, 32, 32]}>
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[TARGET_X, TARGET_Y + 1, 0]} color="white" fontSize={0.5} anchorX="center" anchorY="middle">
            Target
          </Text>

          {/* Cannon Origin Base */}
          <Sphere position={[-5, a * 25 - b * 5 + c, 0]} args={[0.3, 16, 16]}>
            <meshStandardMaterial color="#6366F1" />
          </Sphere>
          
          {/* Trajectory Preview */}
          <Line points={points} color="#6750A4" lineWidth={3} dashed dashScale={1} dashSize={0.5} opacity={firing ? 0.2 : 0.8} transparent />
          
          {/* Fired Projectile */}
          <Projectile a={a} b={b} c={c} firing={firing} onHit={handleHit} />

          {/* Axes */}
          <Line points={[[-10, 0, 0], [10, 0, 0]]} color="#ffffff" opacity={0.3} transparent />
          <Line points={[[0, -10, 0], [0, 10, 0]]} color="#ffffff" opacity={0.3} transparent />
        </Canvas>
      </div>
    </div>
  );
};
