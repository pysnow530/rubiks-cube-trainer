import { SolveAttempt, Statistics } from "@/types/statistics";

const STORAGE_KEY = 'cube-trainer-statistics';

export const loadStatistics = (): Statistics => {
  if (typeof window === 'undefined') {
    return { attempts: [], last5Rate: 0, last12Rate: 0, last100Rate: 0 };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { attempts: [], last5Rate: 0, last12Rate: 0, last100Rate: 0 };
  }

  return JSON.parse(stored);
};

export const saveStatistics = (stats: Statistics) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const calculateSuccessRate = (attempts: SolveAttempt[], count: number): number => {
  const targetAttempts = [...attempts].slice(-count);
  // 如果尝试次数不足，用失败补全
  while (targetAttempts.length < count) {
    targetAttempts.unshift({
      id: -1,
      timestamp: 0,
      timeSpent: 0,
      isCorrect: false,
      userGuess: 0,
      actualLength: 0,
      scrambleFormula: '',
      solutionFormula: ''
    });
  }
  const correctCount = targetAttempts.filter(a => a.isCorrect).length;
  return (correctCount / count) * 100;
};

export const updateStatistics = (stats: Statistics): Statistics => {
  const { attempts } = stats;
  return {
    attempts,
    last5Rate: calculateSuccessRate(attempts, 5),
    last12Rate: calculateSuccessRate(attempts, 12),
    last100Rate: calculateSuccessRate(attempts, 100)
  };
};
