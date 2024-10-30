"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Brain,
  VoteIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface PredictionCase {
  id: number;
  scenario: string;
  correctAnswer: boolean;
  modelPredictions: boolean[];
}

interface EnsembleState {
  currentCase: number;
  showVoting: boolean;
  showResult: boolean;
  isAnimating: boolean;
  activeBrains: boolean[];
}

const PREDICTION_CASES: PredictionCase[] = [
  {
    id: 1,
    scenario: "Is this email spam?",
    correctAnswer: true,
    modelPredictions: [true, true, false, true, false],
  },
  {
    id: 2,
    scenario: "Is this credit card transaction fraudulent?",
    correctAnswer: false,
    modelPredictions: [false, false, true, false, false],
  },
  {
    id: 3,
    scenario: "Is this customer review authentic?",
    correctAnswer: true,
    modelPredictions: [true, false, true, true, true],
  },
  {
    id: 4,
    scenario: "Is this medical scan showing a tumor?",
    correctAnswer: true,
    modelPredictions: [true, true, true, false, true],
  },
  {
    id: 5,
    scenario: "Will it rain tomorrow?",
    correctAnswer: false,
    modelPredictions: [false, true, false, false, false],
  },
  {
    id: 6,
    scenario: "Is this news article clickbait?",
    correctAnswer: true,
    modelPredictions: [true, true, true, false, true],
  },
  {
    id: 7,
    scenario: "Is this login attempt suspicious?",
    correctAnswer: true,
    modelPredictions: [false, true, true, true, true],
  },
  {
    id: 8,
    scenario: "Will this customer churn next month?",
    correctAnswer: false,
    modelPredictions: [true, false, false, false, false],
  },
  {
    id: 9,
    scenario: "Is this insurance claim fraudulent?",
    correctAnswer: true,
    modelPredictions: [true, true, false, true, true],
  },
  {
    id: 10,
    scenario: "Is this social media account a bot?",
    correctAnswer: true,
    modelPredictions: [true, true, true, true, false],
  },
];

const EnsembleLearningVisualizer = () => {
  const [state, setState] = useState<EnsembleState>({
    currentCase: 0,
    showVoting: false,
    showResult: false,
    isAnimating: true,
    activeBrains: new Array(5).fill(false),
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (state.isAnimating) {
      if (!state.showVoting) {
        timeout = setTimeout(() => {
          setState((prev) => ({ ...prev, showVoting: true }));
          // Start activating brains one by one
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              setState((prev) => ({
                ...prev,
                activeBrains: prev.activeBrains.map((active, idx) =>
                  idx === i ? true : active
                ),
              }));
            }, i * 150);
          }
        }, 2000);
      } else if (!state.showResult) {
        timeout = setTimeout(() => {
          setState((prev) => ({ ...prev, showResult: true }));
        }, 2000);
      } else {
        timeout = setTimeout(() => {
          setState((prev) => ({
            currentCase: (prev.currentCase + 1) % PREDICTION_CASES.length,
            showVoting: false,
            showResult: false,
            isAnimating: true,
            activeBrains: new Array(5).fill(false),
          }));
        }, 3000);
      }
    }

    return () => clearTimeout(timeout);
  }, [state]);

  const currentPredictionCase = PREDICTION_CASES[state.currentCase];
  const majorityVote =
    currentPredictionCase.modelPredictions.filter((p) => p).length >
    currentPredictionCase.modelPredictions.length / 2;

  const handleToggleAnimation = () => {
    setState((prev) => ({ ...prev, isAnimating: !prev.isAnimating }));
  };

  const handleReset = () => {
    setState({
      currentCase: 0,
      showVoting: false,
      showResult: false,
      isAnimating: true,
      activeBrains: new Array(5).fill(false),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="text-xl font-medium text-center mb-4">
          {currentPredictionCase.scenario}
        </div>

        <div className="min-h-64 flex flex-col">
          <div className="flex justify-center space-x-4 mb-6">
            {currentPredictionCase.modelPredictions.map((prediction, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Brain
                  className={`w-12 h-12 mb-2 transition-colors duration-500 ${
                    state.activeBrains[idx] ? "text-blue-500" : "text-gray-300"
                  }`}
                />
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <div
                    className={`absolute transition-all duration-300 ${
                      state.showVoting && state.activeBrains[idx]
                        ? "scale-100 translate-y-0 opacity-100"
                        : "scale-0 translate-y-0 opacity-0"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        prediction ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {prediction ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div
              className={`flex flex-col items-center justify-center transition-all duration-500 ${
                state.showResult
                  ? "opacity-100 transform-none"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              <VoteIcon className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-lg font-medium">
                Ensemble Prediction: {majorityVote ? "Yes" : "No"}
              </div>
              <div
                className={`mt-2 ${
                  majorityVote === currentPredictionCase.correctAnswer
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {majorityVote === currentPredictionCase.correctAnswer
                  ? "Correct!"
                  : "Incorrect!"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <Users className="inline w-4 h-4 mr-2" />
        Multiple models vote on predictions to improve accuracy
      </div>
    </div>
  );
};

export default EnsembleLearningVisualizer;
