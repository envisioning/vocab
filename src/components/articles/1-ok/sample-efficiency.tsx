"use client"
import { useState, useEffect } from "react";
import { ChefHat, Sprout, Book, ArrowRight, Info } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  icon: JSX.Element;
  title: string;
  efficientDescription: string;
  inefficientDescription: string;
};

const SCENARIOS: Scenario[] = [
  {
    icon: <ChefHat className="w-6 h-6" />,
    title: "The Master Chef",
    efficientDescription: "Chef Maria recreates dishes after one taste",
    inefficientDescription: "Chef John needs multiple attempts",
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    title: "The Efficient Gardener",
    efficientDescription: "Emma identifies plants quickly",
    inefficientDescription: "Tom needs many examples",
  },
  {
    icon: <Book className="w-6 h-6" />,
    title: "The Quick Study",
    efficientDescription: "Alice learns languages rapidly",
    inefficientDescription: "Bob requires more repetition",
  },
];

/**
 * SampleEfficiencySimulator: A component to teach sample efficiency through interactive scenarios
 */
const SampleEfficiencySimulator: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [sampleCount, setSampleCount] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sampleTimer = setInterval(() => {
      setSampleCount((prev) => (prev < 10 ? prev + 1 : 1));
    }, 1000);

    return () => clearInterval(sampleTimer);
  }, []);

  const handleScenarioChange = () => {
    setCurrentScenario((prev) => (prev + 1) % SCENARIOS.length);
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sample Efficiency Simulator</h2>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {scenario.icon}
          <span className="ml-2 font-semibold">{scenario.title}</span>
        </div>
        <button
          onClick={handleScenarioChange}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          aria-label="Next scenario"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Sample-Efficient Model</h3>
          <p>{scenario.efficientDescription}</p>
          <div className="mt-4 h-4 bg-gray-200 rounded">
            <div
              className="h-full bg-green-500 rounded transition-all duration-300"
              style={{ width: `${sampleCount * 10}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Less Efficient Model</h3>
          <p>{scenario.inefficientDescription}</p>
          <div className="mt-4 h-4 bg-gray-200 rounded">
            <div
              className="h-full bg-yellow-500 rounded transition-all duration-300"
              style={{ width: `${sampleCount * 5}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="sampleSlider" className="block mb-2">
            Number of Samples: {sampleCount}
          </label>
          <input
            id="sampleSlider"
            type="range"
            min="1"
            max="10"
            value={sampleCount}
            onChange={(e) => setSampleCount(parseInt(e.target.value))}
            className="w-64"
          />
        </div>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-blue-500 hover:text-blue-600 transition duration-300"
            aria-label="Show information about sample efficiency"
          >
            <Info className="w-6 h-6" />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-300 rounded shadow-lg w-64">
              <p>
                Sample efficiency measures how well a model learns from limited
                data. Higher efficiency means better performance with fewer
                samples.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleEfficiencySimulator;