"use client"
import { useState, useEffect } from "react";
import { Lock, Unlock, Play, Pause, RotateCcw } from "lucide-react";

interface SafeState {
  combination: string;
  currentAttempt: string;
  attempts: number;
  isRunning: boolean;
  startTime: number | null;
  speed: number;
  isSolved: boolean;
  triedCombinations: Set<number>;
}

const TOTAL_COMBINATIONS = 1000;
const INITIAL_SPEED = 50;

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
    isRunning: false,
    startTime: null,
    speed: INITIAL_SPEED,
    isSolved: false,
    triedCombinations: new Set<number>([0]),
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.isRunning && !state.isSolved) {
      intervalId = setInterval(() => {
        setState((prev) => {
          const nextAttemptNum = parseInt(prev.currentAttempt) + 1;
          const nextAttempt = nextAttemptNum.toString().padStart(3, "0");
          const isSolved = nextAttempt === prev.combination;
          const newTriedCombinations = new Set(prev.triedCombinations);
          newTriedCombinations.add(nextAttemptNum);

          return {
            ...prev,
            currentAttempt: nextAttempt,
            attempts: prev.attempts + 1,
            isSolved,
            isRunning: !isSolved,
            triedCombinations: newTriedCombinations,
          };
        });
      }, state.speed);
    }

    return () => clearInterval(intervalId);
  }, [state.isRunning, state.speed, state.isSolved]);

  const handleDigitChange = (index: number, increment: number) => {
    if (state.isRunning || state.isSolved) return;

    setState((prev) => {
      const digits = prev.currentAttempt.split("");
      digits[index] = ((parseInt(digits[index]) + increment + 10) % 10).toString();
      const newAttempt = digits.join("");
      const newAttemptNum = parseInt(newAttempt);
      const isSolved = newAttempt === prev.combination;
      const newTriedCombinations = new Set(prev.triedCombinations);
      newTriedCombinations.add(newAttemptNum);

      return {
        ...prev,
        currentAttempt: newAttempt,
        attempts: prev.attempts + 1,
        isSolved,
        triedCombinations: newTriedCombinations,
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
      triedCombinations: new Set<number>([0]),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Safe Cracker</h2>
          <p className="text-sm text-gray-600">Solution: {state.combination}</p>
        </div>
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
                disabled={state.isRunning || state.isSolved}
              >
                ▲
              </button>
              <div className="w-12 h-12 flex items-center justify-center text-2xl font-mono bg-gray-50 border rounded">
                {digit}
              </div>
              <button
                onClick={() => handleDigitChange(index, -1)}
                className="p-2 hover:bg-gray-100 rounded"
                disabled={state.isRunning || state.isSolved}
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
        <div className="flex items-center justify-between mb-4">
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
          <div className="text-sm text-gray-600">
            Attempts: {state.attempts}/{TOTAL_COMBINATIONS}
          </div>
        </div>

        <div className="w-full bg-white p-4 rounded-lg shadow-inner">
          <div className="flex w-full h-16 items-center">
            <div className="w-full grid" style={{ gridTemplateColumns: `repeat(${TOTAL_COMBINATIONS}, 1fr)` }}>
              {Array.from({ length: TOTAL_COMBINATIONS }, (_, i) => (
                <div
                  key={i}
                  className={`h-16 w-full transition-colors duration-200 ${
                    parseInt(state.currentAttempt) === i
                      ? "bg-green-500"
                      : state.triedCombinations.has(i)
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                  title={`${i.toString().padStart(3, "0")}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}