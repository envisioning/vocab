"use client"
import { useState, useEffect } from "react";
import { Building2, Users, Brain, Cpu, Database, AlertTriangle } from "lucide-react";

interface City {
  parameters: number;
  buildings: number;
  citizens: number;
  computePower: number;
}

interface ModelStats {
  name: string;
  parameters: number;
  task: string;
}

const FAMOUS_MODELS: ModelStats[] = [
  { name: "Small NLP", parameters: 10000, task: "Text Classification" },
  { name: "BERT Base", parameters: 110000000, task: "Language Understanding" },
  { name: "GPT-3", parameters: 175000000000, task: "General Language Tasks" },
];

const ParameterCityBuilder = () => {
  const [city, setCity] = useState<City>({
    parameters: 0,
    buildings: 0,
    citizens: 0,
    computePower: 0,
  });

  const [autoGrow, setAutoGrow] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (!autoGrow) return;

    const growthInterval = setInterval(() => {
      setCity(prev => ({
        ...prev,
        parameters: prev.parameters + 1000,
        buildings: Math.floor(prev.parameters / 10000),
        citizens: Math.floor(prev.parameters / 1000),
        computePower: Math.floor(Math.log(prev.parameters + 1) * 10),
      }));
    }, 500);

    return () => clearInterval(growthInterval);
  }, [autoGrow]);

  const handleAddParameters = (amount: number) => {
    setCity(prev => ({
      ...prev,
      parameters: prev.parameters + amount,
      buildings: Math.floor((prev.parameters + amount) / 10000),
      citizens: Math.floor((prev.parameters + amount) / 1000),
      computePower: Math.floor(Math.log(prev.parameters + amount + 1) * 10),
    }));

    const nearestModel = FAMOUS_MODELS.find(
      model => Math.abs(model.parameters - (city.parameters + amount)) < 1000000
    );

    if (nearestModel) {
      setFeedback(`Your model is similar to ${nearestModel.name} used for ${nearestModel.task}!`);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto" role="main">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Parameter City Builder</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="text-blue-500" />
            <span>Buildings: {city.buildings.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-green-500" />
            <span>Citizens: {city.citizens.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="text-purple-500" />
            <span>Parameters: {city.parameters.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="text-red-500" />
            <span>Compute Power: {city.computePower}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="text-yellow-500" />
            <span>Memory Usage: {(city.parameters * 4 / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleAddParameters(1000)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Add 1K Parameters
        </button>
        <button
          onClick={() => handleAddParameters(1000000)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Add 1M Parameters
        </button>
        <button
          onClick={() => setAutoGrow(!autoGrow)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          {autoGrow ? "Pause Growth" : "Resume Growth"}
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 bg-blue-100 p-4 rounded-lg">
          <AlertTriangle className="text-blue-500" />
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ParameterCityBuilder;