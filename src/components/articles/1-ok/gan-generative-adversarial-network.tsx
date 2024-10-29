"use client"
import { useState, useEffect } from "react";
import { Palette, Eye, XCircle, CheckCircle, Play, Pause, RotateCcw } from "lucide-react";

interface GANState {
  generatorScore: number;
  discriminatorScore: number;
  currentRound: number;
  isPlaying: boolean;
  feedback: string;
  generatedArt: string[];
  realArt: string[];
}

/**
 * GANBattleArena - Interactive component teaching GAN concepts through art forgery metaphor
 * @returns React.FC
 */
const GANBattleArena: React.FC = () => {
  const [state, setState] = useState<GANState>({
    generatorScore: 0,
    discriminatorScore: 0,
    currentRound: 0,
    isPlaying: false,
    feedback: "Ready to start the GAN battle!",
    generatedArt: ["🎨", "🖼️", "🎭"],
    realArt: ["🖼️", "🎨", "🎭"],
  });

  const handleStart = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleReset = () => {
    setState({
      generatorScore: 0,
      discriminatorScore: 0,
      currentRound: 0,
      isPlaying: false,
      feedback: "Ready to start the GAN battle!",
      generatedArt: ["🎨", "🖼️", "🎭"],
      realArt: ["🖼️", "🎨", "🎭"],
    });
  };

  const evaluateRound = () => {
    const success = Math.random() > 0.5;
    setState(prev => ({
      ...prev,
      generatorScore: success ? prev.generatorScore + 1 : prev.generatorScore,
      discriminatorScore: !success ? prev.discriminatorScore + 1 : prev.discriminatorScore,
      currentRound: prev.currentRound + 1,
      feedback: success ? "Generator fooled the discriminator!" : "Discriminator caught the fake!",
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isPlaying && state.currentRound < 10) {
      interval = setInterval(evaluateRound, 2000);
    }
    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentRound]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">GAN Battle Arena</h2>
        <div className="space-x-2">
          <button
            onClick={handleStart}
            className="p-2 bg-blue-500 text-white rounded-lg"
            aria-label={state.isPlaying ? "Pause simulation" : "Start simulation"}
          >
            {state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-500 text-white rounded-lg"
            aria-label="Reset simulation"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="text-blue-500" />
            <h3 className="text-lg font-semibold">Generator (The Forger)</h3>
          </div>
          <div className="h-24 flex items-center justify-center">
            {state.generatedArt.map((art, i) => (
              <span key={i} className="text-4xl mx-2">{art}</span>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 rounded-full h-full transition-all duration-500"
              style={{ width: `${(state.generatorScore / 10) * 100}%` }}
              role="progressbar"
              aria-valuenow={state.generatorScore}
              aria-valuemin={0}
              aria-valuemax={10}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-blue-500" />
            <h3 className="text-lg font-semibold">Discriminator (The Expert)</h3>
          </div>
          <div className="h-24 flex items-center justify-center">
            {state.realArt.map((art, i) => (
              <span key={i} className="text-4xl mx-2">{art}</span>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 rounded-full h-full transition-all duration-500"
              style={{ width: `${(state.discriminatorScore / 10) * 100}%` }}
              role="progressbar"
              aria-valuenow={state.discriminatorScore}
              aria-valuemin={0}
              aria-valuemax={10}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <p className="text-center text-lg">
          {state.feedback}
          {state.currentRound >= 10 && (
            <span className="ml-2">
              {state.generatorScore > state.discriminatorScore ? (
                <CheckCircle className="inline text-green-500" />
              ) : (
                <XCircle className="inline text-red-500" />
              )}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default GANBattleArena;