"use client"
import { useState, useEffect } from "react";
import { Trophy, Rocket, Brain, ArrowRight, Clock, Star, Award, Zap } from "lucide-react";

interface Milestone {
  id: number;
  year: number;
  model: string;
  achievement: string;
  icon: JSX.Element;
  capability: number;
}

interface ComponentProps {}

const MILESTONES: Milestone[] = [
  {
    id: 1,
    year: 2018,
    model: "BERT",
    achievement: "Understanding context in language",
    icon: <Brain className="w-6 h-6" />,
    capability: 20,
  },
  {
    id: 2,
    year: 2019,
    model: "GPT-2",
    achievement: "Generating coherent text",
    icon: <Star className="w-6 h-6" />,
    capability: 40,
  },
  {
    id: 3,
    year: 2020,
    model: "GPT-3",
    achievement: "Few-shot learning breakthroughs",
    icon: <Award className="w-6 h-6" />,
    capability: 60,
  },
  {
    id: 4,
    year: 2022,
    model: "GPT-4",
    achievement: "Multi-modal understanding",
    icon: <Zap className="w-6 h-6" />,
    capability: 80,
  },
];

/**
 * Interactive timeline component teaching Frontier Models through Olympic/Space exploration metaphors
 */
export default function FrontierModelsExplorer({}: ComponentProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [draggedMilestone, setDraggedMilestone] = useState<Milestone | null>(null);
  const [prediction, setPrediction] = useState<number>(100);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setSelectedMilestone((prev) => {
          const currentIndex = prev ? MILESTONES.findIndex(m => m.id === prev.id) : -1;
          return MILESTONES[(currentIndex + 1) % MILESTONES.length];
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const handleMilestoneClick = (milestone: Milestone) => {
    setIsAnimating(false);
    setSelectedMilestone(milestone);
  };

  const handleDragStart = (milestone: Milestone) => {
    setDraggedMilestone(milestone);
  };

  const handleDragEnd = () => {
    setDraggedMilestone(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center mb-6 gap-4">
        <Trophy className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold">AI Frontier Models Timeline</h2>
        <Rocket className="w-8 h-8 text-blue-500" />
      </div>

      <div className="relative h-80 mb-8">
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-300">
          {MILESTONES.map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => handleMilestoneClick(milestone)}
              draggable
              onDragStart={() => handleDragStart(milestone)}
              onDragEnd={handleDragEnd}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full 
                ${selectedMilestone?.id === milestone.id ? 'bg-blue-500' : 'bg-gray-400'}
                hover:bg-blue-400 transition-colors duration-300`}
              style={{ left: `${(milestone.year - 2018) * 25}%`, bottom: `${milestone.capability}%` }}
              aria-label={`${milestone.model} milestone from ${milestone.year}`}
            >
              {milestone.icon}
            </button>
          ))}
        </div>
      </div>

      {selectedMilestone && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6" role="region" aria-live="polite">
          <h3 className="text-xl font-bold mb-2">{selectedMilestone.model}</h3>
          <p className="mb-2">
            <Clock className="inline-block mr-2 w-5 h-5" />
            Year: {selectedMilestone.year}
          </p>
          <p className="mb-2">
            <ArrowRight className="inline-block mr-2 w-5 h-5" />
            Achievement: {selectedMilestone.achievement}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          aria-label={isAnimating ? "Pause animation" : "Start animation"}
        >
          {isAnimating ? "Pause" : "Auto-Play"}
        </button>
      </div>
    </div>
  );
}