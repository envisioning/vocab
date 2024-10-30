"use client"
import { useState, useEffect } from "react";
import { Lock, Unlock, Play, Pause, RotateCcw, Settings2 } from "lucide-react";

interface SafeState {
  combination: string;
  currentAttempt: string;
  attempts: number;
  isAutoMode: boolean;
  isRunning: boolean;
  startTime: number | null;
  speed: number;
  isSolved: boolean;
}

const TOTAL_COMBINATIONS = 1000;
const INITIAL_SPEED = 500;

const generateRandomCombination = (): string => {
  return Math.floor(Math.random() * TOTAL_COMBINATIONS)
    .toString()
    .padStart(3, "0");
};

export default function BruteForceSafeSimulator() {
  const [state, setState] = useState<SafeState>({
    combination: generateRandomCombination(),
    currentAttempt: "000",
    attempts: 0,
    isAutoMode: false,
    isRunning: false,
    startTime: null,
    speed: INITIAL_SPEED,
    isSolved: false,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.isAutoMode && state.isRunning && !state.isSolved) {
      intervalId = setInterval(() => {
        setState((prev) => {
          const nextAttempt = (parseInt(prev.currentAttempt) + 1)
            .toString()
            .padStart(3, "0");
          const isSolved = nextAttempt === prev.combination;

          return {
            ...prev,
            currentAttempt: nextAttempt,
            attempts: prev.attempts + 1,
            isSolved,
            isRunning: !isSolved,
          };
        });
      }, state.speed);
    }

    return () => clearInterval(intervalId);
  }, [state.isAutoMode, state.isRunning, state.speed, state.isSolved]);

  const handleDigitChange = (index: number, increment: number) => {
    if (state.isAutoMode || state.isSolved) return;

    setState((prev) => {
      const digits = prev.currentAttempt.split("");
      digits[index] = ((parseInt(digits[index]) + increment + 10) % 10).toString();
      const newAttempt = digits.join("");
      const isSolved = newAttempt === prev.combination;

      return {
        ...prev,
        currentAttempt: newAttempt,
        attempts: prev.attempts + 1,
        isSolved,
      };
    });
  };

  const handleReset = () => {
    setState({
      ...state,
      combination: generateRandomCombination(),
      currentAttempt: "000",
      attempts: 0,
      isRunning: false,
      startTime: null,
      isSolved: false,
    });
  };

  const progress = (parseInt(state.currentAttempt) / TOTAL_COMBINATIONS) * 100;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Safe Cracker</h2>
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
          aria-label="Reset safe"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-inner mb-6">
        <div className="flex justify-center items-center space-x-4 mb-4">
          {state.currentAttempt.split("").map((digit, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              role="spinbutton"
              aria-label={`Digit ${index + 1}`}
              aria-valuenow={parseInt(digit)}
            >
              <button
                onClick={() => handleDigitChange(index, 1)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={state.isAutoMode || state.isSolved}
              >
                ▲
              </button>
              <div className="w-12 h-12 flex items-center justify-center text-2xl font-mono bg-gray-50 border rounded">
                {digit}
              </div>
              <button
                onClick={() => handleDigitChange(index, -1)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={state.isAutoMode || state.isSolved}
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {state.isSolved ? (
          <div className="flex justify-center">
            <Unlock className="w-8 h-8 text-green-500" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, isAutoMode: !prev.isAutoMode }))
              }
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
              aria-label="Toggle auto mode"
            >
              <Settings2
                className={`w-6 h-6 ${
                  state.isAutoMode ? "text-blue-500" : "text-gray-500"
                }`}
              />
            </button>
            {state.isAutoMode && (
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, isRunning: !prev.isRunning }))
                }
                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                aria-label={state.isRunning ? "Pause" : "Play"}
              >
                {state.isRunning ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Attempts: {state.attempts}/{TOTAL_COMBINATIONS}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  );
}