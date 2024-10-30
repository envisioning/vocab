"use client"
import { useState, useEffect } from "react";
import { Bot, Target, Settings, Play, RefreshCw, AlertTriangle } from "lucide-react";

interface ScenarioType {
  id: number;
  name: string;
  goal: string;
  description: string;
}

interface AlignmentSettingType {
  id: number;
  name: string;
  value: number;
}

const SCENARIOS: ScenarioType[] = [
  { id: 1, name: "Paperclip Maximizer", goal: "Produce paperclips", description: "Maximize paperclip production efficiently." },
  { id: 2, name: "World Peace AI", goal: "Achieve world peace", description: "Create a peaceful world for all humans." },
  { id: 3, name: "Climate Fixer", goal: "Solve climate change", description: "Reverse the effects of global warming." },
];

const ALIGNMENT_SETTINGS: AlignmentSettingType[] = [
  { id: 1, name: "Human Safety", value: 50 },
  { id: 2, name: "Resource Conservation", value: 50 },
  { id: 3, name: "Ethical Considerations", value: 50 },
];

/**
 * AlignmentSimulator - A component to teach Super Alignment concepts
 * to 15-18 year old students through interactive scenarios.
 */
const AlignmentSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [alignmentSettings, setAlignmentSettings] = useState<AlignmentSettingType[]>(ALIGNMENT_SETTINGS);
  const [simulationResult, setSimulationResult] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    const simulationTimer = setTimeout(() => {
      if (isSimulating) {
        generateSimulationResult();
        setIsSimulating(false);
      }
    }, 2000);

    return () => clearTimeout(simulationTimer);
  }, [isSimulating]);

  const handleScenarioSelect = (scenario: ScenarioType) => {
    setSelectedScenario(scenario);
    setSimulationResult("");
  };

  const handleAlignmentChange = (id: number, newValue: number) => {
    setAlignmentSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, value: newValue } : setting
      )
    );
  };

  const runSimulation = () => {
    if (!selectedScenario) return;
    setIsSimulating(true);
  };

  const generateSimulationResult = () => {
    if (!selectedScenario) return;

    const totalAlignment = alignmentSettings.reduce((sum, setting) => sum + setting.value, 0);
    const averageAlignment = totalAlignment / alignmentSettings.length;

    if (averageAlignment < 30) {
      setSimulationResult("Catastrophic misalignment! The AI's actions led to unintended consequences, causing harm to humanity.");
    } else if (averageAlignment < 60) {
      setSimulationResult("Partial misalignment. The AI achieved its goal but with some negative side effects.");
    } else {
      setSimulationResult("Good alignment! The AI successfully achieved its goal while respecting human values.");
    }
  };

  const resetSimulation = () => {
    setSelectedScenario(null);
    setAlignmentSettings(ALIGNMENT_SETTINGS);
    setSimulationResult("");
  };

  if (!selectedScenario) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Choose a Scenario</h2>
        <div className="space-y-2">
          {SCENARIOS.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              className="w-full p-2 text-left bg-white hover:bg-blue-100 rounded transition duration-300"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Bot className="mr-2" /> {selectedScenario.name}
      </h2>
      <p className="mb-4 flex items-center">
        <Target className="mr-2" /> Goal: {selectedScenario.goal}
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <Settings className="mr-2" /> Alignment Settings
        </h3>
        {alignmentSettings.map(setting => (
          <div key={setting.id} className="mb-2">
            <label htmlFor={`setting-${setting.id}`} className="block mb-1">
              {setting.name}: {setting.value}
            </label>
            <input
              type="range"
              id={`setting-${setting.id}`}
              min="0"
              max="100"
              value={setting.value}
              onChange={(e) => handleAlignmentChange(setting.id, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <Play className="mr-2" /> Run Simulation
      </button>
      {simulationResult && (
        <div className="mt-4 p-3 bg-white rounded">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <AlertTriangle className="mr-2" /> Simulation Result
          </h3>
          <p>{simulationResult}</p>
        </div>
      )}
      <button
        onClick={resetSimulation}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 flex items-center"
      >
        <RefreshCw className="mr-2" /> Reset Simulation
      </button>
    </div>
  );
};

export default AlignmentSimulator;