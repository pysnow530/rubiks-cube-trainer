'use client';

import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { Move, CubeMode, INITIAL_CUBE_STATE, CubeBlock, CubeState, CUBE_COLORS } from '@/types/cube';
import { Mesh, Group, BoxGeometry, MeshStandardMaterial } from 'three';

interface RubiksCubeProps {
  mode?: CubeMode;
}

interface RubiksCubeRef {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
}

const createMaterial = (color: string) => {
  return new MeshStandardMaterial({
    color,
    roughness: 0.2,
    metalness: 0.1,
    emissive: color === CUBE_COLORS.hidden ? 0x000000 : 0x111111,
  });
};

const updateCubeState = (state: CubeState, mode: CubeMode): CubeState => {
  const newState = JSON.parse(JSON.stringify(state));
  if (mode === 'cross') {
    // 只显示底层中心块和四个棱块
    newState.pieces = newState.pieces.map((piece: CubeBlock) => {
      const [x, y, z] = piece.position;
      const isCenterOrEdge = (
        // 底面中心
        (y === -1 && x === 0 && z === 0) ||
        // 底面四个棱块
        (y === -1 && ((x === 0 && (z === 1 || z === -1)) || (z === 0 && (x === 1 || x === -1))))
      );
      
      if (!isCenterOrEdge) {
        // 非底层十字的块全部显示为黑色
        return {
          ...piece,
          colors: {
            U: CUBE_COLORS.hidden,
            D: CUBE_COLORS.hidden,
            F: CUBE_COLORS.hidden,
            B: CUBE_COLORS.hidden,
            L: CUBE_COLORS.hidden,
            R: CUBE_COLORS.hidden,
          }
        };
      }
      return piece;
    });
  }
  return newState;
};

export const RubiksCube = forwardRef<RubiksCubeRef, RubiksCubeProps>(({ mode = 'normal' }, ref) => {
  const [cubeState, setCubeState] = useState<CubeState>(() => {
    return updateCubeState(INITIAL_CUBE_STATE, mode);
  });

  // 监听 mode 变化
  useEffect(() => {
    setCubeState(prevState => updateCubeState(prevState, mode));
  }, [mode]);

  const groupRef = useRef<Group>(null);
  const animationRef = useRef<{
    isAnimating: boolean;
    move: Move | null;
    progress: number;
  }>({
    isAnimating: false,
    move: null,
    progress: 0,
  });

  const rotatePieces = (move: Move) => {
    if (animationRef.current.isAnimating) return;

    // 更新魔方状态
    setCubeState((prevState: CubeState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      // 根据移动更新块的位置和颜色
      // 这里需要实现具体的旋转逻辑
      return newState;
    });
  };

  const scrambleCube = () => {
    const moves: Move[] = ['U', 'U\'', 'D', 'D\'', 'L', 'L\'', 'R', 'R\'', 'F', 'F\'', 'B', 'B\''];
    const numMoves = mode === 'cross' ? 4 : 20; // 底层十字模式使用较少的打乱步数
    
    setCubeState(() => {
      let newState = updateCubeState(INITIAL_CUBE_STATE, mode);
      
      // 随机应用移动
      for (let i = 0; i < numMoves; i++) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        // 应用移动到状态
        // 这里需要实现具体的旋转逻辑
      }
      
      return newState;
    });
  };

  const resetCube = () => {
    setCubeState(() => updateCubeState(INITIAL_CUBE_STATE, mode));
  };

  useImperativeHandle(ref, () => ({
    rotatePieces,
    scrambleCube,
    resetCube,
  }));

  // 使用 useMemo 缓存材质
  const materials = useMemo(() => {
    return cubeState.pieces.map((piece: CubeBlock) => [
      createMaterial(piece.colors.R || CUBE_COLORS.hidden), // 右面 (x+)
      createMaterial(piece.colors.L || CUBE_COLORS.hidden), // 左面 (x-)
      createMaterial(piece.colors.U || CUBE_COLORS.hidden), // 上面 (y+)
      createMaterial(piece.colors.D || CUBE_COLORS.hidden), // 下面 (y-)
      createMaterial(piece.colors.F || CUBE_COLORS.hidden), // 前面 (z+)
      createMaterial(piece.colors.B || CUBE_COLORS.hidden), // 后面 (z-)
    ]);
  }, [cubeState]);

  return (
    <group ref={groupRef}>
      {cubeState.pieces.map((piece: CubeBlock, index: number) => (
        <mesh
          key={index}
          position={piece.position}
        >
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          {materials[index].map((material, i) => (
            <primitive key={i} object={material} attach={`material-${i}`} />
          ))}
        </mesh>
      ))}
    </group>
  );
});
