"use client"
import { useState, useEffect } from "react";
import { Book, Briefcase, User, Brain, CheckCircle, XCircle } from "lucide-react";

interface Case {
  id: number;
  title: string;
  features: string[];
  correctClass: string;
}

interface Detective {
  id: number;
  name: string;
  icon: React.ReactNode;
  accuracy: number;
}

interface ComponentProps {}

const CASES: Case[] = [
  {
    id: 1,
    title: "The Mysterious Novel",
    features: ["Fantasy elements", "Young protagonist", "School setting"],
    correctClass: "Young Adult Fantasy",
  },
  {
    id: 2,
    title: "The Enigmatic Tome",
    features: ["Historical setting", "Political intrigue", "Multiple POVs"],
    correctClass: "Historical Fiction",
  },
];

const DETECTIVES: Detective[] = [
  { id: 1, name: "Naive Bayes", icon: <Brain size={24} />, accuracy: 0.8 },
  { id: 2, name: "Logistic Regression", icon: <User size={24} />, accuracy: 0.85 },
];

/**
 * AIDetectiveAgency: A component that simulates an AI detective agency using Model-Based Classifiers.
 */
const AIDetectiveAgency: React.FC<ComponentProps> = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [selectedDetective, setSelectedDetective] = useState<Detective | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const caseInterval = setInterval(() => {
      const randomCase = CASES[Math.floor(Math.random() * CASES.length)];
      setCurrentCase(randomCase);
      setPrediction(null);
      setIsCorrect(null);
    }, 10000);

    return () => clearInterval(caseInterval);
  }, []);

  const handleDetectiveSelect = (detective: Detective) => {
    setSelectedDetective(detective);
    setPrediction(null);
    setIsCorrect(null);
  };

  const handleSolveCase = () => {
    if (!currentCase || !selectedDetective) return;

    const isCorrectPrediction = Math.random() < selectedDetective.accuracy;
    const predictedClass = isCorrectPrediction ? currentCase.correctClass : "Incorrect Classification";
    setPrediction(predictedClass);
    setIsCorrect(isCorrectPrediction);
  };

  if (!currentCase) {
    return <div className="text-center">Loading case...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI Detective Agency</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Current Case: {currentCase.title}</h2>
        <ul className="list-disc list-inside">
          {currentCase.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Select a Detective:</h3>
        <div className="flex space-x-4">
          {DETECTIVES.map((detective) => (
            <button
              key={detective.id}
              onClick={() => handleDetectiveSelect(detective)}
              className={`flex items-center p-2 rounded ${
                selectedDetective?.id === detective.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {detective.icon}
              <span className="ml-2">{detective.name}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSolveCase}
        disabled={!selectedDetective}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Solve Case
      </button>
      {prediction && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prediction:</h3>
          <p className="flex items-center">
            {isCorrect ? (
              <CheckCircle className="text-green-500 mr-2" />
            ) : (
              <XCircle className="text-red-500 mr-2" />
            )}
            {prediction}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIDetectiveAgency;