"use client"
import { useState, useEffect } from "react";
import { ChefHat, Navigation, Search, ArrowRight, Zap } from "lucide-react";

interface ComponentProps {}

type Scenario = {
  id: number;
  title: string;
  icon: JSX.Element;
  description: string;
  options: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Detective",
    icon: <Search className="w-6 h-6" />,
    description: "Solve the case by asking the right questions.",
    options: ["Who?", "What?", "When?", "Where?"],
  },
  {
    id: 2,
    title: "Chef",
    icon: <ChefHat className="w-6 h-6" />,
    description: "Create a perfect dish with the right ingredients.",
    options: ["Spicy", "Sweet", "Sour", "Savory"],
  },
  {
    id: 3,
    title: "GPS",
    icon: <Navigation className="w-6 h-6" />,
    description: "Navigate to your destination efficiently.",
    options: ["Fastest", "Scenic", "No tolls", "Avoid highways"],
  },
];

/**
 * PromptEngineeringPlayground: An interactive component to teach prompt engineering.
 */
const PromptEngineeringPlayground: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [output, setOutput] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => {
        const nextIndex = (SCENARIOS.findIndex((s) => s.id === prev.id) + 1) % SCENARIOS.length;
        return SCENARIOS[nextIndex];
      });
      setSelectedOptions([]);
      setOutput("");
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setOutput(generateOutput(currentScenario, selectedOptions));
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedOptions, currentScenario]);

  const handleOptionClick = (option: string) => {
    setSelectedOptions((prev) => 
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const generateOutput = (scenario: Scenario, options: string[]): string => {
    switch (scenario.id) {
      case 1:
        return `The detective asked about ${options.join(", ")} and solved the case!`;
      case 2:
        return `The chef created a ${options.join(", ")} masterpiece!`;
      case 3:
        return `You've arrived at your destination via a ${options.join(", ")} route!`;
      default:
        return "Unexpected scenario";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Prompt Engineering Playground</h2>
      <div className="flex items-center mb-4">
        {currentScenario.icon}
        <h3 className="text-xl font-semibold ml-2">{currentScenario.title} Scenario</h3>
      </div>
      <p className="mb-4">{currentScenario.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {currentScenario.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`p-2 rounded-md transition-colors duration-300 ${
              selectedOptions.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-pressed={selectedOptions.includes(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="relative h-24 bg-white rounded-md p-4 overflow-hidden">
        {isAnimating ? (
          <div className="flex items-center justify-center h-full">
            <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        ) : (
          <p className="text-gray-700">{output || "Select options to generate output"}</p>
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Prompt Engineering Tip:</h4>
        <p className="text-sm text-gray-600">
          Just like in this scenario, effective prompt engineering involves selecting the right
          "ingredients" (keywords and context) to get the desired output from an AI.
        </p>
      </div>
    </div>
  );
};

export default PromptEngineeringPlayground;