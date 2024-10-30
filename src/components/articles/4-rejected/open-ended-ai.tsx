"use client"
import { useState, useEffect } from "react";
import { Brain, ZapOff, Zap, Book, Lightbulb, RefreshCw } from "lucide-react";

interface ComponentProps {}

type Challenge = {
  id: number;
  name: string;
  solved: boolean;
};

type Skill = {
  id: number;
  name: string;
};

/**
 * AIEvolutionSimulator - A component that simulates the growth and evolution of an Open-Ended AI system.
 * It visualizes the AI's learning process, skill acquisition, and creative problem-solving abilities.
 */
const AIEvolutionSimulator: React.FC<ComponentProps> = () => {
  const [aiSize, setAiSize] = useState<number>(50);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [creativityLevel, setCreativityLevel] = useState<number>(0);
  const [isLearning, setIsLearning] = useState<boolean>(false);

  useEffect(() => {
    const learningInterval = setInterval(() => {
      if (isLearning) {
        setAiSize((prevSize) => Math.min(prevSize + 1, 100));
        setCreativityLevel((prevLevel) => Math.min(prevLevel + 0.5, 100));
        solveRandomChallenge();
        if (Math.random() < 0.2) addNewSkill();
      }
    }, 1000);

    return () => clearInterval(learningInterval);
  }, [isLearning]);

  const addChallenge = () => {
    const newChallenge: Challenge = {
      id: challenges.length + 1,
      name: `Challenge ${challenges.length + 1}`,
      solved: false,
    };
    setChallenges([...challenges, newChallenge]);
  };

  const solveRandomChallenge = () => {
    setChallenges((prevChallenges) => {
      const unsolvedChallenges = prevChallenges.filter((c) => !c.solved);
      if (unsolvedChallenges.length === 0) return prevChallenges;
      const randomIndex = Math.floor(Math.random() * unsolvedChallenges.length);
      return prevChallenges.map((c) =>
        c.id === unsolvedChallenges[randomIndex].id ? { ...c, solved: true } : c
      );
    });
  };

  const addNewSkill = () => {
    const newSkill: Skill = {
      id: skills.length + 1,
      name: `Skill ${skills.length + 1}`,
    };
    setSkills([...skills, newSkill]);
  };

  const resetSimulation = () => {
    setAiSize(50);
    setChallenges([]);
    setSkills([]);
    setCreativityLevel(0);
    setIsLearning(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Evolution Simulator</h2>
      <div className="flex items-center justify-center mb-4">
        <Brain
          size={aiSize}
          className="text-blue-500 transition-all duration-500"
        />
      </div>
      <div className="mb-4">
        <p className="font-semibold">Creativity Level: {creativityLevel.toFixed(1)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${creativityLevel}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold mb-2">Challenges</h3>
          <ul className="space-y-2">
            {challenges.map((challenge) => (
              <li
                key={challenge.id}
                className="flex items-center space-x-2"
              >
                {challenge.solved ? (
                  <Zap className="text-green-500" size={16} />
                ) : (
                  <ZapOff className="text-gray-500" size={16} />
                )}
                <span>{challenge.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center space-x-2"
              >
                <Book className="text-blue-500" size={16} />
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsLearning(!isLearning)}
          className={`px-4 py-2 rounded-md ${
            isLearning ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isLearning ? "Stop Learning" : "Start Learning"}
        </button>
        <button
          onClick={addChallenge}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Challenge
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          <RefreshCw size={16} className="inline mr-2" />
          Reset
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Watch as the AI grows, learns new skills, and solves challenges. This simulates an Open-Ended AI system's continuous learning and adaptation.
      </p>
    </div>
  );
};

export default AIEvolutionSimulator;