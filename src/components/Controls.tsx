'use client';

import { Move } from '@/types/cube';

interface ControlsProps {
  onMove: (move: Move) => void;
  onScramble: () => void;
  onReset: () => void;
  onSolve: () => void;
}

export const Controls = ({}: ControlsProps) => {
  return (
    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm w-100">
      <div className="text-white text-sm">
        <h3 className="font-bold mb-1">提示：</h3>
        <div className="text-sm">
          <div>1. 连续两次旋转同一面，记为1步，如R2为1步</div>
        </div>
      </div>
    </div>
  );
};
