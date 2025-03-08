'use client';

import { useState, useEffect } from 'react';
import { Move } from '@/types/cube';

interface ControlsProps {
  onScramble: () => void;
  onMove: (move: Move) => void;
  onReset: () => void;
}

export const Controls = ({ onScramble, onMove, onReset }: ControlsProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const moveMap: { [key: string]: Move } = {
      'u': 'U', 'U': 'U\'',
      'd': 'D', 'D': 'D\'',
      'l': 'L', 'L': 'L\'',
      'r': 'R', 'R': 'R\'',
      'f': 'F', 'F': 'F\'',
      'b': 'B', 'B': 'B\'',
    };

    if (moveMap[e.key]) {
      onMove(moveMap[e.key]);
      setMoveCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
      <div className="text-4xl font-mono mb-4 text-white">
        {formatTime(time)}
      </div>
      <div className="text-white mb-4">
        Moves: {moveCount}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!isRunning) {
              setTime(0);
              setMoveCount(0);
            }
            setIsRunning(!isRunning);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isRunning ? 'Stop' : 'Start Timer'}
        </button>
        <button
          onClick={() => {
            onScramble();
            setTime(0);
            setMoveCount(0);
            setIsRunning(false);
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Scramble
        </button>
        <button
          onClick={() => {
            onReset();
            setTime(0);
            setMoveCount(0);
            setIsRunning(false);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
      <div className="mt-4 text-white text-sm">
        <h3 className="font-bold mb-2">Controls:</h3>
        <ul className="list-disc list-inside">
          <li>U/u - Upper face</li>
          <li>D/d - Down face</li>
          <li>L/l - Left face</li>
          <li>R/r - Right face</li>
          <li>F/f - Front face</li>
          <li>B/b - Back face</li>
          <li>Lowercase - Clockwise</li>
          <li>Uppercase - Counter-clockwise</li>
        </ul>
      </div>
    </div>
  );
};
