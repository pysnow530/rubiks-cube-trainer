import { Move, CubeState, CubeBlock, CubeColors, TWO_MOVES, TO_ONE_MOVE, CUBE_COLORS } from '@/types/cube';

// 根据移动类型获取需要旋转的块
export const getAffectedBlocks = (state: CubeState, move: Move): CubeBlock[] => {
  const face = move[0]; // U, D, L, R, F, B
  const pieces = state.pieces;
  
  switch (face) {
    case 'U': // y = 1
      return pieces.filter(block => block.position[1] === 1 && (block.position[0] === 0 || block.position[2] === 0));
    case 'D': // y = -1
      return pieces.filter(block => block.position[1] === -1 && (block.position[0] === 0 || block.position[2] === 0));
    case 'L': // x = -1
      return pieces.filter(block => block.position[0] === -1 && (block.position[1] === 0 || block.position[2] === 0));
    case 'R': // x = 1
      return pieces.filter(block => block.position[0] === 1 && (block.position[1] === 0 || block.position[2] === 0));
    case 'F': // z = 1
      return pieces.filter(block => block.position[2] === 1 && (block.position[0] === 0 || block.position[1] === 0));
    case 'B': // z = -1
      return pieces.filter(block => block.position[2] === -1 && (block.position[0] === 0 || block.position[1] === 0));
    default:
      return [];
  }
};

// 旋转一个块的位置
export const rotatePosition = (position: [number, number, number], move: Move): [number, number, number] => {
  const [x, y, z] = position;
  const isClockwise = move.length === 1;
  
  switch (move[0]) {
    case 'U':
      // 绕 y 轴旋转
      return isClockwise ? 
        [-z, y, x] :
        [z, y, -x];
    case 'D':
      // 绕 y 轴旋转
      return isClockwise ? 
        [z, y, -x] :
        [-z, y, x];
    case 'L':
      // 绕 x 轴旋转
      return isClockwise ?
        [x, -z, y] :
        [x, z, -y];
    case 'R':
      // 绕 x 轴旋转
      return isClockwise ?
        [x, z, -y] :
        [x, -z, y];
    case 'F':
      // 绕 z 轴旋转
      return isClockwise ?
        [y, -x, z] :
        [-y, x, z];
    case 'B':
      // 绕 z 轴旋转
      return isClockwise ?
        [-y, x, z] :
        [y, -x, z];
    default:
      return [x, y, z];
  }
};

// 旋转一个块的颜色
export const rotateColors = (colors: CubeColors, move: Move): CubeColors => {
  const isClockwise = move.length === 1;
  
  switch (move[0]) {
    case 'U':
      return isClockwise ?
        { ...colors, F: colors.R, R: colors.B, B: colors.L, L: colors.F } :
        { ...colors, F: colors.L, L: colors.B, B: colors.R, R: colors.F };
    case 'D':
      return isClockwise ?
        { ...colors, F: colors.L, L: colors.B, B: colors.R, R: colors.F } :
        { ...colors, F: colors.R, R: colors.B, B: colors.L, L: colors.F };
    case 'L':
      return isClockwise ?
        { ...colors, U: colors.B, B: colors.D, D: colors.F, F: colors.U } :
        { ...colors, U: colors.F, F: colors.D, D: colors.B, B: colors.U };
    case 'R':
      return isClockwise ?
        { ...colors, U: colors.F, F: colors.D, D: colors.B, B: colors.U } :
        { ...colors, U: colors.B, B: colors.D, D: colors.F, F: colors.U };
    case 'F':
      return isClockwise ?
        { ...colors, U: colors.L, L: colors.D, D: colors.R, R: colors.U } :
        { ...colors, U: colors.R, R: colors.D, D: colors.L, L: colors.U };
    case 'B':
      return isClockwise ?
        { ...colors, U: colors.R, R: colors.D, D: colors.L, L: colors.U } :
        { ...colors, U: colors.L, L: colors.D, D: colors.R, R: colors.U };
    default:
      return colors;
  }
};

// 旋转动作是否会影响到有颜色的面
export const isAffectingColors = (state: CubeState, move: Move): boolean => {
  const affectedBlocks = getAffectedBlocks(state, move);
  return affectedBlocks.some(block =>
    block.colors.F !== CUBE_COLORS.hidden
    || block.colors.R !== CUBE_COLORS.hidden
    || block.colors.B !== CUBE_COLORS.hidden
    || block.colors.L !== CUBE_COLORS.hidden
    || block.colors.U !== CUBE_COLORS.hidden
    || block.colors.D !== CUBE_COLORS.hidden
  );
};

// 应用移动到魔方状态
export const applyMove = (state: CubeState, move: Move): CubeState => {
  // 处理 2 系列动作（如 U2, D2 等）
  if (TWO_MOVES.includes(move)) {
    const oneMove = TO_ONE_MOVE[move as keyof typeof TO_ONE_MOVE];
    return applyMove(applyMove(state, oneMove), oneMove);
  }

  const newState = JSON.parse(JSON.stringify(state)) as CubeState;
  const affectedBlocks = getAffectedBlocks(state, move);
  
  // 更新受影响块的位置和颜色
  affectedBlocks.forEach(block => {
    const oldBlock = state.pieces.find(
      p => p.position[0] === block.position[0] &&
          p.position[1] === block.position[1] &&
          p.position[2] === block.position[2]
    );
    
    if (oldBlock) {
      const newPosition = rotatePosition(oldBlock.position, move);
      const newColors = rotateColors(oldBlock.colors, move);
      
      // 更新块的新位置和颜色
      const newBlock = newState.pieces.find(
        p => p.position[0] === newPosition[0] &&
            p.position[1] === newPosition[1] &&
            p.position[2] === newPosition[2]
      );
      
      if (newBlock) {
        newBlock.colors = newColors;
      }
    }
  });
  
  return newState;
};
