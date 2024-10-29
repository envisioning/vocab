"use client"
import { useState, useEffect } from "react";
import { Dog, Cat, Bot, Star, Heart, Brain, Trophy, ArrowRight, RefreshCw } from "lucide-react";

interface PetType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface TrainingState {
  happiness: number;
  learning: number;
  tricks: string[];
}

const PETS: PetType[] = [
  { id: "dog", name: "Puppy", icon: <Dog /> },
  { id: "cat", name: "Kitten", icon: <Cat /> },
  { id: "robot", name: "Robot", icon: <Bot /> }
];

const TRICKS = ["sit", "stay", "roll", "fetch"];

/**
 * RLPetAcademy - Interactive component teaching reinforcement learning through pet training
 */
export default function RLPetAcademy() {
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [trainingState, setTrainingState] = useState<TrainingState>({
    happiness: 50,
    learning: 0,
    tricks: []
  });
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrick, setCurrentTrick] = useState<string>("");

  useEffect(() => {
    if (isTraining && currentTrick) {
      const trainingInterval = setInterval(() => {
        setTrainingState(prev => ({
          ...prev,
          learning: Math.min(prev.learning + 10, 100),
          happiness: Math.max(prev.happiness - 5, 0)
        }));
      }, 1000);

      return () => clearInterval(trainingInterval);
    }
  }, [isTraining, currentTrick]);

  const handlePetSelect = (pet: PetType) => {
    setSelectedPet(pet);
    setTrainingState({ happiness: 50, learning: 0, tricks: [] });
  };

  const handleTreat = () => {
    if (trainingState.learning >= 100) {
      setTrainingState(prev => ({
        ...prev,
        happiness: Math.min(prev.happiness + 20, 100),
        tricks: [...prev.tricks, currentTrick],
        learning: 0
      }));
      setIsTraining(false);
      setCurrentTrick("");
    }
  };

  const startTraining = (trick: string) => {
    setCurrentTrick(trick);
    setIsTraining(true);
  };

  const reset = () => {
    setSelectedPet(null);
    setTrainingState({ happiness: 50, learning: 0, tricks: [] });
    setIsTraining(false);
    setCurrentTrick("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">RL Pet Academy</h1>
      
      {!selectedPet ? (
        <div className="grid grid-cols-3 gap-4">
          {PETS.map(pet => (
            <button
              key={pet.id}
              onClick={() => handlePetSelect(pet)}
              className="p-4 border rounded-lg hover:bg-blue-50 transition duration-300 flex flex-col items-center"
              aria-label={`Select ${pet.name}`}
            >
              {pet.icon}
              <span className="mt-2">{pet.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedPet.icon}
              <span className="font-bold">{selectedPet.name}</span>
            </div>
            <button
              onClick={reset}
              className="p-2 text-gray-600 hover:text-blue-600"
              aria-label="Reset training"
            >
              <RefreshCw />
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <Heart className={`${trainingState.happiness > 50 ? 'text-red-500' : 'text-gray-400'}`} />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${trainingState.happiness}%` }}
              />
            </div>
          </div>

          {isTraining && (
            <div className="flex gap-4 items-center">
              <Brain className="text-blue-500" />
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${trainingState.learning}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {TRICKS.filter(trick => !trainingState.tricks.includes(trick)).map(trick => (
              <button
                key={trick}
                onClick={() => startTraining(trick)}
                disabled={isTraining}
                className="p-2 border rounded-lg hover:bg-blue-50 disabled:opacity-50 transition duration-300"
              >
                Train "{trick}"
              </button>
            ))}
          </div>

          {isTraining && trainingState.learning >= 100 && (
            <button
              onClick={handleTreat}
              className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            >
              Give Treat! <Star className="inline ml-2" />
            </button>
          )}

          {trainingState.tricks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold flex items-center gap-2">
                <Trophy /> Learned Tricks
              </h3>
              <ul className="list-disc list-inside">
                {trainingState.tricks.map(trick => (
                  <li key={trick}>{trick}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}