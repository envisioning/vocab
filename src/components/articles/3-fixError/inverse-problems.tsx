"use client"
import { useState, useEffect } from "react";
import { Detective, Coffee, ChefHat, Clock, ArrowLeft, ArrowRight, Target, Fingerprint, Award } from "lucide-react";

interface CrimeScene {
  id: number;
  clues: string[];
  possibleCauses: string[];
  correctCause: string;
}

const CRIME_SCENES: CrimeScene[] = [
  {
    id: 1,
    clues: ["Coffee spill", "Open window", "Scattered papers"],
    possibleCauses: ["Wind gust", "Quick movement", "Accidental bump"],
    correctCause: "Wind gust"
  },
  {
    id: 2,
    clues: ["Missing cookie", "Crumbs on floor", "Small footprints"],
    possibleCauses: ["Pet dog", "Young sibling", "Hungry student"],
    correctCause: "Young sibling"
  }
];

/**
 * InverseProblemsLab: Interactive component teaching inverse problems through detective scenarios
 */
const InverseProblemsLab = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [selectedCause, setSelectedCause] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCauseSelection = (cause: string) => {
    setSelectedCause(cause);
    if (cause === CRIME_SCENES[currentScene].correctCause) {
      setFeedback("Excellent deduction! Multiple causes could lead to these clues.");
      setScore((prev) => prev + 10);
    } else {
      setFeedback("Good thinking, but consider other possibilities!");
    }
  };

  const nextScene = () => {
    if (currentScene < CRIME_SCENES.length - 1) {
      setCurrentScene((prev) => prev + 1);
      setSelectedCause("");
      setFeedback("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg" role="main">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Detective className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Detective's Inverse Problems Lab</h1>
        </div>
        <div className="flex items-center gap-4">
          <Clock className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">{timeLeft}s</span>
          <Award className="w-6 h-6 text-green-500" />
          <span className="text-lg font-semibold">{score}</span>
        </div>
      </header>

      <main className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow" aria-label="crime scene">
          <h2 className="text-xl font-semibold mb-4">Crime Scene Analysis</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Observable Clues:</h3>
              <ul className="list-disc pl-5">
                {CRIME_SCENES[currentScene].clues.map((clue, index) => (
                  <li key={index} className="text-gray-700">{clue}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Possible Causes:</h3>
              <div className="flex flex-col gap-2">
                {CRIME_SCENES[currentScene].possibleCauses.map((cause, index) => (
                  <button
                    key={index}
                    onClick={() => handleCauseSelection(cause)}
                    className={`p-2 rounded-lg border transition-colors duration-300 ${
                      selectedCause === cause ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50'
                    }`}
                    aria-pressed={selectedCause === cause}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {feedback && (
          <div className="bg-blue-50 p-4 rounded-lg" role="alert">
            <p className="text-blue-700">{feedback}</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentScene((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            disabled={currentScene === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={nextScene}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            disabled={currentScene === CRIME_SCENES.length - 1}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default InverseProblemsLab;