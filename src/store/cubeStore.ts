'use client';

import { create } from 'zustand';
import { CubeState, Move } from '@/types/cube';
import { RefObject } from 'react';

export type CubeRef = {
  rotatePieces: (move: Move) => void;
  scrambleCube: () => string;
  resetCube: () => void;
  getState: () => CubeState;
  getShortestPath: () => string;
};

interface CubeStore {
  cubeRef: RefObject<CubeRef | null> | null;
  setCubeRef: (ref: RefObject<CubeRef | null>) => void;
}

export const useCubeStore = create<CubeStore>((set) => ({
  cubeRef: null,
  setCubeRef: (ref) => set({ cubeRef: ref }),
}));
