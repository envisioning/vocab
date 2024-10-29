"use client"
import { useState, useEffect } from "react";
import { Music, VolumeX, Volume2, ArrowRight, ArrowLeft } from "lucide-react";

interface ComponentProps {}

type Instrument = {
  name: string;
  importance: number;
  icon: JSX.Element;
};

type Scenario = {
  name: string;
  instruments: Instrument[];
};

const SCENARIOS: Scenario[] = [
  {
    name: "House Price Prediction",
    instruments: [
      { name: "Location", importance: 0.8, icon: <Music size={24} /> },
      { name: "Size", importance: 0.7, icon: <Music size={24} /> },
      { name: "Age", importance: 0.5, icon: <Music size={24} /> },
      { name: "Bedrooms", importance: 0.4, icon: <Music size={24} /> },
      { name: "Bathrooms", importance: 0.3, icon: <Music size={24} /> },
    ],
  },
  {
    name: "Email Classification",
    instruments: [
      { name: "Sender", importance: 0.6, icon: <Music size={24} /> },
      { name: "Subject", importance: 0.7, icon: <Music size={24} /> },
      { name: "Content", importance: 0.9, icon: <Music size={24} /> },
      { name: "Time", importance: 0.3, icon: <Music size={24} /> },
      { name: "Attachments", importance: 0.4, icon: <Music size={24} /> },
    ],
  },
];

/**
 * FeatureImportanceOrchestra: An interactive component to teach feature importance
 * using the metaphor of an orchestra.
 */
const FeatureImportanceOrchestra: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [harmony, setHarmony] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHarmony((prev) => (prev < 100 ? prev + 1 : 0));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleInstrumentClick = (instrumentName: string) => {
    setSelectedInstrument(instrumentName);
  };

  const handleScenarioChange = (direction: "next" | "prev") => {
    setCurrentScenario((prev) => {
      if (direction === "next") {
        return (prev + 1) % SCENARIOS.length;
      } else {
        return prev === 0 ? SCENARIOS.length - 1 : prev - 1;
      }
    });
    setSelectedInstrument(null);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Feature Importance Orchestra</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleScenarioChange("prev")}
          className="p-2 bg-blue-500 text-white rounded-full"
          aria-label="Previous scenario"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-xl font-semibold">{SCENARIOS[currentScenario].name}</h3>
        <button
          onClick={() => handleScenarioChange("next")}
          className="p-2 bg-blue-500 text-white rounded-full"
          aria-label="Next scenario"
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {SCENARIOS[currentScenario].instruments.map((instrument) => (
          <button
            key={instrument.name}
            onClick={() => handleInstrumentClick(instrument.name)}
            className={`p-4 rounded-lg transition-all duration-300 ${
              selectedInstrument === instrument.name ? "bg-blue-500 text-white" : "bg-white"
            }`}
            style={{ transform: `scale(${0.8 + instrument.importance * 0.4})` }}
            aria-label={`${instrument.name} instrument`}
          >
            {instrument.icon}
            <p className="mt-2">{instrument.name}</p>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Harmony Meter</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 rounded-full h-4 transition-all duration-300"
            style={{ width: `${harmony}%` }}
            role="progressbar"
            aria-valuenow={harmony}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
      {selectedInstrument && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Feature Details</h4>
          <p>
            {selectedInstrument} is{" "}
            {SCENARIOS[currentScenario].instruments.find((i) => i.name === selectedInstrument)
              ?.importance! > 0.6
              ? "very important"
              : "moderately important"}{" "}
            in this scenario.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureImportanceOrchestra;