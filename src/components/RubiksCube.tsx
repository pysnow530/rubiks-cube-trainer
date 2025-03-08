import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { CubeState, Move, INITIAL_CUBE_STATE } from '@/types/cube';
import * as THREE from 'three';

interface CubePieceProps {
  position: [number, number, number];
  colors: string[];
}

const CubePiece = ({ position, colors }: CubePieceProps) => {
  // 创建六个面的材质，顺序为：右、左、上、下、前、后
  const materials = [
    new THREE.MeshStandardMaterial({ color: colors[0] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 右 (x+)
    new THREE.MeshStandardMaterial({ color: colors[1] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 左 (x-)
    new THREE.MeshStandardMaterial({ color: colors[2] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 上 (y+)
    new THREE.MeshStandardMaterial({ color: colors[3] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 下 (y-)
    new THREE.MeshStandardMaterial({ color: colors[4] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 前 (z+)
    new THREE.MeshStandardMaterial({ color: colors[5] || '#1a1a1a', roughness: 0.3, metalness: 0.1 }), // 后 (z-)
  ];

  return (
    <Box position={position} args={[0.9, 0.9, 0.9]} material={materials} />
  );
};

export interface RubiksCubeRef {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
}

export const RubiksCube = forwardRef<RubiksCubeRef>((_, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const [cubeState, setCubeState] = useState<CubeState>(INITIAL_CUBE_STATE);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<{
    startRotation: THREE.Euler;
    targetRotation: THREE.Euler;
    progress: number;
  } | null>(null);

  const rotatePieces = (move: Move) => {
    if (isAnimating) return;

    const newState = { ...cubeState };
    // Implementation of piece rotation logic based on the move
    // This is a simplified version - you would need to implement the actual rotation logic
    setCubeState(newState);
    setIsAnimating(true);
    
    // Set up animation
    if (groupRef.current) {
      const axis = move.includes('U') || move.includes('D') ? 'y' :
                  move.includes('L') || move.includes('R') ? 'x' : 'z';
      const angle = move.includes('\'') ? -Math.PI/2 : Math.PI/2;
      
      animationRef.current = {
        startRotation: groupRef.current.rotation.clone(),
        targetRotation: new THREE.Euler(
          groupRef.current.rotation.x + (axis === 'x' ? angle : 0),
          groupRef.current.rotation.y + (axis === 'y' ? angle : 0),
          groupRef.current.rotation.z + (axis === 'z' ? angle : 0)
        ),
        progress: 0
      };
    }
  };

  const scrambleCube = () => {
    const moves: Move[] = ['U', 'U\'', 'D', 'D\'', 'L', 'L\'', 'R', 'R\'', 'F', 'F\'', 'B', 'B\''];
    const scramble = Array.from({ length: 20 }, () => moves[Math.floor(Math.random() * moves.length)]);
    scramble.forEach((move, i) => {
      setTimeout(() => rotatePieces(move), i * 500);
    });
  };

  const resetCube = () => {
    setCubeState(INITIAL_CUBE_STATE);
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
  };

  useImperativeHandle(ref, () => ({
    rotatePieces,
    scrambleCube,
    resetCube
  }));

  useFrame((_, delta) => {
    if (isAnimating && animationRef.current) {
      animationRef.current.progress += delta * 2;
      
      if (animationRef.current.progress >= 1) {
        setIsAnimating(false);
        animationRef.current = null;
      } else {
        const { startRotation, targetRotation, progress } = animationRef.current;
        if (groupRef.current) {
          groupRef.current.rotation.set(
            THREE.MathUtils.lerp(startRotation.x, targetRotation.x, progress),
            THREE.MathUtils.lerp(startRotation.y, targetRotation.y, progress),
            THREE.MathUtils.lerp(startRotation.z, targetRotation.z, progress)
          );
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {cubeState.pieces.map((piece, index) => (
        <CubePiece
          key={index}
          position={piece.position}
          colors={piece.colors}
        />
      ))}
    </group>
  );
});
