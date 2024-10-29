"use client"
import { useState, useEffect } from "react";
import { Car, Sun, Cloud, CloudRain, Users, Truck, Trees } from "lucide-react";

interface ComponentProps {}

type ScenarioType = {
  weather: "sunny" | "cloudy" | "rainy";
  traffic: "light" | "moderate" | "heavy";
  pedestrians: "few" | "many";
};

type DecisionType = {
  action: string;
  explanation: string;
};

const SCENARIOS: ScenarioType[] = [
  { weather: "sunny", traffic: "light", pedestrians: "few" },
  { weather: "cloudy", traffic: "moderate", pedestrians: "many" },
  { weather: "rainy", traffic: "heavy", pedestrians: "few" },
];

/**
 * AVDecisionSimulator - An interactive component that simulates various driving scenarios
 * and shows how an Autonomous Vehicle (AV) would respond.
 */
const AVDecisionSimulator: React.FC<ComponentProps> = () => {
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>(SCENARIOS[0]);
  const [decision, setDecision] = useState<DecisionType>({ action: "", explanation: "" });
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setTimeout(() => {
        const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        setCurrentScenario(randomScenario);
        makeDecision(randomScenario);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, currentScenario]);

  const makeDecision = (scenario: ScenarioType) => {
    let action = "";
    let explanation = "";

    if (scenario.weather === "rainy" && scenario.traffic === "heavy") {
      action = "Reduce speed and increase following distance";
      explanation = "Poor visibility and increased stopping distance require extra caution.";
    } else if (scenario.pedestrians === "many") {
      action = "Slow down and prepare to stop";
      explanation = "High pedestrian activity requires increased alertness and caution.";
    } else {
      action = "Maintain course with standard precautions";
      explanation = "Current conditions allow for normal operation with standard safety protocols.";
    }

    setDecision({ action, explanation });
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const renderWeatherIcon = () => {
    switch (currentScenario.weather) {
      case "sunny":
        return <Sun className="text-yellow-500" />;
      case "cloudy":
        return <Cloud className="text-gray-500" />;
      case "rainy":
        return <CloudRain className="text-blue-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AV Decision Simulator</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2">Weather:</span>
            {renderWeatherIcon()}
          </div>
          <div className="flex items-center">
            <span className="mr-2">Traffic:</span>
            <Truck className={`${currentScenario.traffic === "heavy" ? "text-red-500" : "text-green-500"}`} />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Pedestrians:</span>
            <Users className={`${currentScenario.pedestrians === "many" ? "text-red-500" : "text-green-500"}`} />
          </div>
        </div>
        <button
          onClick={toggleSimulation}
          className={`px-4 py-2 rounded ${
            isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white transition duration-300`}
        >
          {isSimulating ? "Stop Simulation" : "Start Simulation"}
        </button>
      </div>
      <div className="relative h-40 bg-gray-300 rounded-lg overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="text-blue-500 w-16 h-16" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-400" />
        <div className="absolute top-0 left-0 right-0 flex justify-between p-2">
          <Trees className="text-green-500" />
          <Trees className="text-green-500" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">AV Decision</h3>
        <p className="mb-2">
          <strong>Action:</strong> {decision.action}
        </p>
        <p>
          <strong>Explanation:</strong> {decision.explanation}
        </p>
      </div>
    </div>
  );
};

export default AVDecisionSimulator;