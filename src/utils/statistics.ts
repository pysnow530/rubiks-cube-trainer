import { SolveAttempt, Statistics } from "@/types/statistics";

const STORAGE_KEY = 'cube-trainer-statistics';

export const loadStatistics = (): Statistics => {
  if (typeof window === 'undefined') {
    return { attempts: [], last12Rate: 0, last12AvgTime: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { attempts: [], last12Rate: 0, last12AvgTime: 0 };
  }

  return JSON.parse(stored);
};

export const saveStatistics = (stats: Statistics) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const calculateSuccessRate = (attempts: SolveAttempt[], count: number): number => {
  const targetAttempts = [...attempts].slice(-count);
  if (targetAttempts.length === 0) return 0;
  const correctCount = targetAttempts.filter(a => a.isCorrect).length;
  return (correctCount / targetAttempts.length) * 100;
};

export const calculateAverageTime = (attempts: SolveAttempt[], count: number): number => {
  const targetAttempts = [...attempts].slice(-count);
  if (targetAttempts.length === 0) return 0;
  const totalTime = targetAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  return totalTime / targetAttempts.length;
};

export const getHistoricalData = (attempts: SolveAttempt[], count: number) => {
  const result = [];
  const totalPoints = Math.min(count, attempts.length);
  
  // 从最早的记录开始，每次增加一条记录，计算最近12次的统计
  for (let i = 0; i < totalPoints; i++) {
    const currentAttempts = attempts.slice(0, i + 1);
    const recentAttempts = currentAttempts.slice(-12); // 只取最近12次
    
    result.push({
      successRate: calculateSuccessRate(recentAttempts, recentAttempts.length),
      avgTime: calculateAverageTime(recentAttempts, recentAttempts.length)
    });
  }
  
  return result;
};

export const updateStatistics = (stats: Statistics): Statistics => {
  const { attempts } = stats;
  return {
    attempts,
    last12Rate: calculateSuccessRate(attempts, 12),
    last12AvgTime: calculateAverageTime(attempts, 12)
  };
};
