import React, { useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Line, Edges, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Matrix Morph: Linear Algebra Visualizer ---

const TARGET_MATRIX = [
  [1, 1], // shear X by Y
  [0, 1]
];

// Helper to apply matrix to a 2D point implicitly represented in 3D
const applyMatrix = (x: number, y: number, matrix: number[][]) => {
  return {
    x: x * matrix[0][0] + y * matrix[0][1],
    y: x * matrix[1][0] + y * matrix[1][1]
  };
};

const UnitSquare = ({ matrix, color, opacity = 1 }: { matrix: number[][], color: string, opacity?: number }) => {
  const points = useMemo(() => {
    const p1 = applyMatrix(0, 0, matrix);
    const p2 = applyMatrix(1, 0, matrix);
    const p3 = applyMatrix(1, 1, matrix);
    const p4 = applyMatrix(0, 1, matrix);
    return [
      new THREE.Vector3(p1.x, p1.y, 0),
      new THREE.Vector3(p2.x, p2.y, 0),
      new THREE.Vector3(p3.x, p3.y, 0),
      new THREE.Vector3(p4.x, p4.y, 0),
      new THREE.Vector3(p1.x, p1.y, 0), // close loop
    ];
  }, [matrix]);

  // A 3D representation via a dynamic BufferGeometry, or simplified with Line for pure math
  return (
    <Line points={points} color={color} lineWidth={4} opacity={opacity} transparent />
  );
};

export const MatrixMorph: React.FC = () => {
  const [matrix, setMatrix] = useState([[1, 0], [0, 1]]); // Identity
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState("Adjust the matrix to match the target shape!");

  useEffect(() => {
    // Check if current matrix matches target
    const isMatch = 
      matrix[0][0] === TARGET_MATRIX[0][0] &&
      matrix[0][1] === TARGET_MATRIX[0][1] &&
      matrix[1][0] === TARGET_MATRIX[1][0] &&
      matrix[1][1] === TARGET_MATRIX[1][1];

    if (isMatch) {
      setSolved(true);
      setMessage("Perfect! You matched the linear transformation.");
    } else {
      setSolved(false);
      setMessage("Adjust the matrix components to match the green ghost shape.");
    }
  }, [matrix]);

  const handleDrag = (r: number, c: number, v: number) => {
    setMatrix(prev => {
      const nm = [...prev.map(row => [...row])];
      nm[r][c] = parseFloat(v.toString());
      return nm;
    });
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen flex flex-col items-center justify-start p-4">
      {/* HUD Board */}
      <div className="bg-[var(--color-surface-container)] rounded-2xl w-full max-w-3xl p-6 mb-6 shadow-sm border border-[var(--color-outline-variant)]">
        <h2 className="text-[22px] font-bold text-[var(--color-on-surface)] flex justify-between items-center mb-2">
          <span>Matrix Morph</span>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${solved ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-800'}`}>
            {solved ? "SOLVED!" : "Transform"}
          </span>
        </h2>
        <p className="text-[14px] text-[var(--color-on-surface-variant)] mb-4">{message}</p>
        
        {/* Matrix Controls Grid */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex gap-8 justify-center">
            
            {/* Input Matrix */}
            <div className="flex items-center text-xl font-bold">
              <span className="text-4xl text-gray-300 mx-2">[</span>
              <div className="flex flex-col gap-2">
                <input type="number" step="0.5" className="w-16 text-center border rounded font-mono" value={matrix[0][0]} onChange={e => handleDrag(0, 0, parseFloat(e.target.value) || 0)} />
                <input type="number" step="0.5" className="w-16 text-center border rounded font-mono" value={matrix[1][0]} onChange={e => handleDrag(1, 0, parseFloat(e.target.value) || 0)} />
              </div>
              <div className="flex flex-col gap-2 mx-2">
                <input type="number" step="0.5" className="w-16 text-center border rounded font-mono" value={matrix[0][1]} onChange={e => handleDrag(0, 1, parseFloat(e.target.value) || 0)} />
                <input type="number" step="0.5" className="w-16 text-center border rounded font-mono" value={matrix[1][1]} onChange={e => handleDrag(1, 1, parseFloat(e.target.value) || 0)} />
              </div>
              <span className="text-4xl text-gray-300 mx-2">]</span>
            </div>

            <div className="text-2xl font-bold flex items-center text-gray-400">×</div>

            {/* Vector Base */}
            <div className="flex items-center text-xl font-bold text-[var(--color-primary)]">
              <span className="text-4xl text-gray-300 mx-2">[</span>
              <div className="flex flex-col gap-4 py-2">
                <span>x</span>
                <span>y</span>
              </div>
              <span className="text-4xl text-gray-300 mx-2">]</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Physics/Math Canvas */}
      <div 
        className="w-full max-w-3xl overflow-hidden rounded-[32px] border-4 border-[var(--color-surface-container-highest)] bg-[#F8F9FA] relative shadow-inner"
        style={{ height: 450 }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.8} />
          
          <Grid infiniteGrid fadeDistance={20} sectionColor="#ddd" cellColor="#eee" position={[0, -2, -1]} />
          
          {/* Target Matrix (Ghost) */}
          <UnitSquare matrix={TARGET_MATRIX} color="#10B981" opacity={0.3} />
          
          {/* Active Matrix */}
          <UnitSquare matrix={matrix} color="#6366F1" opacity={1} />
          
          {/* Axes */}
          <Line points={[[-10, 0, 0], [10, 0, 0]]} color="#000000" opacity={0.2} transparent />
          <Line points={[[0, -10, 0], [0, 10, 0]]} color="#000000" opacity={0.2} transparent />

          <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2} />
        </Canvas>
        
        {solved && (
          <div className="absolute inset-0 bg-green-500/10 pointer-events-none flex justify-center items-center backdrop-blur-sm">
             <h1 className="text-5xl font-black text-green-600 drop-shadow-md">Shear Transform Completed!</h1>
          </div>
        )}
      </div>
    </div>
  );
};
