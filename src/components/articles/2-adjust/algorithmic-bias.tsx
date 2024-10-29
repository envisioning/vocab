"use client"
import { useState, useEffect } from "react";
import { Book, User, Zap, AlertTriangle, Check } from "lucide-react";

interface Scenario {
  id: number;
  title: string;
  description: string;
  data: string[];
  biasedOutcome: string;
  correctOutcome: string;
}

interface ComponentProps {}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Job Application Screening",
    description: "An AI system is screening job applications for a tech company.",
    data: ["Male applicants: 80%", "Female applicants: 20%", "Average age: 28", "CS degrees: 90%"],
    biasedOutcome: "90% of selected candidates are male.",
    correctOutcome: "50% male and 50% female candidates selected, diverse age range and backgrounds.",
  },
  {
    id: 2,
    title: "Facial Recognition",
    description: "A facial recognition system is being used for building access.",
    data: ["Caucasian faces: 75%", "African faces: 15%", "Asian faces: 10%", "Indoor lighting"],
    biasedOutcome: "System fails to recognize 40% of non-Caucasian faces.",
    correctOutcome: "Equal recognition rates across all ethnicities, works in various lighting conditions.",
  },
];

/**
 * AlgorithmicBiasDetector: An interactive component to teach about algorithmic bias.
 * Students play as "Bias Detectives" to identify and correct biases in various scenarios.
 */
const AlgorithmicBiasDetector: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [showBiasedOutcome, setShowBiasedOutcome] = useState<boolean>(false);
  const [userIdentifiedBias, setUserIdentifiedBias] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBiasedOutcome(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentScenario]);

  const handleBiasIdentification = (identified: boolean) => {
    setUserIdentifiedBias(identified);
    if (identified) {
      setFeedback("Great job! You've correctly identified the bias.");
    } else {
      setFeedback("Take another look. There might be a bias you've missed.");
    }
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    setShowBiasedOutcome(false);
    setUserIdentifiedBias(null);
    setFeedback("");
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{scenario.title}</h2>
      <p className="mb-4 text-gray-700">{scenario.description}</p>

      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-gray-800">Training Data:</h3>
        <ul className="list-disc pl-5">
          {scenario.data.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>

      {showBiasedOutcome && (
        <div className="mb-4 p-3 bg-red-100 rounded">
          <h3 className="font-semibold mb-2 text-red-800">Algorithm Outcome:</h3>
          <p className="text-red-700">{scenario.biasedOutcome}</p>
        </div>
      )}

      {showBiasedOutcome && userIdentifiedBias === null && (
        <div className="mb-4">
          <p className="mb-2 text-gray-800">Do you think there's a bias in this outcome?</p>
          <button
            onClick={() => handleBiasIdentification(true)}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Yes, there is bias"
          >
            <Check className="inline-block mr-1" size={18} /> Yes
          </button>
          <button
            onClick={() => handleBiasIdentification(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            aria-label="No, there is no bias"
          >
            <AlertTriangle className="inline-block mr-1" size={18} /> No
          </button>
        </div>
      )}

      {feedback && (
        <div className="mb-4 p-3 bg-green-100 rounded">
          <p className="text-green-800">{feedback}</p>
        </div>
      )}

      {userIdentifiedBias && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Correct Outcome:</h3>
          <p className="text-green-700">{scenario.correctOutcome}</p>
        </div>
      )}

      <button
        onClick={nextScenario}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Next scenario"
      >
        <Zap className="inline-block mr-1" size={18} /> Next Scenario
      </button>
    </div>
  );
};

export default AlgorithmicBiasDetector;