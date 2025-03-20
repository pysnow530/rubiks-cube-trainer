'use client';

import { useEffect, useState } from 'react';
import { Move, CubeState } from '@/types/cube';

interface ControlsProps {
  onMove: (move: Move) => void;
  onScramble: () => void;
  onReset: () => void;
  onSolve: () => void;
}

export const Controls = ({ onMove, onScramble, onReset, onSolve }: ControlsProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isUpperCase = e.key === e.key.toUpperCase();
      let move: Move | null = null;

      switch (key) {
        case 'u':
          move = isUpperCase ? 'U\'' : 'U';
          break;
        case 'd':
          move = isUpperCase ? 'D\'' : 'D';
          break;
        case 'l':
          move = isUpperCase ? 'L\'' : 'L';
          break;
        case 'r':
          move = isUpperCase ? 'R\'' : 'R';
          break;
        case 'f':
          move = isUpperCase ? 'F\'' : 'F';
          break;
        case 'b':
          move = isUpperCase ? 'B\'' : 'B';
          break;
      }

      if (move) {
        onMove(move);
        setMoveCount((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);

  const handleTimerToggle = () => {
    if (!isRunning) {
      setTime(0);
      setMoveCount(0);
    }
    setIsRunning(!isRunning);
  };

  const handleScramble = () => {
    onScramble();
    setTime(0);
    setMoveCount(0);
    setIsRunning(false);
  };

  const handleReset = () => {
    onReset();
    setTime(0);
    setMoveCount(0);
    setIsRunning(false);
  };

  const handleSolve = () => {
    console.log('in handleSolve()');
    onSolve();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

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
