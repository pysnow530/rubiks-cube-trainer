'use client';

import { Scene } from '@/components/Scene';
import { useCubeStore } from '@/store/cubeStore';
import { useState } from 'react';

export default function Home() {
  const { cubeRef: sharedCubeRef, setCubeRef } = useCubeStore();
  const [formula, setFormula] = useState('');
  const [shortestPath, setShortestPath] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [correctLength, setCorrectLength] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleScramble = () => {
    const formula = sharedCubeRef?.current?.scrambleCube();
    setFormula(formula || '');
    setShortestPath('');
    setHasGuessed(false);
    setUserGuess(null);
    setCorrectLength(null);
  };

  const handleGuess = async (guess: number) => {
    setUserGuess(guess);
    setHasGuessed(true);
    setIsCalculating(true);
    
    // 使用 setTimeout 让 UI 先更新显示"结果校验中"
    setTimeout(() => {
      const solution = sharedCubeRef?.current?.getShortestPath() || '';
      setShortestPath(solution);
      setCorrectLength(solution.split(' ').filter(Boolean).length);
      setIsCalculating(false);
    }, 0);
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex">
      <div className="absolute top-4 left-4 w-[300px]">
        <Scene showControls={true} showCube={false} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[61.8vh] h-[61.8vh]">
          <Scene showControls={false} showCube={true} isMain={true} />
        </div>
        <p>
          <span className="text-gray-500">打乱公式：</span>
          <span className="text-green-500 font-mono">{formula}</span>
        </p>
        
        {formula && !hasGuessed && (
          <div className="mt-4">
            <p className="text-gray-500 mb-2">请选择最短路径的步数：</p>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => handleGuess(num)}
                  className="bg-blue-500 text-white w-10 h-10 rounded hover:bg-blue-600"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasGuessed && (
          <div className="mt-4 text-center">
            {isCalculating ? (
              <p className="text-xl text-blue-500">结果校验中...</p>
            ) : (
              <>
                <p className={`text-xl ${userGuess === correctLength ? 'text-green-500' : 'text-red-500'}`}>
                  {userGuess === correctLength ? '答对了！' : '答错了！'}
                </p>
                <p className="text-white mt-2">
                  最短路径：<span className="text-green-500 font-mono">{shortestPath}</span>
                  <span className="text-gray-500 ml-2">({correctLength} 步)</span>
                </p>
                <button 
                  onClick={handleScramble} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                >
                  下一题
                </button>
              </>
            )}
          </div>
        )}

        {!formula && (
          <button 
            onClick={handleScramble} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            开始练习
          </button>
        )}
      </div>
    </div>
  );
}
