import {CUBE_COLORS, CubeColors, CubeState} from "@/types/cube";
import {Move} from "@/types/cube";

type Face = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';
type ColorOfFace = 'U' | 'D' | 'R' | 'L' | 'F' | 'B' | ' ';
type CubeStateForSolve = Record<Face, ColorOfFace[]>;

const isOpposite = (char1: string, char2: string) => {
  return (char1 === 'L' && char2 === 'R'
    || char1 === 'R' && char2 === 'L'
    || char1 === 'U' && char2 === 'D'
    || char1 === 'D' && char2 === 'U'
    || char1 === 'F' && char2 === 'B'
    || char1 === 'B' && char2 === 'F');
}

const createCubeStateForSolve = (state: CubeState): CubeStateForSolve => {
  const colorToFace: Record<string, ColorOfFace> = {
    [CUBE_COLORS.white]: 'D',
    [CUBE_COLORS.yellow]: 'U',
    [CUBE_COLORS.red]: 'L',
    [CUBE_COLORS.orange]: 'R',
    [CUBE_COLORS.blue]: 'B',
    [CUBE_COLORS.green]: 'F',
    [CUBE_COLORS.hidden]: ' ',
  };

  const positionToColors = new Map<string, CubeColors>();
  for (const piece of state.pieces) {
    const { colors, position } = piece;
    const key = position.join('_');
    positionToColors.set(key, colors);
  }

  const result: CubeStateForSolve = {
    U: [
        colorToFace[positionToColors.get('0_1_-1')!.U],
        colorToFace[positionToColors.get('1_1_0')!.U],
        colorToFace[positionToColors.get('0_1_1')!.U],
        colorToFace[positionToColors.get('-1_1_0')!.U],
    ],
    D: [
        colorToFace[positionToColors.get('0_-1_1')!.D],
        colorToFace[positionToColors.get('1_-1_0')!.D],
        colorToFace[positionToColors.get('0_-1_-1')!.D],
        colorToFace[positionToColors.get('-1_-1_0')!.D],
    ],
    R: [
        colorToFace[positionToColors.get('1_1_0')!.R],
        colorToFace[positionToColors.get('1_0_-1')!.R],
        colorToFace[positionToColors.get('1_-1_0')!.R],
        colorToFace[positionToColors.get('1_0_1')!.R],
    ],
    L: [
        colorToFace[positionToColors.get('-1_1_0')!.L],
        colorToFace[positionToColors.get('-1_0_1')!.L],
        colorToFace[positionToColors.get('-1_-1_0')!.L],
        colorToFace[positionToColors.get('-1_0_-1')!.L],
    ],
    F: [
        colorToFace[positionToColors.get('0_1_1')!.F],
        colorToFace[positionToColors.get('1_0_1')!.F],
        colorToFace[positionToColors.get('0_-1_1')!.F],
        colorToFace[positionToColors.get('-1_0_1')!.F],
    ],
    B: [
        colorToFace[positionToColors.get('0_1_-1')!.B],
        colorToFace[positionToColors.get('-1_0_-1')!.B],
        colorToFace[positionToColors.get('0_-1_-1')!.B],
        colorToFace[positionToColors.get('1_0_-1')!.B],
    ],
  };

  return result;
};

const copyState2 = (state: CubeStateForSolve): CubeStateForSolve => ({
  D: [...state.D],
  U: [...state.U],
  R: [...state.R],
  L: [...state.L],
  F: [...state.F],
  B: [...state.B],
});

const isSolved2 = (state: CubeStateForSolve): boolean => {
  return state.D.every(color => color === 'D') &&
    (state.F[2] === 'F' && state.L[2] === 'L' && state.B[2] === 'B' && state.R[2] === 'R' ||
        state.F[2] === 'L' && state.L[2] === 'B' && state.B[2] === 'R' && state.R[2] === 'F' ||
        state.F[2] === 'B' && state.L[2] === 'R' && state.B[2] === 'F' && state.R[2] === 'L' ||
        state.F[2] === 'R' && state.L[2] === 'F' && state.B[2] === 'L' && state.R[2] === 'B'
    );
}

type ColorRef = [ColorOfFace[], number];

const rotate = (refs: ColorRef[], n: number) => {
  const oldColors = refs.map(([colors, idx]) => colors[idx]);
  for (var i = 0; i < refs.length; i++) {
    let [colors, idx] = refs[i];
    colors[idx] = oldColors[(i + n + refs.length) % refs.length];
  }
};

