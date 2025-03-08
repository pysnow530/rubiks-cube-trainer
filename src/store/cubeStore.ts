'use client';

import { create } from 'zustand';
import { Move } from '@/types/cube';
import { MutableRefObject } from 'react';

type CubeRef = {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
};

interface CubeStore {
  cubeRef: MutableRefObject<CubeRef> | null;
  setCubeRef: (ref: MutableRefObject<CubeRef>) => void;
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubeRef: null,
  setCubeRef: (ref) => set({ cubeRef: ref }),
}));
