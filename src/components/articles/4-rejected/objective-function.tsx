"use client"
import { useState, useEffect } from "react";
import { Bot, Battery, Brain, Heart, Zap, Award } from "lucide-react";

interface PetState {
  energy: number;
  fun: number;
  learning: number;
  rest: number;
}

interface Challenge {
  id: number;
  description: string;
  target: PetState;
  isCompleted: boolean;
}

const INITIAL_PET_STATE: PetState = {
  energy: 50,
  fun: 50,
  learning: 50,
  rest: 50,
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    description: "Create a balanced happy pet",
    target: { energy: 75, fun: 75, learning: 75, rest: 75 },
    isCompleted: false,
  },
  {
    id: 2,
    description: "Maximize learning while maintaining energy",
    target: { energy: 80, fun: 40, learning: 90, rest: 60 },
    isCompleted: false,
  },
];

export default function ObjectiveFunctionLearner() {
  const [petState, setPetState] = useState<PetState>(INITIAL_PET_STATE);
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [happiness, setHappiness] = useState<number>(0);
  const [activeChallenge, setActiveChallenge] = useState<number>(1);

  useEffect(() => {
    const calculateHappiness = () => {
      const weights = {
        energy: 0.25,
        fun: 0.25,
        learning: 0.25,
        rest: 0.25,
      };

      const score =
        weights.energy * petState.energy +
        weights.fun * petState.fun +
        weights.learning * petState.learning +
        weights.rest * petState.rest;

      setHappiness(Math.round(score / 4));
    };

    calculateHappiness();

    return () => {
      setHappiness(0);
    };
  }, [petState]);

  useEffect(() => {
    const checkChallengeCompletion = () => {
      const currentChallenge = challenges.find((c) => c.id === activeChallenge);
      if (!currentChallenge) return;

      const isCompleted =
        Math.abs(petState.energy - currentChallenge.target.energy) <= 10 &&
        Math.abs(petState.fun - currentChallenge.target.fun) <= 10 &&
        Math.abs(petState.learning - currentChallenge.target.learning) <= 10 &&
        Math.abs(petState.rest - currentChallenge.target.rest) <= 10;

      if (isCompleted) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === activeChallenge ? { ...c, isCompleted: true } : c
          )
        );
      }
    };

    checkChallengeCompletion();
  }, [petState, activeChallenge, challenges]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    attribute: keyof PetState
  ) => {
    setPetState((prev) => ({
      ...prev,
      [attribute]: parseInt(e.target.value),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Bot
          className={`w-12 h-12 ${
            happiness > 75 ? "text-green-500" : "text-gray-400"
          }`}
        />
        <div className="text-2xl font-bold">Happiness Score: {happiness}</div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Battery className="w-6 h-6 text-blue-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={petState.energy}
            onChange={(e) => handleSliderChange(e, "energy")}
            className="w-full"
            aria-label="Energy level"
          />
          <span className="w-12 text-right">{petState.energy}%</span>
        </div>

        <div className="flex items-center gap-4">
          <Heart className="w-6 h-6 text-blue-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={petState.fun}
            onChange={(e) => handleSliderChange(e, "fun")}
            className="w-full"
            aria-label="Fun level"
          />
          <span className="w-12 text-right">{petState.fun}%</span>
        </div>

        <div className="flex items-center gap-4">
          <Brain className="w-6 h-6 text-blue-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={petState.learning}
            onChange={(e) => handleSliderChange(e, "learning")}
            className="w-full"
            aria-label="Learning level"
          />
          <span className="w-12 text-right">{petState.learning}%</span>
        </div>

        <div className="flex items-center gap-4">
          <Zap className="w-6 h-6 text-blue-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={petState.rest}
            onChange={(e) => handleSliderChange(e, "rest")}
            className="w-full"
            aria-label="Rest level"
          />
          <span className="w-12 text-right">{petState.rest}%</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg">
        <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
          <Award className="w-6 h-6 text-blue-500" />
          Current Challenge
        </h2>
        <p className="mb-4">
          {challenges.find((c) => c.id === activeChallenge)?.description}
        </p>
        <div
          className={`p-2 rounded ${
            challenges.find((c) => c.id === activeChallenge)?.isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {challenges.find((c) => c.id === activeChallenge)?.isCompleted
            ? "Challenge completed!"
            : "Adjust the sliders to complete the challenge"}
        </div>
      </div>
    </div>
  );
}