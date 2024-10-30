"use client";
import { useState, useEffect } from "react";
import {
  Music,
  Volume2,
  VolumeX,
  Brain,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface Instrument {
  id: number;
  name: string;
  importance: number;
  active: boolean;
}

interface ComponentProps {}

const INSTRUMENTS: Instrument[] = [
  { id: 1, name: "Drums (Input Layer)", importance: 0.9, active: true },
  { id: 2, name: "Bass (Feature Extraction)", importance: 0.8, active: true },
  { id: 3, name: "Piano (Hidden Layer 1)", importance: 0.7, active: true },
  { id: 4, name: "Guitar (Hidden Layer 2)", importance: 0.85, active: true },
  { id: 5, name: "Violin (Output Layer)", importance: 0.95, active: true },
  {
    id: 6,
    name: "Flute (Activation Functions)",
    importance: 0.6,
    active: true,
  },
  { id: 7, name: "Trumpet (Weights)", importance: 0.75, active: true },
  { id: 8, name: "Saxophone (Biases)", importance: 0.5, active: true },
];

const AblationSimulator: React.FC<ComponentProps> = () => {
  const [instruments, setInstruments] = useState<Instrument[]>(INSTRUMENTS);
  const [performance, setPerformance] = useState<number>(100);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [phase, setPhase] = useState<"predict" | "experiment" | "conclusion">(
    "predict"
  );

  const calculatePerformance = (activeInstruments: Instrument[]): number => {
    const totalImportance = INSTRUMENTS.reduce(
      (sum, inst) => sum + inst.importance,
      0
    );
    const currentImportance = activeInstruments
      .filter((inst) => inst.active)
      .reduce((sum, inst) => sum + inst.importance, 0);
    return Math.round((currentImportance / totalImportance) * 100);
  };

  useEffect(() => {
    const newPerformance = calculatePerformance(instruments);
    setPerformance(newPerformance);
  }, [instruments]);

  const handleInstrumentToggle = (id: number) => {
    setInstruments((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, active: !inst.active } : inst
      )
    );
  };

  const handlePrediction = (id: number) => {
    setPrediction(id);
    setPhase("experiment");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Ablation Simulator</h2>
        <p className="text-gray-600">
          {phase === "predict"
            ? "Which component do you think is most critical?"
            : phase === "experiment"
            ? "Test your hypothesis by toggling components"
            : "What did you learn about component importance?"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            onClick={() =>
              phase === "predict"
                ? handlePrediction(instrument.id)
                : handleInstrumentToggle(instrument.id)
            }
            className={`p-4 rounded-lg flex flex-col items-center transition-all duration-300
                            ${
                              instrument.active
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }
                            ${
                              prediction === instrument.id
                                ? "ring-2 ring-green-500"
                                : ""
                            }`}
            aria-pressed={!instrument.active}
          >
            <Music className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">{instrument.name}</span>
            {instrument.active ? (
              <Volume2 className="w-4 h-4 mt-2" />
            ) : (
              <VolumeX className="w-4 h-4 mt-2" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Brain className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold">Performance: {performance}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 rounded-full h-4 transition-all duration-500"
            style={{ width: `${performance}%` }}
            role="progressbar"
            aria-valuenow={performance}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {performance < 50 && (
          <div className="mt-4 flex items-center text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>
              Critical components removed! Model performance severely impacted.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AblationSimulator;
