"use client";
import React, { useState } from "react";
import {
  Brain,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Heart,
  MessageCircle,
} from "lucide-react";

const PDSExplainer = () => {
  const [activeLevel, setActiveLevel] = useState(1);

  const levels = [
    {
      id: 3,
      title: "Deep",
      description:
        "Complex emotional insights, personal growth reflection, profound self-awareness",
      icon: Brain,
      examples: [
        "I've noticed my anxiety stems from childhood experiences",
        "My values have evolved through challenging times",
      ],
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Moderate",
      description:
        "Basic emotional awareness, simple self-reflection, clear feelings",
      icon: Heart,
      examples: [
        "I feel happy when I accomplish my goals",
        "Sometimes I worry about the future",
      ],
      color: "bg-blue-400",
    },
    {
      id: 1,
      title: "Surface",
      description: "Simple statements, factual observations, basic reactions",
      icon: MessageCircle,
      examples: ["I like this", "That makes me sad", "This is fun"],
      color: "bg-blue-200",
    },
  ];

  const handleLevelClick = (level: number) => {
    setActiveLevel(level);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Psychological Depth Scale (PDS)
        </h2>
        <p className="text-gray-600">
          <Lightbulb className="inline-block mr-2" size={20} />
          Explore how AI measures the depth of psychological expressions
        </p>
      </div>

      <div className="relative">
        {levels.map((level) => {
          const Icon = level.icon;
          const isActive = activeLevel === level.id;

          return (
            <div
              key={level.id}
              className={`
                transition-all duration-300 ease-in-out
                mb-4 p-4 rounded-lg cursor-pointer
                ${
                  isActive
                    ? `${level.color} text-white scale-105`
                    : "bg-gray-50 hover:bg-gray-100"
                }
              `}
              onClick={() => handleLevelClick(level.id)}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={24}
                  className={isActive ? "text-white" : "text-gray-600"}
                />
                <h3 className="text-lg font-semibold">{level.title}</h3>
              </div>

              {isActive && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <p className="text-sm">{level.description}</p>
                  <div className="text-sm mt-2">
                    <p className="font-semibold mb-1">Examples:</p>
                    <ul className="list-disc list-inside">
                      {level.examples.map((example, idx) => (
                        <li key={idx} className="ml-2">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col gap-2">
            <ArrowUp size={20} className="text-gray-400" />
            <ArrowDown size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Click on each level to explore its characteristics
      </div>
    </div>
  );
};

export default PDSExplainer;
