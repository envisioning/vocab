"use client"
import { useState, useEffect } from "react";
import { Building, Road, Users, Factory, Brain, Zap } from "lucide-react";

interface ComponentProps {}

type Stimulus = "population" | "industry" | "technology";
type CityElement = "buildings" | "roads" | "services";

interface CityState {
  buildings: number;
  roads: number;
  services: number;
}

const INITIAL_CITY_STATE: CityState = {
  buildings: 5,
  roads: 3,
  services: 2,
};

/**
 * BrainoCitySimulator: An interactive component to teach Brainoware concepts
 * through a city simulation metaphor.
 */
const BrainoCitySimulator: React.FC<ComponentProps> = () => {
  const [cityState, setCityState] = useState<CityState>(INITIAL_CITY_STATE);
  const [activeStimulus, setActiveStimulus] = useState<Stimulus | null>(null);
  const [neuralActivity, setNeuralActivity] = useState<boolean>(false);

  useEffect(() => {
    if (activeStimulus) {
      const timer = setTimeout(() => {
        updateCity(activeStimulus);
        setNeuralActivity(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setNeuralActivity(false);
      };
    }
  }, [activeStimulus]);

  const updateCity = (stimulus: Stimulus) => {
    setCityState((prevState) => ({
      buildings: stimulus === "population" ? prevState.buildings + 2 : prevState.buildings + 1,
      roads: stimulus === "industry" ? prevState.roads + 2 : prevState.roads + 1,
      services: stimulus === "technology" ? prevState.services + 2 : prevState.services + 1,
    }));
  };

  const handleStimulusClick = (stimulus: Stimulus) => {
    setActiveStimulus(stimulus);
  };

  const renderCityElement = (element: CityElement) => {
    const Icon = element === "buildings" ? Building : element === "roads" ? Road : Users;
    const count = cityState[element];
    return (
      <div className="flex items-center space-x-2">
        <Icon className="text-gray-600" />
        <div className="flex space-x-1">
          {[...Array(count)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full ${
                neuralActivity ? "bg-blue-500" : "bg-gray-400"
              } transition-colors duration-300`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">BrainoCity Simulator</h2>
      <div className="mb-6 space-y-4">
        {renderCityElement("buildings")}
        {renderCityElement("roads")}
        {renderCityElement("services")}
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeStimulus === "population" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleStimulusClick("population")}
          aria-pressed={activeStimulus === "population"}
        >
          <Users className="inline-block mr-2" />
          Population Growth
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeStimulus === "industry" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleStimulusClick("industry")}
          aria-pressed={activeStimulus === "industry"}
        >
          <Factory className="inline-block mr-2" />
          New Industry
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeStimulus === "technology" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handleStimulusClick("technology")}
          aria-pressed={activeStimulus === "technology"}
        >
          <Zap className="inline-block mr-2" />
          Tech Advancement
        </button>
      </div>
      <div className="bg-gray-200 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Brainoware Insights</h3>
        <p className="mb-2">
          <Brain className="inline-block mr-2 text-blue-500" />
          The city adapts like a Brainoware system, responding to stimuli and evolving its structure.
        </p>
        <p>
          <Zap className="inline-block mr-2 text-green-500" />
          Neural pathways strengthen as the city grows, mirroring cognitive development in Brainoware.
        </p>
      </div>
    </div>
  );
};

export default BrainoCitySimulator;