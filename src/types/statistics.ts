export interface SolveAttempt {
  id: number;
  timestamp: number;
  timeSpent: number;
  isCorrect: boolean;
  userGuess: number;
  actualLength: number;
  scrambleFormula: string;
  solutionFormula: string;
}

export interface Statistics {
  attempts: SolveAttempt[];
  last12Rate: number;
  last12AvgTime: number;
}
