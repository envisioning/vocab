"use client"
import { useState, useEffect } from "react";
import { Building2, ChefHat, Brain, Award, Star, FastForward, RotateCcw } from "lucide-react";

interface Architecture {
  id: number;
  layers: number[];
  performance: number;
  selected: boolean;
}

interface ComponentProps {}

const INITIAL_ARCHITECTURES: Architecture[] = [
  { id: 1, layers: [2, 3, 2], performance: 0.65, selected: false },
  { id: 2, layers: [3, 4, 2], performance: 0.75, selected: false },
  { id: 3, layers: [2, 4, 3], performance: 0.70, selected: false },
  { id: 4, layers: [4, 3, 2], performance: 0.80, selected: false },
];

/**
 * Neural Architecture Search (NAS) Interactive Learning Component
 * Teaches automated neural network design through architecture evolution
 */
export default function NASLearningLab({}: ComponentProps) {
  const [generation, setGeneration] = useState<number>(1);
  const [architectures, setArchitectures] = useState<Architecture[]>(INITIAL_ARCHITECTURES);
  const [isEvolutionActive, setIsEvolutionActive] = useState<boolean>(false);
  const [bestPerformance, setBestPerformance] = useState<number>(0);

  useEffect(() => {
    if (!isEvolutionActive) return;

    const evolutionInterval = setInterval(() => {
      if (generation < 5) {
        evolveArchitectures();
        setGeneration(prev => prev + 1);
      } else {
        setIsEvolutionActive(false);
      }
    }, 2000);

    return () => clearInterval(evolutionInterval);
  }, [isEvolutionActive, generation]);

  const evolveArchitectures = () => {
    const newArchitectures = architectures.map(arch => ({
      ...arch,
      performance: Math.min(arch.performance + Math.random() * 0.1, 1),
      layers: arch.layers.map(l => Math.max(2, l + Math.floor(Math.random() * 3) - 1))
    }));

    const maxPerformance = Math.max(...newArchitectures.map(a => a.performance));
    setBestPerformance(maxPerformance);
    setArchitectures(newArchitectures);
  };

  const handleArchitectureClick = (id: number) => {
    setArchitectures(prev =>
      prev.map(arch => ({
        ...arch,
        selected: arch.id === id ? !arch.selected : arch.selected
      }))
    );
  };

  const resetSimulation = () => {
    setGeneration(1);
    setArchitectures(INITIAL_ARCHITECTURES);
    setBestPerformance(0);
    setIsEvolutionActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-blue-500" />
          Neural Architecture Search Lab
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsEvolutionActive(!isEvolutionActive)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            aria-label={isEvolutionActive ? "Pause Evolution" : "Start Evolution"}
          >
            <FastForward className={isEvolutionActive ? "animate-pulse" : ""} />
            {isEvolutionActive ? "Pause" : "Start"} Evolution
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            <RotateCcw />
            Reset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="text-blue-500" />
          <span>Generation: {generation}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="text-green-500" />
          <span>Best Performance: {(bestPerformance * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {architectures.map((arch) => (
          <button
            key={arch.id}
            onClick={() => handleArchitectureClick(arch.id)}
            className={`p-4 rounded-lg transition duration-300 ${
              arch.selected ? "bg-blue-100 border-2 border-blue-500" : "bg-white"
            }`}
            aria-pressed={arch.selected}
          >
            <div className="flex flex-col items-center gap-2">
              <ChefHat className={arch.performance > 0.8 ? "text-green-500" : "text-gray-500"} />
              <div className="flex gap-1">
                {arch.layers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="w-4 bg-blue-500"
                    style={{ height: `${layer * 12}px` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-blue-500" />
                <span>{(arch.performance * 100).toFixed(1)}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}