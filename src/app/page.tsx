'use client';

import { Scene } from '@/components/Scene';
import { useCubeStore } from '@/store/cubeStore';
import { useState } from 'react';

export default function Home() {
  const { cubeRef: sharedCubeRef, setCubeRef } = useCubeStore();
  const [formula, setFormula] = useState('');

  const handleScramble = () => {
    const formula = sharedCubeRef?.current?.scrambleCube();
    setFormula(formula || '');
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
          <span className="text-green-500">{formula}</span>
        </p>
        <button onClick={handleScramble} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">{ formula ? '下一题' : '开始练习' }</button>
      </div>
    </div>
  );
}
