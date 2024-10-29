"use client"
import { useState, useEffect } from "react";
import { Music, Briefcase, Plane, Brain, Bot, ChevronUp, Info } from "lucide-react";

interface ComponentProps {}

type Capability = {
  id: number;
  name: string;
  icon: JSX.Element;
  description: string;
};

type Challenge = {
  id: number;
  name: string;
  requiredCapabilities: number[];
};

const CAPABILITIES: Capability[] = [
  { id: 1, name: "Perception", icon: <Music size={24} />, description: "Ability to perceive and process sensory input" },
  { id: 2, name: "Language", icon: <Briefcase size={24} />, description: "Natural language processing and generation" },
  { id: 3, name: "Decision Making", icon: <Plane size={24} />, description: "Ability to make decisions based on input and goals" },
  { id: 4, name: "Learning", icon: <Brain size={24} />, description: "Capacity to learn and improve from experience" },
  { id: 5, name: "AGI", icon: <Bot size={24} />, description: "Artificial General Intelligence - human-level cognition" },
];

const CHALLENGES: Challenge[] = [
  { id: 1, name: "Image Recognition", requiredCapabilities: [1] },
  { id: 2, name: "Chatbot", requiredCapabilities: [1, 2] },
  { id: 3, name: "Game Playing", requiredCapabilities: [1, 2, 3] },
  { id: 4, name: "Self-Driving Car", requiredCapabilities: [1, 2, 3, 4] },
];

/**
 * AICapabilityClimb: An interactive component demonstrating the AI Capability Ladder concept.
 */
const AICapabilityClimb: React.FC<ComponentProps> = () => {
  const [selectedCapabilities, setSelectedCapabilities] = useState<number[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLevel((prev) => (prev < CAPABILITIES.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleCapabilityClick = (id: number) => {
    setSelectedCapabilities((prev) =>
      prev.includes(id) ? prev.filter((capId) => capId !== id) : [...prev, id]
    );
  };

  const canSolveChallenge = (challenge: Challenge) => {
    return challenge.requiredCapabilities.every((capId) => selectedCapabilities.includes(capId));
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">AI Capability Ladder</h2>
      <div className="relative w-full h-full bg-gray-300 rounded-lg overflow-hidden">
        {CAPABILITIES.map((capability, index) => (
          <div
            key={capability.id}
            className={`absolute left-0 w-full h-1/5 flex items-center justify-between px-4 ${
              index <= currentLevel ? "bg-blue-500" : "bg-gray-400"
            } transition-all duration-500`}
            style={{ bottom: `${index * 20}%` }}
          >
            <div className="flex items-center">
              {capability.icon}
              <span className="ml-2 text-white">{capability.name}</span>
            </div>
            <button
              className={`p-2 rounded-full ${
                selectedCapabilities.includes(capability.id) ? "bg-green-500" : "bg-gray-600"
              } text-white`}
              onClick={() => handleCapabilityClick(capability.id)}
              aria-label={`Toggle ${capability.name} capability`}
            >
              <ChevronUp size={16} />
            </button>
          </div>
        ))}
        <div className="absolute top-4 right-4">
          <button
            className="p-2 bg-gray-600 rounded-full text-white"
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Toggle information"
          >
            <Info size={24} />
          </button>
        </div>
      </div>
      {showInfo && (
        <div className="absolute top-16 right-4 w-64 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">Capabilities</h3>
          <ul>
            {CAPABILITIES.map((cap) => (
              <li key={cap.id} className="mb-2">
                <strong>{cap.name}:</strong> {cap.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Challenges</h3>
        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-2 rounded ${
                canSolveChallenge(challenge) ? "bg-green-500" : "bg-gray-400"
              } text-white`}
            >
              {challenge.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AICapabilityClimb;