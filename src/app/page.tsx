'use client';

import { Scene } from '@/components/Scene';

export default function Home() {
  return (
    <div className="w-full h-screen bg-gray-900 flex">
      <div className="absolute top-4 left-4 w-[300px]">
        <Scene showControls={true} showCube={false} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[61.8vh] h-[61.8vh]">
          <Scene showControls={false} showCube={true} isMain={true} />
        </div>
      </div>
    </div>
  );
}
