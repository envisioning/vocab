"use client"
import { useState, useEffect } from "react";
import { Search, Scale, ThumbsUp, ThumbsDown, ArrowRight, RefreshCcw } from "lucide-react";

interface Case {
  id: number;
  title: string;
  claim: string;
  nullHypothesis: string;
  data: number[];
  threshold: number;
  pValue: number;
}

interface ComponentProps {}

const CASES: Case[] = [
  {
    id: 1,
    title: "The School Lunch Mystery",
    claim: "New lunch menu has improved student satisfaction",
    nullHypothesis: "No change in satisfaction",
    data: [7.2, 7.8, 8.1, 7.9, 8.3, 8.0, 7.9, 8.2],
    threshold: 0.05,
    pValue: 0.03
  }
];

/**
 * DetectiveBot's Evidence Lab - Interactive Hypothesis Testing Component
 */
const HypothesisTestingLab: React.FC<ComponentProps> = () => {
  const [currentCase, setCurrentCase] = useState<Case>(CASES[0]);
  const [threshold, setThreshold] = useState<number>(0.05);
  const [evidence, setEvidence] = useState<number[]>([]);
  const [conclusion, setConclusion] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        if (evidence.length < currentCase.data.length) {
          setEvidence(prev => [...prev, currentCase.data[evidence.length]]);
        } else {
          setIsAnimating(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAnimating, evidence.length, currentCase.data]);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThreshold(parseFloat(e.target.value));
  };

  const makeConclusion = () => {
    const decision = currentCase.pValue < threshold;
    setConclusion(decision ? "Reject null hypothesis" : "Fail to reject null hypothesis");
  };

  const resetCase = () => {
    setEvidence([]);
    setConclusion("");
    setIsAnimating(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Search className="text-blue-500" />
          {currentCase.title}
        </h2>
        <p className="mt-2 text-gray-700">Claim: {currentCase.claim}</p>
        <p className="text-gray-600">Null Hypothesis: {currentCase.nullHypothesis}</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg" role="region" aria-label="Evidence Collection">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Scale className="text-blue-500" />
          Evidence Collection
        </h3>
        <div className="flex gap-2 h-20 items-end">
          {evidence.map((value, index) => (
            <div
              key={index}
              className="bg-blue-500 w-8 rounded-t transition-all duration-300"
              style={{ height: `${value * 10}%` }}
              role="graphics-symbol"
              aria-label={`Data point ${value}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Significance Level (α):
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={threshold}
            onChange={handleThresholdChange}
            className="w-full mt-2"
          />
          <span className="text-blue-500">{threshold}</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={makeConclusion}
          disabled={evidence.length < currentCase.data.length}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          <ArrowRight />
          Make Conclusion
        </button>
        <button
          onClick={resetCase}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
        >
          <RefreshCcw />
          Reset Case
        </button>
      </div>

      {conclusion && (
        <div className="mt-6 p-4 bg-white rounded-lg">
          <p className="font-semibold flex items-center gap-2">
            {conclusion.includes("Reject") ? (
              <ThumbsUp className="text-green-500" />
            ) : (
              <ThumbsDown className="text-gray-500" />
            )}
            {conclusion}
          </p>
        </div>
      )}
    </div>
  );
};

export default HypothesisTestingLab;