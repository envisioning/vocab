"use client"
import { useState, useEffect } from "react";
import { Box, Brain, CreditCard, Lightbulb, Lock, Unlock } from "lucide-react";

interface ComponentProps {}

type InputData = {
  age: number;
  location: string;
  preference: string;
};

type BlackBoxSection = {
  id: number;
  name: string;
  isIlluminated: boolean;
};

const INITIAL_INPUT: InputData = {
  age: 18,
  location: "City",
  preference: "Technology",
};

const BLACK_BOX_SECTIONS: BlackBoxSection[] = [
  { id: 1, name: "Neural Network", isIlluminated: false },
  { id: 2, name: "Decision Tree", isIlluminated: false },
  { id: 3, name: "Random Forest", isIlluminated: false },
];

/**
 * AIDecisionTheatre: A component to teach the Black Box Problem in AI
 */
const AIDecisionTheatre: React.FC<ComponentProps> = () => {
  const [input, setInput] = useState<InputData>(INITIAL_INPUT);
  const [output, setOutput] = useState<string>("");
  const [blackBox, setBlackBox] = useState<BlackBoxSection[]>(BLACK_BOX_SECTIONS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isProcessing) {
        setOutput(generateOutput(input));
        setIsProcessing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isProcessing, input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setBlackBox(BLACK_BOX_SECTIONS);
  };

  const toggleIllumination = (id: number) => {
    setBlackBox((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isIlluminated: !section.isIlluminated } : section
      )
    );
  };

  const generateOutput = (input: InputData): string => {
    const outputs = [
      "AI recommends: Online coding course",
      "AI suggests: Local tech meetup",
      "AI proposes: Internship opportunity",
    ];
    return outputs[Math.floor(Math.random() * outputs.length)];
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">AI Decision Theatre</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Input Stage</h2>
        <div className="flex space-x-4">
          <input
            type="number"
            name="age"
            value={input.age}
            onChange={handleInputChange}
            className="border p-2 rounded"
            aria-label="Age"
          />
          <select
            name="location"
            value={input.location}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="City">City</option>
            <option value="Suburb">Suburb</option>
            <option value="Rural">Rural</option>
          </select>
          <select
            name="preference"
            value={input.preference}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="Technology">Technology</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </select>
        </div>
        <button
          onClick={handleProcess}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Process
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Black Box Visualization</h2>
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
          {blackBox.map((section) => (
            <div key={section.id} className="text-center">
              <button
                onClick={() => toggleIllumination(section.id)}
                className="focus:outline-none"
                aria-label={`Illuminate ${section.name}`}
              >
                {section.isIlluminated ? (
                  <Unlock className="text-yellow-400 w-12 h-12" />
                ) : (
                  <Lock className="text-gray-500 w-12 h-12" />
                )}
              </button>
              <p className={`mt-2 ${section.isIlluminated ? 'text-white' : 'text-gray-500'}`}>
                {section.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Output Stage</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {isProcessing ? (
            <p className="text-gray-500">Processing...</p>
          ) : (
            <p className="font-medium">{output}</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Understanding the Black Box Problem</h3>
        <p className="mb-2">
          The AI Decision Theatre demonstrates how AI systems can take inputs and produce outputs,
          but the internal decision-making process remains opaque - like a "black box".
        </p>
        <p>
          Try illuminating different parts of the black box. Notice how you can see glimpses of the
          internal workings, but the full picture remains elusive. This represents the challenge of
          interpreting complex AI systems.
        </p>
      </div>
    </div>
  );
};

export default AIDecisionTheatre;