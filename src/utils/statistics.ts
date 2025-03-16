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
  // 如果尝试次数不足，用0.5补全
  const correctCount = targetAttempts.filter(a => a.isCorrect).length;
  const missingCount = count - targetAttempts.length;
  return ((correctCount + missingCount * 0.5) / count) * 100;
};

export const calculateAverageTime = (attempts: SolveAttempt[], count: number): number => {
  const targetAttempts = [...attempts].slice(-count);
  if (targetAttempts.length === 0) return 0;
  const totalTime = targetAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  return totalTime / targetAttempts.length;
};

export const updateStatistics = (stats: Statistics): Statistics => {
  const { attempts } = stats;
  return {
    attempts,
    last12Rate: calculateSuccessRate(attempts, 12),
    last12AvgTime: calculateAverageTime(attempts, 12)
  };
};
