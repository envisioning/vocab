"use client"
import { useState, useEffect } from "react";
import { ChefHat, Music, Dna, ArrowRight, Check, X, RefreshCw } from "lucide-react";

interface SequenceStep {
  id: number;
  content: string;
  icon: JSX.Element;
  description: string;
}

interface ComponentProps {}

const INITIAL_SEQUENCES: SequenceStep[] = [
  {
    id: 1,
    content: "DNA Sequence",
    icon: <Dna className="w-8 h-8" />,
    description: "Reading genetic code in order: A→T→C→G"
  },
  {
    id: 2,
    content: "Recipe Steps",
    icon: <ChefHat className="w-8 h-8" />,
    description: "Mix→Pour→Bake→Cool"
  },
  {
    id: 3,
    content: "Musical Notes",
    icon: <Music className="w-8 h-8" />,
    description: "Do→Re→Mi→Fa"
  }
];

const SequentialModelTeacher: React.FC<ComponentProps> = () => {
  const [activeSequence, setActiveSequence] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<string>("");
  const [userAttempt, setUserAttempt] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSequence((prev) => (prev + 1) % INITIAL_SEQUENCES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSequenceClick = (index: number) => {
    setIsPlaying(false);
    setActiveSequence(index);
  };

  const handlePredictionAttempt = (correct: boolean) => {
    setUserAttempt(correct);
    setTimeout(() => setUserAttempt(null), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8" role="main">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Sequential Models Explorer
      </h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-blue-600 hover:text-blue-700 focus:outline-none"
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            <RefreshCw className={`w-6 h-6 ${isPlaying ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="grid gap-4">
          {INITIAL_SEQUENCES.map((sequence, index) => (
            <button
              key={sequence.id}
              onClick={() => handleSequenceClick(index)}
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                activeSequence === index
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
              aria-selected={activeSequence === index}
            >
              <div className="mr-4">{sequence.icon}</div>
              <div className="text-left">
                <h3 className="font-semibold">{sequence.content}</h3>
                <p className="text-sm">{sequence.description}</p>
              </div>
              {activeSequence === index && (
                <ArrowRight className="ml-auto w-6 h-6" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg">
          <h3 className="font-semibold mb-2">Predict the Next Element:</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handlePredictionAttempt(true)}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              aria-label="Correct prediction"
            >
              <Check className="w-6 h-6" />
            </button>
            <button
              onClick={() => handlePredictionAttempt(false)}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
              aria-label="Incorrect prediction"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {userAttempt !== null && (
            <p
              className={`mt-2 ${
                userAttempt ? "text-green-600" : "text-gray-600"
              }`}
            >
              {userAttempt ? "Correct! Sequences matter!" : "Try again!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SequentialModelTeacher;