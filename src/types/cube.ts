export type CubeState = {
  pieces: {
    position: [number, number, number];
    colors: string[];  // [right, left, top, bottom, front, back]
  }[];
};

export type Move = 'U' | 'U\'' | 'D' | 'D\'' | 'L' | 'L\'' | 'R' | 'R\'' | 'F' | 'F\'' | 'B' | 'B\'';

// 定义魔方的标准颜色（黄顶绿前）
const CUBE_COLORS = {
  RIGHT: 'red',      // 右面
  LEFT: 'orange',    // 左面
  TOP: 'yellow',     // 上面（黄色）
  BOTTOM: 'white',   // 下面
  FRONT: 'green',    // 前面（绿色）
  BACK: 'blue',      // 后面
};

export const INITIAL_CUBE_STATE: CubeState = {
  pieces: [
    // 前面 (z = 1)
    { position: [-1, -1, 1], colors: ['', CUBE_COLORS.LEFT, '', CUBE_COLORS.BOTTOM, CUBE_COLORS.FRONT, ''] },  // 左下前
    { position: [0, -1, 1], colors: ['', '', '', CUBE_COLORS.BOTTOM, CUBE_COLORS.FRONT, ''] },      // 中下前
    { position: [1, -1, 1], colors: [CUBE_COLORS.RIGHT, '', '', CUBE_COLORS.BOTTOM, CUBE_COLORS.FRONT, ''] }, // 右下前
    { position: [-1, 0, 1], colors: ['', CUBE_COLORS.LEFT, '', '', CUBE_COLORS.FRONT, ''] },        // 左中前
    { position: [0, 0, 1], colors: ['', '', '', '', CUBE_COLORS.FRONT, ''] },             // 中心前
    { position: [1, 0, 1], colors: [CUBE_COLORS.RIGHT, '', '', '', CUBE_COLORS.FRONT, ''] },        // 右中前
    { position: [-1, 1, 1], colors: ['', CUBE_COLORS.LEFT, CUBE_COLORS.TOP, '', CUBE_COLORS.FRONT, ''] },   // 左上前
    { position: [0, 1, 1], colors: ['', '', CUBE_COLORS.TOP, '', CUBE_COLORS.FRONT, ''] },        // 中上前
    { position: [1, 1, 1], colors: [CUBE_COLORS.RIGHT, '', CUBE_COLORS.TOP, '', CUBE_COLORS.FRONT, ''] },   // 右上前

    // 中间层 (z = 0)
    { position: [-1, -1, 0], colors: ['', CUBE_COLORS.LEFT, '', CUBE_COLORS.BOTTOM, '', ''] },    // 左下中
    { position: [0, -1, 0], colors: ['', '', '', CUBE_COLORS.BOTTOM, '', ''] },                   // 中下
    { position: [1, -1, 0], colors: [CUBE_COLORS.RIGHT, '', '', CUBE_COLORS.BOTTOM, '', ''] },    // 右下中
    { position: [-1, 0, 0], colors: ['', CUBE_COLORS.LEFT, '', '', '', ''] },                     // 左中
    { position: [0, 0, 0], colors: ['', '', '', '', '', ''] },                                    // 中心
    { position: [1, 0, 0], colors: [CUBE_COLORS.RIGHT, '', '', '', '', ''] },                     // 右中
    { position: [-1, 1, 0], colors: ['', CUBE_COLORS.LEFT, CUBE_COLORS.TOP, '', '', ''] },      // 左上中
    { position: [0, 1, 0], colors: ['', '', CUBE_COLORS.TOP, '', '', ''] },                     // 中上
    { position: [1, 1, 0], colors: [CUBE_COLORS.RIGHT, '', CUBE_COLORS.TOP, '', '', ''] },      // 右上中

    // 后面 (z = -1)
    { position: [-1, -1, -1], colors: ['', CUBE_COLORS.LEFT, '', CUBE_COLORS.BOTTOM, '', CUBE_COLORS.BACK] }, // 左下后
    { position: [0, -1, -1], colors: ['', '', '', CUBE_COLORS.BOTTOM, '', CUBE_COLORS.BACK] },      // 中下后
    { position: [1, -1, -1], colors: [CUBE_COLORS.RIGHT, '', '', CUBE_COLORS.BOTTOM, '', CUBE_COLORS.BACK] }, // 右下后
    { position: [-1, 0, -1], colors: ['', CUBE_COLORS.LEFT, '', '', '', CUBE_COLORS.BACK] },        // 左中后
    { position: [0, 0, -1], colors: ['', '', '', '', '', CUBE_COLORS.BACK] },             // 中心后
    { position: [1, 0, -1], colors: [CUBE_COLORS.RIGHT, '', '', '', '', CUBE_COLORS.BACK] },        // 右中后
    { position: [-1, 1, -1], colors: ['', CUBE_COLORS.LEFT, CUBE_COLORS.TOP, '', '', CUBE_COLORS.BACK] },   // 左上后
    { position: [0, 1, -1], colors: ['', '', CUBE_COLORS.TOP, '', '', CUBE_COLORS.BACK] },        // 中上后
    { position: [1, 1, -1], colors: [CUBE_COLORS.RIGHT, '', CUBE_COLORS.TOP, '', '', CUBE_COLORS.BACK] },   // 右上后
  ],
};
