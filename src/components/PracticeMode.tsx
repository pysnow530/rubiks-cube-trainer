'use client';

import { useState } from 'react';
import { CubeMode } from '@/types/cube';

interface PracticeModeProps {
  onModeChange: (mode: CubeMode) => void;
  onScramble: () => void;
}

export const PracticeMode = ({ onModeChange, onScramble }: PracticeModeProps) => {
  const [mode, setMode] = useState<CubeMode>('normal');
  const [answer, setAnswer] = useState<string>('');

  const handleModeChange = () => {
    const newMode = mode === 'normal' ? 'cross' : 'normal';
    setMode(newMode);
    onModeChange(newMode);
  };

  const handleScramble = () => {
    onScramble();
  };

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <button
        onClick={handleModeChange}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {mode === 'normal' ? '底层十字' : '普通模式'}
      </button>
      {mode === 'cross' && (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="输入最少步数"
            className="px-4 py-2 bg-white/20 rounded text-white placeholder-white/50"
          />
          <button
            onClick={handleScramble}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            重新打乱
          </button>
        </div>
      )}
    </div>
  );
};
