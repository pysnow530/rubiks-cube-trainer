import {CUBE_COLORS, CubeState} from "@/types/cube";
import {Move} from "@/types/cube";
import {applyMove} from "./cubeRotation";

const isSolved = (state: CubeState): boolean => {
    const center = state.pieces.find(block => block.position[0] === 0 && block.position[1] === -1 && block.position[2] === 0);
    const edgeFront = state.pieces.find(block => block.position[0] === 0 && block.position[1] === -1 && block.position[2] === 1);
    const edgeRight = state.pieces.find(block => block.position[0] === 1 && block.position[1] === -1 && block.position[2] === 0);
    const edgeBack = state.pieces.find(block => block.position[0] === 0 && block.position[1] === -1 && block.position[2] === -1);
    const edgeLeft = state.pieces.find(block => block.position[0] === -1 && block.position[1] === -1 && block.position[2] === 0);

    if (center?.colors.D !== CUBE_COLORS.white) {
        return false;
    }

    if (edgeFront?.colors.D !== CUBE_COLORS.white) {
        return false;
    }

    if (edgeRight?.colors.D !== CUBE_COLORS.white) {
        return false;
    }

    if (edgeBack?.colors.D !== CUBE_COLORS.white) {
        return false;
    }

    if (edgeLeft?.colors.D !== CUBE_COLORS.white) {
        return false;
    }

    const valid = [CUBE_COLORS.green, CUBE_COLORS.red, CUBE_COLORS.blue, CUBE_COLORS.orange];
    const curr = [edgeFront.colors.F, edgeLeft.colors.L, edgeBack.colors.B, edgeRight.colors.R];
    if (curr[0] === valid[0] && curr[1] === valid[1] && curr[2] === valid[2] && curr[3] === valid[3]) {
        return true;
    } else if (curr[0] === valid[1] && curr[1] === valid[2] && curr[2] === valid[3] && curr[3] === valid[0]) {
        return true;
    } else if (curr[0] === valid[2] && curr[1] === valid[3] && curr[2] === valid[0] && curr[3] === valid[1]) {
        return true;
    } else if (curr[0] === valid[3] && curr[1] === valid[0] && curr[2] === valid[1] && curr[3] === valid[2]) {
        return true;
    } else {
        return false;
    }
};

const isOpposite = (char1: string, char2: string) => {
    return (char1 === 'L' && char2 === 'R'
        || char1 === 'R' && char2 === 'L'
        || char1 === 'U' && char2 === 'D'
        || char1 === 'D' && char2 === 'U'
        || char1 === 'F' && char2 === 'B'
        || char1 === 'B' && char2 === 'F');
}

export const solveCube = (state: CubeState): string => {
    if (isSolved(state)) return '';

    const moves: Move[] = [
        'U', 'D', 'L', 'R', 'F', 'B', "U'", "D'", "L'", "R'", "F'", "B'", 'U2', 'D2', 'L2', 'R2', 'F2', 'B2',
    ];
    let cache = new Map<Move[], CubeState>();
    cache.set([], state);

    for (let i = 0; i < 4; i++) {
        const newCache = new Map<Move[], CubeState>();
        for (const key of cache.keys()) {
            console.log(`尝试序列前缀：${key}`);
            for (const move of moves) {
                if (key.length >= 1 && key[key.length - 1][0] === move[0]) continue; // 跟上次是同个旋转面，直接跳过
                if (key.length >= 2 && key[key.length - 2][0] === move[0] && isOpposite(key[key.length - 1][0], move[0])) continue; // 跟上次是同个旋转面，直接跳过

                const newState = applyMove(cache.get(key)!, move);
                const newKey = key.concat([move]);
                if (isSolved(newState)) {
                    return newKey.join(' ');
                } else {
                    newCache.set(newKey, newState);
                }
            }
        }
        cache = newCache;
    }
    return '';
};