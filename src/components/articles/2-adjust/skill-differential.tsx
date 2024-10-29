"use client"
import { useState, useEffect } from "react";
import { Trophy, Users, Activity, Target, ArrowUp, Brain, Clock, Zap } from "lucide-react";

interface SkillLevel {
  level: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface Milestone {
  id: number;
  title: string;
  achieved: boolean;
}

const SKILL_LEVELS: SkillLevel[] = [
  { level: "Novice", description: "Just starting out", icon: <Users size={24} />, color: "bg-gray-400" },
  { level: "Intermediate", description: "Building competence", icon: <Activity size={24} />, color: "bg-blue-400" },
  { level: "Expert", description: "Mastery achieved", icon: <Trophy size={24} />, color: "bg-green-500" }
];

const MILESTONES: Milestone[] = [
  { id: 1, title: "Basic Understanding", achieved: false },
  { id: 2, title: "Regular Practice", achieved: false },
  { id: 3, title: "Advanced Techniques", achieved: false }
];

export default function SkillDifferentialVisualizer() {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [practiceHours, setPracticeHours] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (!isAnimating) return;

    const intervalId = setInterval(() => {
      setPracticeHours(prev => (prev < 100 ? prev + 1 : 0));
      setCurrentLevel(prev => Math.floor(practiceHours / 40));
    }, 500);

    return () => clearInterval(intervalId);
  }, [isAnimating, practiceHours]);

  const handleMilestoneClick = (id: number) => {
    setMilestones(prev =>
      prev.map(milestone =>
        milestone.id === id ? { ...milestone, achieved: !milestone.achieved } : milestone
      )
    );
  };

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg" role="main">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Brain className="text-blue-500" />
        Skill Differential Explorer
      </h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-2">
            <Clock className="text-gray-600" />
            Practice Hours: {practiceHours}
          </span>
          <button
            onClick={toggleAnimation}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            aria-label={isAnimating ? "Pause Animation" : "Start Animation"}
          >
            <Zap size={20} />
            {isAnimating ? "Pause" : "Start"}
          </button>
        </div>

        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${practiceHours}%` }}
            role="progressbar"
            aria-valuenow={practiceHours}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="space-y-4">
        {SKILL_LEVELS.map((level, index) => (
          <div
            key={level.level}
            className={`p-4 rounded-lg transition-all duration-300 ${
              index === currentLevel ? level.color + " transform scale-105" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {level.icon}
              <div>
                <h3 className="font-semibold">{level.level}</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="text-blue-500" />
          Progress Milestones
        </h3>
        <div className="space-y-2">
          {milestones.map(milestone => (
            <button
              key={milestone.id}
              onClick={() => handleMilestoneClick(milestone.id)}
              className={`w-full p-3 rounded-lg flex items-center gap-2 transition duration-300 ${
                milestone.achieved ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
              aria-pressed={milestone.achieved}
            >
              {milestone.achieved && <ArrowUp size={20} />}
              {milestone.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}