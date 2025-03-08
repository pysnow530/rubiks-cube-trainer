export type Move = 'U' | 'U\'' | 'D' | 'D\'' | 'L' | 'L\'' | 'R' | 'R\'' | 'F' | 'F\'' | 'B' | 'B\'';
export type CubeMode = 'normal' | 'cross';

export interface CubeColors {
  U: string;
  D: string;
  L: string;
  R: string;
  F: string;
  B: string;
}

export interface CubeBlock {
  position: [number, number, number];
  colors: CubeColors;
}

export interface CubeState {
  pieces: CubeBlock[];
}

export const CUBE_COLORS = {
  white: '#FFFFFF',
  yellow: '#FFD700',
  red: '#FF0000',
  orange: '#FFA500',
  blue: '#0000FF',
  green: '#00FF00',
  hidden: '#1a1a1a',
} as const;

// 初始魔方状态
export const INITIAL_CUBE_STATE: CubeState = {
  pieces: [
    // 中心块
    { position: [0, 1, 0], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [0, -1, 0], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [-1, 0, 0], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [1, 0, 0], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [0, 0, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [0, 0, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },

    // 棱块
    { position: [0, 1, 1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [1, 1, 0], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [0, 1, -1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [-1, 1, 0], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [-1, 0, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [1, 0, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [1, 0, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [-1, 0, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [0, -1, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [1, -1, 0], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [0, -1, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.hidden } },
    { position: [-1, -1, 0], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },

    // 角块
    { position: [-1, 1, 1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [1, 1, 1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [1, 1, -1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [-1, 1, -1], colors: { U: CUBE_COLORS.yellow, D: CUBE_COLORS.hidden, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [-1, -1, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
    { position: [1, -1, 1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.green, B: CUBE_COLORS.hidden, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [1, -1, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.hidden, R: CUBE_COLORS.orange } },
    { position: [-1, -1, -1], colors: { U: CUBE_COLORS.hidden, D: CUBE_COLORS.white, F: CUBE_COLORS.hidden, B: CUBE_COLORS.blue, L: CUBE_COLORS.red, R: CUBE_COLORS.hidden } },
  ],
};
