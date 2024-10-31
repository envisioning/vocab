"use client"
import { useState, useEffect } from "react";
import { Play, Pause, RefreshCw, Circle } from "lucide-react";

interface BalanceMasterProps {}

type CharacterState = {
  position: number;
  stability: number;
  fallen: boolean;
};

const BalanceMaster: React.FC<BalanceMasterProps> = () => {
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [learningRate, setLearningRate] = useState<number>(0.5);
  const [epochs, setEpochs] = useState<number>(10);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [character, setCharacter] = useState<CharacterState>({
    position: 50,
    stability: 0,
    fallen: false,
  });
  const [progressData, setProgressData] = useState<number[]>([]);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;

    const updateCharacter = (timestamp: number) => {
      if (!isTraining || character.fallen) return;
      
      const delta = timestamp - lastTime;
      if (delta > 100) {
        lastTime = timestamp;
        
        const noise = (Math.random() - 0.5) * (1 - character.stability);
        const newPosition = character.position + noise * learningRate;
        const newStability = character.stability + learningRate * 0.1;
        
        const fallen = newPosition < 20 || newPosition > 80;
        
        setCharacter({
          position: fallen ? 50 : newPosition,
          stability: fallen ? 0 : Math.min(newStability, 0.9),
          fallen,
        });

        if (fallen) {
          setCurrentEpoch(prev => {
            const next = prev + 1;
            if (next >= epochs) {
              setIsTraining(false);
              return 0;
            }
            return next;
          });
        }

        setProgressData(prev => [...prev, character.stability].slice(-20));
      }
      
      animationFrame = requestAnimationFrame(updateCharacter);
    };

    if (isTraining) {
      animationFrame = requestAnimationFrame(updateCharacter);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isTraining, character, learningRate, epochs]);

  const handleReset = () => {
    setIsTraining(false);
    setCharacter({ position: 50, stability: 0, fallen: false });
    setCurrentEpoch(0);
    setProgressData([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-2xl font-bold text-center mb-8">
        The Balance Master Trainer
      </div>

      <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute w-full h-2 bg-blue-500 top-1/2 transform -translate-y-1/2" />
        <Circle
          className={`absolute transform -translate-y-1/2 transition-all duration-300 ${
            character.fallen ? "text-red-500" : "text-green-500"
          }`}
          style={{ left: `${character.position}%`, top: "50%" }}
          size={24}
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setIsTraining(!isTraining)}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        >
          {isTraining ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Learning Rate: {learningRate}
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Epochs: {epochs}
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={epochs}
            onChange={(e) => setEpochs(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="h-32 bg-gray-100 rounded-lg p-2">
        {progressData.map((value, index) => (
          <div
            key={index}
            className="inline-block w-1 bg-blue-500 mx-px transition-all duration-300"
            style={{ height: `${value * 100}%` }}
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Current Epoch: {currentEpoch} / {epochs}
      </div>
    </div>
  );
};

export default BalanceMaster;