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
    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm w-64">
      <div className="text-4xl font-mono mb-2 text-white text-center">
        {formatTime(time)}
      </div>
      <div className="text-white mb-2 text-center">
        Moves: {moveCount}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={handleTimerToggle}
          className={`col-span-2 px-4 py-2 rounded text-white ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </button>
        <button
          onClick={handleScramble}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Scramble
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
        <button
          onClick={handleSolve}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Solve
        </button>
      </div>
      <div className="text-white text-sm">
        <h3 className="font-bold mb-1">Controls:</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>U/u - Upper</div>
          <div>D/d - Down</div>
          <div>L/l - Left</div>
          <div>R/r - Right</div>
          <div>F/f - Front</div>
          <div>B/b - Back</div>
        </div>
        <div className="mt-1 text-xs text-white/80">
          <div>Lowercase - Clockwise</div>
          <div>Uppercase - Counter-clockwise</div>
        </div>
      </div>
    </div>
  );
};
