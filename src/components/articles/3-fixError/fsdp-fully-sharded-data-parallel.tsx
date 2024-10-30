"use client"
import { useState, useEffect } from "react";
import { Music, Users, ArrowsUpDown, Memory, Play, RotateCcw } from "lucide-react";

interface Musician {
  id: number;
  score: number;
  memory: number;
  isProcessing: boolean;
  isSyncing: boolean;
}

interface ComponentProps {}

const INITIAL_MUSICIANS: Musician[] = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  score: 25,
  memory: 0,
  isProcessing: false,
  isSyncing: false,
}));

/**
 * FSDP Orchestra Simulator - Educational component for teaching distributed training
 */
const FSDPOrchestra: React.FC<ComponentProps> = () => {
  const [musicians, setMusicians] = useState<Musician[]>(INITIAL_MUSICIANS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [performance, setPerformance] = useState<number>(0);

  const handleStartPractice = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setMusicians(INITIAL_MUSICIANS);
    setPerformance(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMusicians(prev => prev.map(musician => ({
        ...musician,
        isProcessing: true,
        memory: Math.min(musician.memory + 10, 100),
      })));

      setTimeout(() => {
        setMusicians(prev => prev.map(musician => ({
          ...musician,
          isProcessing: false,
          isSyncing: true,
          memory: Math.max(musician.memory - 30, 0),
        })));

        setTimeout(() => {
          setMusicians(prev => prev.map(musician => ({
            ...musician,
            isSyncing: false,
          })));
          setPerformance(prev => Math.min(prev + 5, 100));
        }, 1000);
      }, 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="text-blue-500" />
          FSDP Orchestra Simulator
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleStartPractice}
            disabled={isPlaying}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            aria-label="Start practice"
          >
            <Play size={20} />
            Practice
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
            aria-label="Reset simulation"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {musicians.map(musician => (
          <div
            key={musician.id}
            className={`p-4 border rounded-lg transition-colors duration-300 ${
              musician.isProcessing ? 'bg-blue-100' : musician.isSyncing ? 'bg-green-100' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-gray-600" />
              <span className="font-medium">Musician {musician.id + 1}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="text-gray-600" size={16} />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${musician.score}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Memory className="text-gray-600" size={16} />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${musician.memory}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 bg-white rounded-lg">
        <ArrowsUpDown className="text-blue-500" />
        <span className="font-medium">Orchestra Performance:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${performance}%` }}
          />
        </div>
        <span>{performance}%</span>
      </div>
    </div>
  );
};

export default FSDPOrchestra;