"use client"
import { useState, useEffect } from "react";
import { Box, ChefHat, ArrowRight, Brain, HelpCircle, Check, X } from "lucide-react";

interface MysteryProcess {
  id: number;
  input: string;
  possibleOutputs: string[];
}

const UnverifiabilityDemo = () => {
  const [activeBox, setActiveBox] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userTheory, setUserTheory] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const mysteryProcesses: MysteryProcess[] = [
    {
      id: 1,
      input: "ingredients",
      possibleOutputs: ["Delicious pasta", "Amazing pasta", "Perfect pasta"]
    },
    {
      id: 2,
      input: "dream description",
      possibleOutputs: ["Symbol of change", "Sign of growth", "New beginnings"]
    }
  ];

  const processInput = () => {
    setIsProcessing(true);
    const currentProcess = mysteryProcesses[activeBox];
    
    setTimeout(() => {
      const randomOutput = currentProcess.possibleOutputs[
        Math.floor(Math.random() * currentProcess.possibleOutputs.length)
      ];
      setOutput(randomOutput);
      setIsProcessing(false);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      setIsProcessing(false);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">The Mystery Box Factory</h1>

      <div className="flex gap-6 mb-8">
        <button
          onClick={() => setActiveBox(0)}
          className={`flex items-center gap-2 p-4 rounded-lg ${
            activeBox === 0 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          aria-label="Select Restaurant Box"
        >
          <ChefHat className="w-6 h-6" />
          <span>Restaurant Box</span>
        </button>

        <button
          onClick={() => setActiveBox(1)}
          className={`flex items-center gap-2 p-4 rounded-lg ${
            activeBox === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          aria-label="Select Dream Box"
        >
          <Brain className="w-6 h-6" />
          <span>Dream Box</span>
        </button>
      </div>

      <div className="relative p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`Enter ${mysteryProcesses[activeBox].input}...`}
            className="flex-1 p-3 border rounded-lg"
            aria-label={`Enter ${mysteryProcesses[activeBox].input}`}
          />
          <button
            onClick={processInput}
            disabled={isProcessing || !userInput}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Process
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3 text-center">Input</div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="w-1/3 text-center bg-gray-800 text-white p-4 rounded-lg">
            Mystery Process
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="w-1/3 text-center">Output</div>
        </div>

        {isProcessing ? (
          <div className="text-center text-blue-500">Processing...</div>
        ) : output && (
          <div className="text-center text-green-500 font-bold">{output}</div>
        )}

        <div className="mt-8">
          <textarea
            value={userTheory}
            onChange={(e) => setUserTheory(e.target.value)}
            placeholder="What's your theory about how this box works?"
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
          <button
            onClick={() => setShowFeedback(true)}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg"
          >
            Submit Theory
          </button>
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-800">
              Great theory! Remember: Just like this box, many AI systems produce reliable outputs
              but their exact internal processes remain unverifiable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnverifiabilityDemo;