'use client';

import { Scene } from '@/components/Scene';
import { useCubeStore } from '@/store/cubeStore';
import { useState, useEffect } from 'react';
import { Statistics } from '@/components/Statistics';
import { loadStatistics, saveStatistics, updateStatistics } from '@/utils/statistics';
import { Statistics as StatisticsType, SolveAttempt } from '@/types/statistics';

export default function Home() {
  const { cubeRef: sharedCubeRef, setCubeRef } = useCubeStore();
  const [formula, setFormula] = useState('');
  const [shortestPath, setShortestPath] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [correctLength, setCorrectLength] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [statistics, setStatistics] = useState<StatisticsType>({ 
    attempts: [], 
    last12Rate: 0,
    last12AvgTime: 0
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const stats = loadStatistics();
    setStatistics(stats);
  }, []);

  // 动态计时器
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (startTime > 0 && !hasGuessed) {
      timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100); // 每0.1秒更新一次
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startTime, hasGuessed]);

  const handleScramble = () => {
    const formula = sharedCubeRef?.current?.scrambleCube();
    setFormula(formula || '');
    setShortestPath('');
    setHasGuessed(false);
    setUserGuess(null);
    setCorrectLength(null);
    setStartTime(Date.now());
    setCurrentTime(Date.now());
  };

  const handleGuess = async (guess: number) => {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    
    setUserGuess(guess);
    setHasGuessed(true);
    setIsCalculating(true);
    
    setTimeout(() => {
      const solution = sharedCubeRef?.current?.getShortestPath() || '';
      const solutionLength = solution.split(' ').filter(Boolean).length;
      
      setShortestPath(solution);
      setCorrectLength(solutionLength);
      
      const newAttempt: SolveAttempt = {
        id: statistics.attempts.length + 1,
        timestamp: endTime,
        timeSpent,
        isCorrect: guess === solutionLength,
        userGuess: guess,
        actualLength: solutionLength,
        scrambleFormula: formula,
        solutionFormula: solution
      };
      
      const newStats = updateStatistics({
        attempts: [...statistics.attempts, newAttempt],
        last12Rate: 0,
        last12AvgTime: 0
      });
      
      setStatistics(newStats);
      saveStatistics(newStats);
      setIsCalculating(false);
    }, 0);
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1);
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
        
        {formula && !hasGuessed && (
          <div className="mt-4 text-center">
            <p className="text-2xl text-blue-500 mb-4">
              {formatTime(currentTime - startTime)}s
            </p>
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
          <div className="mt-4 text-center flex flex-col">
            {isCalculating ? (
              <p className="text-xl text-blue-500">结果校验中...</p>
            ) : (
              <>
                <p className={`text-xl ${userGuess === correctLength ? 'text-green-500' : 'text-red-500'}`}>
                  {userGuess === correctLength ? '答对了！' : '答错了！'}
                </p>
                <p className="text-gray-500 mt-2 self-start">
                  打乱公式：<span className="text-green-500 font-mono">{formula}</span>
                </p>
                <p className="text-gray-500 mt-2 self-start">
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
      
      <div className="absolute top-4 right-4">
        <Statistics statistics={statistics} />
      </div>
    </div>
  );
}
