import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// M3 Expressive Colors from DESIGN_SYSTEM.md
const COLORS = {
  primary: '#6750A4',
  primaryContainer: '#EADDFF',
  selected: '#1D192B',
  error: '#BA1A1A',
  surface: '#FFFBFE',
  unselected: '#CAC4D0',
};

function Hemisphere({ isExploded, onToggleSurface, selectedSurfaces }: any) {
  const yPos = isExploded ? 2.5 : 1;
  const isCsaSelected = selectedSurfaces.includes('hemisphere-csa');
  const isBaseSelected = selectedSurfaces.includes('hemisphere-base');

  return (
    <group position={[0, yPos, 0]}>
      {/* Hemisphere Curved Surface Area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onToggleSurface('hemisphere-csa');
        }}
      >
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={isCsaSelected ? COLORS.primary : COLORS.primaryContainer}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Hemisphere Base (Hidden when not exploded) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSurface('hemisphere-base');
        }}
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={isBaseSelected ? COLORS.error : COLORS.unselected}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Text position={[1.5, 0.5, 0]} fontSize={0.3} color={COLORS.primary}>
        Hemisphere
      </Text>
    </group>
  );
}

function Cylinder({ isExploded, onToggleSurface, selectedSurfaces }: any) {
  const yPos = 0;
  const isCsaSelected = selectedSurfaces.includes('cylinder-csa');
  const isTopBaseSelected = selectedSurfaces.includes('cylinder-top-base');
  const isBottomBaseSelected = selectedSurfaces.includes('cylinder-bottom-base');

  return (
    <group position={[0, yPos, 0]}>
      {/* Cylinder Curved Surface Area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onToggleSurface('cylinder-csa');
        }}
      >
        <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
        <meshStandardMaterial
          color={isCsaSelected ? COLORS.primary : COLORS.primaryContainer}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cylinder Top Base (Hidden) */}
      <mesh
        position={[0, 1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSurface('cylinder-top-base');
        }}
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={isTopBaseSelected ? COLORS.error : COLORS.unselected}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cylinder Bottom Base (Visible) */}
      <mesh
        position={[0, -1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSurface('cylinder-bottom-base');
        }}
      >
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          color={isBottomBaseSelected ? COLORS.primary : COLORS.unselected}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Text position={[1.5, 0, 0]} fontSize={0.3} color={COLORS.primary}>
        Cylinder
      </Text>
    </group>
  );
}

export function ShapeSlicerGame({ onBack }: { onBack?: () => void }) {
  const [isExploded, setIsExploded] = useState(false);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Correct selection: The 3 outer surfaces
  const CORRECT_SURFACES = ['hemisphere-csa', 'cylinder-csa', 'cylinder-bottom-base'];

  const toggleSurface = (id: string) => {
    if (hasSubmitted) return;
    setSelectedSurfaces((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isPerfect =
    selectedSurfaces.length === CORRECT_SURFACES.length &&
    CORRECT_SURFACES.every((s) => selectedSurfaces.includes(s));

  return (
    <div className="flex flex-col h-screen bg-[#FFFBFE] font-sans pb-16">
      {/* Header UI */}
      <div className="p-6 text-center z-10 shadow-sm relative">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-4 top-4 bg-[#EADDFF] text-[#21005D] p-2 rounded-full cursor-pointer hover:bg-[#D0BCFF] transition-colors"
            title="Back"
          >
            <span className="material-symbols-rounded block text-lg leading-none">arrow_back</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-[#1D192B] mb-2 tracking-tight">
          Total Surface Area Builder
        </h1>
        <p className="text-md text-[#49454F] max-w-sm mx-auto">
          Rotate the shape. Select all the surfaces that make up the <strong className="text-[#6750A4]">Total Surface Area</strong> of this wooden toy. Do not select hidden joints!
        </p>
      </div>

      {/* 3D Canvas Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden mx-4 my-2 outline outline-1 outline-[#CAC4D0]">
        
        {/* Toggle Explode Mode Button overlay */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
           <button 
             onClick={() => setIsExploded(!isExploded)}
             className="flex items-center gap-2 bg-[#EADDFF] text-[#21005D] px-4 py-2 rounded-full font-medium shadow-md transition-transform hover:scale-105"
           >
             <span className="material-symbols-rounded">
               {isExploded ? 'close_fullscreen' : 'zoom_out_map'}
             </span>
             {isExploded ? 'Join Shape' : 'Explode Shape'}
           </button>
        </div>

        <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
          <color attach="background" args={['#F4EFF4']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group rotation={[0, isExploded ? 0 : Math.PI / 4, 0]}>
              <Hemisphere
                isExploded={isExploded}
                selectedSurfaces={selectedSurfaces}
                onToggleSurface={toggleSurface}
              />
              <Cylinder
                isExploded={isExploded}
                selectedSurfaces={selectedSurfaces}
                onToggleSurface={toggleSurface}
              />
            </group>
          </Float>
          
          <OrbitControls 
             enablePan={false} 
             minDistance={3}
             maxDistance={10}
          />
        </Canvas>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 flex flex-col items-center gap-4 bg-[#FFFBFE]">
        <button
          onClick={() => setHasSubmitted(true)}
          className={`w-full max-w-sm py-4 rounded-full font-bold text-lg text-white shadow-md transition-colors ${
            hasSubmitted ? (isPerfect ? 'bg-[#146C2E]' : 'bg-[#BA1A1A]') : 'bg-[#6750A4] hover:bg-[#4F378B]'
          }`}
        >
          {hasSubmitted
            ? isPerfect
              ? 'Perfect! Mastery Verified'
              : 'Oops! Check hidden surfaces'
            : 'Lock in Answer'}
        </button>

        {hasSubmitted && !isPerfect && (
          <button 
            className="text-[#6750A4] font-medium mt-2" 
            onClick={() => {
              setHasSubmitted(false);
              setSelectedSurfaces([]);
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ShapeSlicerGame;