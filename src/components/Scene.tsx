'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubiksCube } from './RubiksCube';
import { Controls } from './Controls';
import { Move } from '@/types/cube';
import { useRef, useEffect } from 'react';
import { useCubeStore } from '@/store/cubeStore';

type CubeRef = {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
};

interface SceneProps {
  showControls?: boolean;
  showCube?: boolean;
  isMain?: boolean;
}

export const Scene = ({ showControls = true, showCube = true, isMain = false }: SceneProps) => {
  const cubeRef = useRef<CubeRef>(null);
  const { cubeRef: sharedCubeRef, setCubeRef } = useCubeStore();

  useEffect(() => {
    if (isMain && cubeRef.current) {
      setCubeRef(cubeRef as any);
    }
  }, [isMain, setCubeRef]);

  const handleMove = (move: Move) => {
    if (isMain) {
      cubeRef.current?.rotatePieces(move);
    } else {
      sharedCubeRef?.current?.rotatePieces(move);
    }
  };

  const handleScramble = () => {
    if (isMain) {
      cubeRef.current?.scrambleCube();
    } else {
      sharedCubeRef?.current?.scrambleCube();
    }
  };

  const handleReset = () => {
    if (isMain) {
      cubeRef.current?.resetCube();
    } else {
      sharedCubeRef?.current?.resetCube();
    }
  };

  return (
    <div className="relative w-full h-full">
      {showCube && (
        <Canvas 
          camera={{ 
            position: [5, 5, 5], 
            fov: 45,
            up: [0, 1, 0],
          }}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <RubiksCube ref={cubeRef} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI * 5 / 6}
            target={[0, 0, 0]}
            makeDefault
          />
        </Canvas>
      )}
      {showControls && (
        <div className="absolute top-4 left-4">
          <Controls
            onMove={handleMove}
            onScramble={handleScramble}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
};
