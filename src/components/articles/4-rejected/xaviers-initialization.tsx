"use client"
import { useState, useEffect } from "react";
import { Music, Volume2, VolumeX, Zap, RefreshCw } from "lucide-react";

interface BandSection {
  id: number;
  name: string;
  volume: number;
  inputConnections: number;
}

interface SignalFlow {
  strength: number;
  isBalanced: boolean;
}

const INITIAL_SECTIONS: BandSection[] = [
  { id: 1, name: "Strings", volume: 0.5, inputConnections: 3 },
  { id: 2, name: "Brass", volume: 0.5, inputConnections: 4 },
  { id: 3, name: "Percussion", volume: 0.5, inputConnections: 2 },
];

const BandBalanceSimulator = () => {
  const [sections, setSections] = useState<BandSection[]>(INITIAL_SECTIONS);
  const [isXavierMode, setIsXavierMode] = useState<boolean>(false);
  const [signalFlow, setSignalFlow] = useState<SignalFlow>({ strength: 0.5, isBalanced: true });
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const calculateXavierVolume = (connections: number): number => {
    return Math.sqrt(2 / connections);
  };

  const calculateRandomVolume = (): number => {
    return Math.random();
  };

  const initializeVolumes = (useXavier: boolean) => {
    setSections(sections.map(section => ({
      ...section,
      volume: useXavier ? calculateXavierVolume(section.inputConnections) : calculateRandomVolume()
    })));
  };

  const calculateSignalStrength = (volumes: BandSection[]): SignalFlow => {
    const avgVolume = volumes.reduce((acc, curr) => acc + curr.volume, 0) / volumes.length;
    const isBalanced = volumes.every(s => Math.abs(s.volume - avgVolume) < 0.2);
    return { strength: avgVolume, isBalanced };
  };

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setSignalFlow(calculateSignalStrength(sections));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isAnimating, sections]);

  const handleModeToggle = () => {
    setIsXavierMode(!isXavierMode);
    initializeVolumes(!isXavierMode);
  };

  const handleReset = () => {
    setSections(INITIAL_SECTIONS);
    setIsAnimating(false);
    setSignalFlow({ strength: 0.5, isBalanced: true });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Band Balance Simulator</h2>
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
          aria-label="Reset simulation"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleModeToggle}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              isXavierMode ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            aria-pressed={isXavierMode}
          >
            {isXavierMode ? "Xavier Balance" : "Random Volume"}
          </button>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              isAnimating ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            aria-pressed={isAnimating}
          >
            {isAnimating ? "Stop" : "Play"}
          </button>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="flex items-center space-x-4">
            <Music className="w-6 h-6 text-gray-600" />
            <span className="w-24">{section.name}</span>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  signalFlow.isBalanced ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${section.volume * 100}%` }}
              />
            </div>
            {section.volume < 0.3 ? (
              <VolumeX className="w-5 h-5 text-red-500" />
            ) : section.volume > 0.7 ? (
              <Volume2 className="w-5 h-5 text-red-500" />
            ) : (
              <Zap className="w-5 h-5 text-green-500" />
            )}
          </div>
        ))}

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Signal Strength: {Math.round(signalFlow.strength * 100)}%
          </p>
          <p className="text-sm text-gray-600">
            Status: {signalFlow.isBalanced ? "Balanced ✨" : "Unbalanced ⚠️"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BandBalanceSimulator;