"use client"
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RefreshCw, Award } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  difficulty: number;
  dependencies: number[];
}

interface ComponentProps {}

/**
 * AISkillTreeBuilder: An interactive component for teaching AI Scaffolding
 * 
 * This component allows students to build and visualize an AI skill tree,
 * demonstrating the concept of scaffolding in AI learning.
 */
const AISkillTreeBuilder: React.FC<ComponentProps> = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState<number>(0);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);

  const initialSkills: Skill[] = [
    { id: 1, name: "Data Preprocessing", difficulty: 1, dependencies: [] },
    { id: 2, name: "Basic Pattern Recognition", difficulty: 2, dependencies: [1] },
    { id: 3, name: "Simple Classification", difficulty: 3, dependencies: [2] },
    { id: 4, name: "Advanced Algorithms", difficulty: 4, dependencies: [2, 3] },
    { id: 5, name: "Natural Language Processing", difficulty: 5, dependencies: [3, 4] },
  ];

  useEffect(() => {
    setSkills(initialSkills);
    let timer: NodeJS.Timeout;

    if (isAutoMode) {
      timer = setInterval(() => {
        setCurrentSkill((prev) => (prev < initialSkills.length - 1 ? prev + 1 : 0));
      }, 3000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoMode]);

  const handleSkillClick = (id: number) => {
    if (!isAutoMode) {
      setCurrentSkill(id - 1);
    }
  };

  const handleReset = () => {
    setCurrentSkill(0);
    setIsAutoMode(true);
  };

  const handleModeToggle = () => {
    setIsAutoMode(!isAutoMode);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Skill Tree Builder</h1>
      <p className="text-sm mb-4">Visualize how AI skills build upon each other</p>
      
      <div className="relative w-full max-w-2xl h-96 bg-white rounded-lg shadow-md p-4">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={`absolute transition-all duration-500 p-2 rounded-md cursor-pointer
              ${index <= currentSkill ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              ${index === currentSkill ? 'ring-2 ring-green-500' : ''}`}
            style={{
              left: `${(skill.id - 1) * 25}%`,
              bottom: `${skill.difficulty * 20}%`,
            }}
            onClick={() => handleSkillClick(skill.id)}
            tabIndex={0}
            role="button"
            aria-pressed={index === currentSkill}
          >
            {skill.name}
            <div className="mt-1">
              {Array.from({ length: skill.difficulty }).map((_, i) => (
                <Award key={i} className="inline-block w-4 h-4 mr-1" />
              ))}
            </div>
          </div>
        ))}
        {skills.map((skill) =>
          skill.dependencies.map((depId) => {
            const depSkill = skills.find((s) => s.id === depId);
            if (!depSkill) return null;
            return (
              <svg key={`${skill.id}-${depId}`} className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1={`${(depSkill.id - 1) * 25 + 12.5}%`}
                  y1={`${100 - depSkill.difficulty * 20}%`}
                  x2={`${(skill.id - 1) * 25 + 12.5}%`}
                  y2={`${100 - skill.difficulty * 20}%`}
                  stroke={currentSkill >= skill.id - 1 ? "#3B82F6" : "#9CA3AF"}
                  strokeWidth="2"
                />
              </svg>
            );
          })
        )}
      </div>
      
      <div className="mt-4 flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleModeToggle}
        >
          {isAutoMode ? <ChevronDown className="inline-block mr-2" /> : <ChevronUp className="inline-block mr-2" />}
          {isAutoMode ? "Manual Mode" : "Auto Mode"}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={handleReset}
        >
          <RefreshCw className="inline-block mr-2" />
          Reset
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        {isAutoMode
          ? "Watch as the AI progresses through skills automatically."
          : "Click on skills to explore the learning path."}
      </p>
    </div>
  );
};

export default AISkillTreeBuilder;