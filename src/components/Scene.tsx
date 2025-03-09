'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubiksCube } from './RubiksCube';
import { Controls } from './Controls';
import { Move } from '@/types/cube';
import { useRef, useLayoutEffect } from 'react';
import { useCubeStore } from '@/store/cubeStore';

interface SceneProps {
  showControls?: boolean;
  showCube?: boolean;
  isMain?: boolean;
}

export const Scene = ({ showControls = true, showCube = true, isMain = false }: SceneProps) => {
  const cubeRef = useRef<{
    rotatePieces: (move: Move) => void;
    scrambleCube: () => void;
    resetCube: () => void;
  }>(null);

  const { cubeRef: sharedCubeRef, setCubeRef } = useCubeStore();

  // 使用 useLayoutEffect 确保在 DOM 更新之前设置 ref
  useLayoutEffect(() => {
    if (isMain) {
      setCubeRef(cubeRef);
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
      {showControls && (
        <div className="absolute top-4 right-4 z-10">
          <Controls
            onMove={handleMove}
            onScramble={handleScramble}
            onReset={handleReset}
          />
        </div>
      )}
      {showCube && (
        <Canvas 
          camera={{ 
            position: [5, 5, 5], 
            fov: 45,
            up: [0, 1, 0],
          }}
          className="absolute inset-0"
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <RubiksCube ref={cubeRef} mode="cross" />
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
    </div>
  );
};
