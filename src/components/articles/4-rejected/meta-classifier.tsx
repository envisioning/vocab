"use client"
import { useState, useEffect } from "react";
import { Brain, User2, Gauge, Award, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Expert {
  id: number;
  name: string;
  specialty: string;
  accuracy: number;
  icon: JSX.Element;
}

interface Scenario {
  id: number;
  case: string;
  difficulty: number;
  correctAnswer: string;
}

const EXPERTS: Expert[] = [
  { id: 1, name: "Dr. Watson", specialty: "Medical", accuracy: 0.8, icon: <User2 className="w-6 h-6" /> },
  { id: 2, name: "Tech Bot", specialty: "Technical", accuracy: 0.75, icon: <Brain className="w-6 h-6" /> },
  { id: 3, name: "Inspector", specialty: "Analysis", accuracy: 0.85, icon: <Gauge className="w-6 h-6" /> },
];

const SCENARIOS: Scenario[] = [
  { id: 1, case: "Patient Diagnosis", difficulty: 1, correctAnswer: "Flu" },
  { id: 2, case: "Device Malfunction", difficulty: 2, correctAnswer: "Battery" },
  { id: 3, case: "Pattern Recognition", difficulty: 3, correctAnswer: "Anomaly" },
];

/**
 * MetaClassifierArena - Interactive component teaching meta-classification
 * through expert panel metaphor
 */
export default function MetaClassifierArena() {
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [prediction, setPrediction] = useState<string>("");
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleExpertSelect = (expert: Expert) => {
    if (selectedExperts.find(e => e.id === expert.id)) {
      setSelectedExperts(prev => prev.filter(e => e.id !== expert.id));
    } else if (selectedExperts.length < 3) {
      setSelectedExperts(prev => [...prev, expert]);
    }
  };

  const makePrediction = () => {
    if (selectedExperts.length === 0) {
      return;
    }
    
    const combinedAccuracy = selectedExperts.reduce((acc, expert) => acc + expert.accuracy, 0) / selectedExperts.length;
    const isCorrect = Math.random() < combinedAccuracy;
    
    setPrediction(isCorrect ? currentScenario.correctAnswer : "Incorrect");
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="text-blue-500" />
          Meta-Classifier Arena
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {EXPERTS.map(expert => (
            <button
              key={expert.id}
              onClick={() => handleExpertSelect(expert)}
              className={`p-4 rounded-lg transition-all duration-300 flex items-center gap-2
                ${selectedExperts.includes(expert) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              aria-pressed={selectedExperts.includes(expert)}
            >
              {expert.icon}
              <div className="text-left">
                <div className="font-bold">{expert.name}</div>
                <div className="text-sm">{expert.specialty}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Current Case: {currentScenario.case}</h3>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`text-yellow-500 ${isAnimating ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
            <span>Difficulty: {Array(currentScenario.difficulty).fill('★').join('')}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={makePrediction}
            disabled={selectedExperts.length === 0}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity duration-300"
          >
            Make Prediction
          </button>
          
          {prediction && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              <span>Prediction: {prediction}</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Score: {score} | Selected Experts: {selectedExperts.length}/3
        </div>
      </div>
    </div>
  );
}