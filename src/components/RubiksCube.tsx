'use client';

import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useMemo } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { Move, CubeMode, INITIAL_CUBE_STATE, CubeBlock, CubeState, CUBE_COLORS } from '@/types/cube';
import { Mesh, Group, BoxGeometry, MeshStandardMaterial, DoubleSide } from 'three';
import { applyMove } from '@/utils/cubeRotation';

interface RubiksCubeProps {
  mode?: CubeMode;
}

interface RubiksCubeRef {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
}

const createMaterial = (color: string) => {
  const isHidden = color === CUBE_COLORS.hidden;
  return new MeshStandardMaterial({
    color,
    roughness: isHidden ? 0.9 : 0.2,
    metalness: isHidden ? 0 : 0.1,
    emissive: isHidden ? 0x000000 : color,
    emissiveIntensity: isHidden ? 0 : 0.1,
    transparent: isHidden,
    opacity: isHidden ? 0.15 : 1,
    side: DoubleSide,
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
      return applyMove(prevState, move);
    });
  };

  const scrambleCube = () => {
    console.log('开始打乱魔方');
    const moves: Move[] = [
      'U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'", 'U2', 'D2', 'L2', 'R2', 'F2', 'B2',
    ];
    const numMoves = 20;

    setCubeState(() => {
      console.log('生成新的魔方状态');
      let newState = updateCubeState(INITIAL_CUBE_STATE, mode);
      
      // 随机应用移动
      let lastMove = '.';
      let lastLastMove = '.';
      const appliedMoves: Move[] = [];
      for (let i = 0; i < numMoves; i++) {
        const validMoves = moves.filter(move => move[0] !== lastMove[0] && move[0] !== lastLastMove[0]);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)] as Move;
        appliedMoves.push(randomMove);
        lastLastMove = lastMove;
        lastMove = randomMove;
      }

      for (const move of appliedMoves) {
        newState = applyMove(newState, move);
      }
      
      console.log('应用的移动序列:', appliedMoves.join(' '));
      return newState;
    });
  };

  const resetCube = () => {
    setCubeState(() => updateCubeState(INITIAL_CUBE_STATE, mode));
  };

  const getState = () => {
    return cubeState;
  };

  useImperativeHandle(ref, () => ({
    rotatePieces,
    scrambleCube,
    resetCube,
    getState,
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
