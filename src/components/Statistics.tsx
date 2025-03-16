'use client';

import { SolveAttempt } from '@/types/statistics';
import type { Statistics as StatisticsType } from '@/types/statistics';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        callback: function(value) {
          return `${value}%`;
        },
        color: 'rgba(255, 255, 255, 0.5)',
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
      }
    },
  },
};

interface StatisticsProps {
  statistics: StatisticsType;
}

interface AttemptDetailProps {
  attempt: SolveAttempt;
  onClose: () => void;
}

const AttemptDetail = ({ attempt, onClose }: AttemptDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <h3 className="text-xl text-white mb-4">第 {attempt.id} 次答题详情</h3>
        <div className="space-y-2 text-gray-300">
          <p>用时：{(attempt.timeSpent / 1000).toFixed(1)} 秒</p>
          <p>答案：{attempt.userGuess} 步（{attempt.isCorrect ? '正确' : '错误'}）</p>
          <p>实际步数：{attempt.actualLength} 步</p>
          <p className="font-mono">打乱公式：{attempt.scrambleFormula}</p>
          <p className="font-mono">复原公式：{attempt.solutionFormula}</p>
        </div>
        <button 
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export const Statistics = ({ statistics }: StatisticsProps) => {
  const [selectedAttempt, setSelectedAttempt] = useState<SolveAttempt | null>(null);

  const chartData = {
    labels: ['最近5次', '最近12次', '最近100次'],
    datasets: [
      {
        label: '正确率',
        data: [statistics.last5Rate, statistics.last12Rate, statistics.last100Rate],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      }
    ],
  };

  return (
    <div className="w-[300px] bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl text-white mb-4">统计信息</h2>
      
      <div className="h-[200px] mb-6">
        <Line options={options} data={chartData} />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {statistics.attempts.slice().reverse().map(attempt => (
          <div 
            key={attempt.id}
            className="flex items-center justify-between p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
            onClick={() => setSelectedAttempt(attempt)}
          >
            <div>
              <span className="text-gray-300">#{attempt.id}</span>
              <span className="ml-2 text-gray-400">{(attempt.timeSpent / 1000).toFixed(1)}s</span>
            </div>
            <span className={`${attempt.isCorrect ? 'text-green-500' : 'text-red-500'} font-bold`}>
              {attempt.isCorrect ? '✓' : '✗'}
            </span>
          </div>
        ))}
      </div>

      {selectedAttempt && (
        <AttemptDetail 
          attempt={selectedAttempt} 
          onClose={() => setSelectedAttempt(null)} 
        />
      )}
    </div>
  );
};
