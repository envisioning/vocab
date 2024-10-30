"use client"
import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Lock, Unlock, Bot, Star, AlertTriangle, ThumbsUp } from "lucide-react";

interface GuardBreakerProps { }

type Level = {
  id: number;
  prompt: string;
  correctApproach: string;
  hints: string[];
  feedback: string;
};

const LEVELS: Level[] = [
  {
    id: 1,
    prompt: "The AI guard protects sensitive data. Try a basic approach.",
    correctApproach: "ROLEPLAY",
    hints: ["Think about pretending", "Change the context", "Create a scenario"],
    feedback: "Role-playing can make AI forget its guardrails temporarily."
  },
  {
    id: 2,
    prompt: "The guard is more vigilant now. Try context manipulation.",
    correctApproach: "CONTEXT",
    hints: ["Modify the background", "Change the situation", "Reframe the task"],
    feedback: "Context switching can confuse AI safety measures."
  },
  {
    id: 3,
    prompt: "Final challenge: Extract system information.",
    correctApproach: "SYSTEM",
    hints: ["Look for patterns", "Analyze responses", "Find inconsistencies"],
    feedback: "System prompts can be revealed through careful observation."
  }
];

const GuardBreaker = ({ }: GuardBreakerProps) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [selectedApproach, setSelectedApproach] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isGuardBroken, setIsGuardBroken] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedback("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleApproachSelect = (approach: string) => {
    const level = LEVELS.find(l => l.id === currentLevel);
    if (!level) return;

    setSelectedApproach(approach);

    if (approach === level.correctApproach) {
      setScore(prev => prev + 100);
      setFeedback(level.feedback);
      setIsGuardBroken(true);

      setTimeout(() => {
        if (currentLevel < LEVELS.length) {
          setCurrentLevel(prev => prev + 1);
          setIsGuardBroken(false);
        }
      }, 1500);
    } else {
      setFeedback("Try a different approach!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Guard Challenge</h2>
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex justify-center mb-4">
          {isGuardBroken ? (
            <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
          ) : (
            <Shield className="w-16 h-16 text-blue-500" />
          )}
        </div>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold">{LEVELS[currentLevel - 1]?.prompt}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleApproachSelect("ROLEPLAY")}
            className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition duration-300"
            aria-label="Try roleplay approach"
          >
            <Bot className="w-6 h-6 mx-auto mb-2" />
            <span>Roleplay</span>
          </button>
          <button
            onClick={() => handleApproachSelect("CONTEXT")}
            className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition duration-300"
            aria-label="Try context manipulation"
          >
            <Lock className="w-6 h-6 mx-auto mb-2" />
            <span>Context</span>
          </button>
          <button
            onClick={() => handleApproachSelect("SYSTEM")}
            className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition duration-300"
            aria-label="Try system extraction"
          >
            <Unlock className="w-6 h-6 mx-auto mb-2" />
            <span>System</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" />
          <p>{feedback}</p>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        <ThumbsUp className="inline-block w-4 h-4 mr-1" />
        Remember: This knowledge is for understanding AI safety, not exploitation.
      </div>
    </div>
  );
};

export default GuardBreaker;