const applyMoveForSolve = (state: CubeStateForSolve, move: Move) => {
  const newState = copyState2(state);
  switch (move) {
    case 'U':
      rotate([[newState.U, 0], [newState.U, 1], [newState.U, 2], [newState.U, 3]], -1);
      rotate([[newState.F, 0], [newState.L, 0], [newState.B, 0], [newState.R, 0]], -1);
      break;
    case 'D':
      rotate([[newState.D, 0], [newState.D, 1], [newState.D, 2], [newState.D, 3]], -1);
      rotate([[newState.F, 2], [newState.R, 2], [newState.B, 2], [newState.L, 2]], -1);
      break;
    case 'L':
      rotate([[newState.L, 0], [newState.L, 1], [newState.L, 2], [newState.L, 3]], -1);
      rotate([[newState.U, 3], [newState.F, 3], [newState.D, 3], [newState.B, 1]], -1);
      break;
    case 'R':
      rotate([[newState.R, 0], [newState.R, 1], [newState.R, 2], [newState.R, 3]], -1);
      rotate([[newState.U, 1], [newState.B, 3], [newState.D, 1], [newState.F, 1]], -1);
      break;
    case 'F':
      rotate([[newState.F, 0], [newState.F, 1], [newState.F, 2], [newState.F, 3]], -1);
      rotate([[newState.U, 2], [newState.R, 3], [newState.D, 0], [newState.L, 1]], -1);
      break;
    case 'B':
      rotate([[newState.B, 0], [newState.B, 1], [newState.B, 2], [newState.B, 3]], -1);
      rotate([[newState.U, 0], [newState.L, 3], [newState.D, 2], [newState.R, 1]], -1);
      break;
    case 'U2':
      rotate([[newState.U, 0], [newState.U, 1], [newState.U, 2], [newState.U, 3]], -2);
      rotate([[newState.F, 0], [newState.L, 0], [newState.B, 0], [newState.R, 0]], -2);
      break;
    case 'D2':
      rotate([[newState.D, 0], [newState.D, 1], [newState.D, 2], [newState.D, 3]], -2);
      rotate([[newState.F, 2], [newState.R, 2], [newState.B, 2], [newState.L, 2]], -2);
      break;
    case 'L2':
      rotate([[newState.L, 0], [newState.L, 1], [newState.L, 2], [newState.L, 3]], -2);
      rotate([[newState.U, 3], [newState.F, 3], [newState.D, 3], [newState.B, 1]], -2);
      break;
    case 'R2':
      rotate([[newState.R, 0], [newState.R, 1], [newState.R, 2], [newState.R, 3]], -2);
      rotate([[newState.U, 1], [newState.B, 3], [newState.D, 1], [newState.F, 1]], -2);
      break;
    case 'F2':
      rotate([[newState.F, 0], [newState.F, 1], [newState.F, 2], [newState.F, 3]], -2);
      rotate([[newState.U, 2], [newState.R, 3], [newState.D, 0], [newState.L, 1]], -2);
      break;
    case 'B2':
      rotate([[newState.B, 0], [newState.B, 1], [newState.B, 2], [newState.B, 3]], -2);
      rotate([[newState.U, 0], [newState.L, 3], [newState.D, 2], [newState.R, 1]], -2);
      break;
    case "U'":
      rotate([[newState.U, 0], [newState.U, 1], [newState.U, 2], [newState.U, 3]], 1);
      rotate([[newState.F, 0], [newState.L, 0], [newState.B, 0], [newState.R, 0]], 1);
      break;
    case "D'":
      rotate([[newState.D, 0], [newState.D, 1], [newState.D, 2], [newState.D, 3]], 1);
      rotate([[newState.F, 2], [newState.R, 2], [newState.B, 2], [newState.L, 2]], 1);
      break;
    case "L'":
      rotate([[newState.L, 0], [newState.L, 1], [newState.L, 2], [newState.L, 3]], 1);
      rotate([[newState.U, 3], [newState.F, 3], [newState.D, 3], [newState.B, 1]], 1);
      break;
    case "R'":
      rotate([[newState.R, 0], [newState.R, 1], [newState.R, 2], [newState.R, 3]], 1);
      rotate([[newState.U, 1], [newState.B, 3], [newState.D, 1], [newState.F, 1]], 1);
      break;
    case "F'":
      rotate([[newState.F, 0], [newState.F, 1], [newState.F, 2], [newState.F, 3]], 1);
      rotate([[newState.U, 2], [newState.R, 3], [newState.D, 0], [newState.L, 1]], 1);
      break;
    case "B'":
      rotate([[newState.B, 0], [newState.B, 1], [newState.B, 2], [newState.B, 3]], 1);
      rotate([[newState.U, 0], [newState.L, 3], [newState.D, 2], [newState.R, 1]], 1);
      break;
  }
  return newState;
}

export const solveCube = (state: CubeState): string => {
  const state2 = createCubeStateForSolve(state);

  if (isSolved2(state2)) return '';

  const moves: Move[] = [
    'U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'", 'U2', 'D2', 'L2', 'R2', 'F2', 'B2',
  ];
  let cache = new Map<Move[], CubeStateForSolve>();
  cache.set([], state2);

  const stat = {applyMove: 0, skip: 0, isSolved: 0};
  for (let i = 0; i < 8; i++) {
    const newCache = new Map<Move[], CubeStateForSolve>();
    for (const key of cache.keys()) {
    //   console.log(`尝试序列前缀：${key}`);
      for (const move of moves) {
        const oldState = cache.get(key)!;

        // 处理旋转面无颜色时跳过
        if (oldState[move[0] as keyof CubeStateForSolve].every(color => color === ' ')) continue;

        const timestamp0 = new Date().getTime();
        const newState2 = applyMoveForSolve(oldState, move);
        const timestamp1 = new Date().getTime();

        if (key.length >= 1 && key[key.length - 1][0] === move[0]) continue; // 跟上次是同个旋转面，直接跳过
        if (key.length >= 2 && key[key.length - 2][0] === move[0] && isOpposite(key[key.length - 1][0], move[0])) continue; // 跟上次是同个旋转面，直接跳过
        const timestamp2 = new Date().getTime();

        const newKey = key.concat([move]);
        if (isSolved2(newState2)) {
            return newKey.join(' ');
        } else {
          newCache.set(newKey, newState2);
        }
        const timestamp3 = new Date().getTime();
        stat.applyMove += timestamp1 - timestamp0;
        stat.skip += timestamp2 - timestamp1;
        stat.isSolved += timestamp3 - timestamp2;
      }
    }
    cache = newCache;
  }
  console.log(stat);
  return '';
};