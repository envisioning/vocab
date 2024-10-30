"use client"
import { useState, useEffect } from "react";
import { Dog, Hand, Volume2, Cookie, Sun, Moon, Wind, RefreshCw, Brain, CheckCircle2, XCircle } from "lucide-react";

interface TrainingSession {
  command: string;
  conditions: string[];
  success: boolean;
}

interface PetState {
  happiness: number;
  learning: {
    sit: number;
    stay: number;
    fetch: number;
  };
}

interface EnvironmentCondition {
  id: string;
  icon: JSX.Element;
  label: string;
}

const COMMANDS = ["sit", "stay", "fetch"];
const CONDITIONS: EnvironmentCondition[] = [
  { id: "hand", icon: <Hand size={24} />, label: "Hand Signal" },
  { id: "voice", icon: <Volume2 size={24} />, label: "Voice Command" },
  { id: "treat", icon: <Cookie size={24} />, label: "Treat Reward" },
  { id: "daytime", icon: <Sun size={24} />, label: "Daytime" },
  { id: "night", icon: <Moon size={24} />, label: "Night" },
  { id: "wind", icon: <Wind size={24} />, label: "Windy" },
];

export default function PetTrainingAcademy() {
  const [mode, setMode] = useState<"training" | "testing">("training");
  const [selectedCommand, setSelectedCommand] = useState<string>("sit");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [trainingHistory, setTrainingHistory] = useState<TrainingSession[]>([]);
  const [petState, setPetState] = useState<PetState>({
    happiness: 50,
    learning: { sit: 0, stay: 0, fetch: 0 },
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const calculateSuccess = (): boolean => {
    const baseChance = petState.learning[selectedCommand as keyof typeof petState.learning];
    const conditionsBonus = selectedConditions.length * 10;
    return Math.random() * 100 < (baseChance + conditionsBonus);
  };

  const handleTrain = () => {
    if (selectedConditions.length === 0) return;
    
    setIsAnimating(true);
    const success = calculateSuccess();
    
    setTrainingHistory(prev => [...prev, {
      command: selectedCommand,
      conditions: selectedConditions,
      success
    }]);

    setPetState(prev => ({
      happiness: Math.min(100, prev.happiness + (success ? 5 : -2)),
      learning: {
        ...prev.learning,
        [selectedCommand]: Math.min(100, prev.learning[selectedCommand as keyof typeof prev.learning] + (success ? 10 : 5))
      }
    }));
  };

  const handleConditionToggle = (conditionId: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg max-w-6xl mx-auto h-[600px]">
      <div className="relative flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md">
        <div className={`transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          <Dog size={120} className={`${petState.happiness > 70 ? 'text-green-500' : 'text-gray-600'}`} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Brain size={20} />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${petState.learning[selectedCommand as keyof typeof petState.learning]}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-md">
        <div className="flex gap-2">
          {COMMANDS.map(command => (
            <button
              key={command}
              onClick={() => setSelectedCommand(command)}
              className={`px-4 py-2 rounded-lg ${
                selectedCommand === command ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {command}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CONDITIONS.map(condition => (
            <button
              key={condition.id}
              onClick={() => handleConditionToggle(condition.id)}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                selectedConditions.includes(condition.id) ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-50'
              }`}
            >
              {condition.icon}
              <span className="text-sm">{condition.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleTrain}
          disabled={isAnimating}
          className="mt-auto bg-blue-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          Train Command
        </button>

        <div className="flex flex-col gap-2 mt-4 max-h-32 overflow-y-auto">
          {trainingHistory.map((session, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              {session.success ? <CheckCircle2 className="text-green-500" size={16} /> : <XCircle className="text-red-500" size={16} />}
              <span>{session.command}</span>
              <span className="text-gray-500">({session.conditions.join(", ")})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}