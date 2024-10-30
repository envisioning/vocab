"use client";
import { useState, useEffect } from "react";
import { Medal, Flame, Timer, Dumbbell, RotateCcw, Trophy } from "lucide-react";

interface FitnessTrackerState {
  workouts: number;
  exercises: string[];
  fitnessPoints: number;
  favoriteExercise: string;
  achievements: string[];
}

/**
 * StatefulFitnessTracker - Educational component demonstrating stateful behavior
 * through an interactive fitness tracking experience
 */
export default function StatefulFitnessTracker() {
  const [state, setState] = useState<FitnessTrackerState>({
    workouts: 0,
    exercises: [],
    fitnessPoints: 0,
    favoriteExercise: "",
    achievements: [],
  });

  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const EXERCISE_OPTIONS = ["Running", "Yoga", "Weights", "Swim"];

  useEffect(() => {
    if (state.workouts === 5 && !state.achievements.includes("Regular")) {
      setState((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Regular"],
      }));
    }
    return () => {
      // Cleanup not needed for this effect
    };
  }, [state.workouts]);

  const handleWorkout = (exercise: string) => {
    setOrderHistory((prev) => [...prev, exercise]);
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts + 1,
      fitnessPoints: prev.fitnessPoints + 10,
      exercises: [...prev.exercises, exercise],
      favoriteExercise:
        prev.exercises.length > 0
          ? getMostFrequent([...prev.exercises, exercise])
          : exercise,
    }));
  };

  const getMostFrequent = (arr: string[]): string => {
    return (
      arr
        .sort(
          (a, b) =>
            arr.filter((v) => v === a).length -
            arr.filter((v) => v === b).length
        )
        .pop() || ""
    );
  };

  const resetState = () => {
    setState({
      workouts: 0,
      exercises: [],
      fitnessPoints: 0,
      favoriteExercise: "",
      achievements: [],
    });
    setOrderHistory([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Fitness Profile
        </h2>
        <button
          onClick={resetState}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          aria-label="Reset profile"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-blue-500" />
            <span>Workouts: {state.workouts}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="text-red-500" />
            <span>Fitness Points: {state.fitnessPoints}</span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="text-yellow-500" />
            <span>
              Favorite Exercise:{" "}
              {state.favoriteExercise || "Not yet determined"}
            </span>
          </div>
          {state.achievements.length > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="text-green-500" />
              <span>Achievements: {state.achievements.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="border-l pl-6">
          <h3 className="text-lg font-semibold mb-4">Log Workout</h3>
          <div className="grid grid-cols-2 gap-3">
            {EXERCISE_OPTIONS.map((exercise) => (
              <button
                key={exercise}
                onClick={() => handleWorkout(exercise)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
                aria-label={`Log ${exercise}`}
              >
                <Timer size={16} />
                {exercise}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Workout History</h3>
        <div className="flex flex-wrap gap-2">
          {orderHistory.map((order, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {order}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
