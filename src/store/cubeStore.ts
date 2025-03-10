'use client';

import { create } from 'zustand';
import { CubeState, Move } from '@/types/cube';
import { MutableRefObject } from 'react';

type CubeRef = {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => void;
  resetCube: () => void;
  getState: () => CubeState;
};

interface CubeStore {
  cubeRef: MutableRefObject<CubeRef> | null;
  setCubeRef: (ref: MutableRefObject<CubeRef>) => void;
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubeRef: null,
  setCubeRef: (ref) => set({ cubeRef: ref }),
}));
