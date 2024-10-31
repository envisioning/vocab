"use client"
import { useState, useEffect } from "react";
import { Brain, Sprout, Droplet, Sun, RefreshCw } from "lucide-react";

interface PlantData {
  id: number;
  name: string;
  health: number;
  skill: string;
}

interface ComponentProps {}

const INITIAL_PLANTS: PlantData[] = [
  { id: 1, name: "Math Plant", health: 100, skill: "Mathematics" },
  { id: 2, name: "Language Plant", health: 100, skill: "Language" },
  { id: 3, name: "Vision Plant", health: 100, skill: "Computer Vision" },
];

/**
 * CatastrophicForgetting - Educational component demonstrating AI memory limitations
 */
const CatastrophicForgetting: React.FC<ComponentProps> = () => {
  const [plants, setPlants] = useState<PlantData[]>(INITIAL_PLANTS);
  const [resources, setResources] = useState<number>(100);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [isLearning, setIsLearning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLearning && activeSkill !== null) {
      interval = setInterval(() => {
        setPlants(prevPlants => 
          prevPlants.map(plant => ({
            ...plant,
            health: plant.id === activeSkill 
              ? Math.min(100, plant.health + 5)
              : Math.max(0, plant.health - 3)
          }))
        );
        setResources(prev => Math.max(0, prev - 2));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLearning, activeSkill]);

  const handlePlantClick = (id: number) => {
    if (resources <= 0) return;
    setActiveSkill(id);
    setIsLearning(true);
  };

  const handleReset = () => {
    setPlants(INITIAL_PLANTS);
    setResources(100);
    setActiveSkill(null);
    setIsLearning(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-blue-500" />
          Neural Network Memory Garden
        </h1>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Reset garden"
        >
          <RefreshCw size={20} /> Reset
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Sun className="text-yellow-500" />
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-yellow-500 rounded-full h-4 transition-all duration-300"
            style={{ width: `${resources}%` }}
            role="progressbar"
            aria-valuenow={resources}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.map(plant => (
          <button
            key={plant.id}
            onClick={() => handlePlantClick(plant.id)}
            className={`p-4 rounded-lg border-2 transition duration-300 ${
              activeSkill === plant.id ? 'border-blue-500' : 'border-gray-200'
            }`}
            disabled={resources <= 0}
          >
            <div className="flex flex-col items-center gap-2">
              <Sprout 
                className={`w-12 h-12 ${
                  plant.health > 70 ? 'text-green-500' :
                  plant.health > 30 ? 'text-yellow-500' : 'text-red-500'
                }`}
              />
              <h3 className="font-semibold">{plant.skill}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${plant.health}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{plant.health}% Mastery</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-gray-600 text-center">
        Watch how focusing on one skill affects others - just like in neural networks!
      </p>
    </div>
  );
};

export default CatastrophicForgetting;