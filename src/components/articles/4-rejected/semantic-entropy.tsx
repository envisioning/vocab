"use client"
import { useState, useEffect } from "react";
import { MessageCircle, MapPin, Clock, User, Users, AlertCircle, Check, X, RefreshCw } from "lucide-react";

interface Clue {
  id: string;
  type: 'location' | 'time' | 'speaker' | 'audience';
  value: string;
  icon: JSX.Element;
  entropyReduction: number;
}

interface Scenario {
  message: string;
  initialEntropy: number;
  clues: Clue[];
}

const SCENARIOS: Scenario[] = [{
  message: "It's getting late",
  initialEntropy: 100,
  clues: [
    { id: "1", type: "location", value: "Library", icon: <MapPin size={24} />, entropyReduction: 25 },
    { id: "2", type: "time", value: "8:45 PM", icon: <Clock size={24} />, entropyReduction: 30 },
    { id: "3", type: "speaker", value: "Librarian", icon: <User size={24} />, entropyReduction: 25 },
    { id: "4", type: "audience", value: "Students", icon: <Users size={24} />, entropyReduction: 20 }
  ]
}];

export default function SemanticEntropyTeacher() {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [entropy, setEntropy] = useState<number>(SCENARIOS[0].initialEntropy);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [draggingClue, setDraggingClue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedback("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleDragStart = (clueId: string) => {
    setDraggingClue(clueId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingClue || usedClues.includes(draggingClue)) return;

    const clue = SCENARIOS[currentScenario].clues.find(c => c.id === draggingClue);
    if (!clue) return;

    setUsedClues(prev => [...prev, draggingClue]);
    setEntropy(prev => Math.max(0, prev - clue.entropyReduction));
    setFeedback("Context added! Entropy reduced.");
    setDraggingClue(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetScenario = () => {
    setEntropy(SCENARIOS[currentScenario].initialEntropy);
    setUsedClues([]);
    setFeedback("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Semantic Entropy Detective</h2>
        <div className="flex items-center justify-center gap-2 text-xl">
          <MessageCircle className="text-blue-500" />
          <p>"{SCENARIOS[currentScenario].message}"</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${entropy}%` }}
          />
        </div>
        <p className="text-center mt-2">Entropy Level: {entropy}%</p>
      </div>

      <div 
        className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="region"
        aria-label="Context Drop Zone"
      >
        <p className="text-gray-500 text-center mb-4">Drag context clues here</p>
        <div className="flex flex-wrap gap-2">
          {usedClues.map(clueId => {
            const clue = SCENARIOS[currentScenario].clues.find(c => c.id === clueId);
            return clue && (
              <div key={clue.id} className="flex items-center gap-2 bg-green-100 p-2 rounded">
                {clue.icon}
                <span>{clue.value}</span>
                <Check className="text-green-500" size={16} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {SCENARIOS[currentScenario].clues.map(clue => (
          <button
            key={clue.id}
            draggable
            onDragStart={() => handleDragStart(clue.id)}
            disabled={usedClues.includes(clue.id)}
            className={`flex items-center gap-2 p-3 rounded-lg ${
              usedClues.includes(clue.id)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-white shadow-md hover:shadow-lg transition-shadow duration-300'
            }`}
          >
            {clue.icon}
            <span>{clue.value}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={resetScenario}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>

      {feedback && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {feedback}
        </div>
      )}
    </div>
  );
}