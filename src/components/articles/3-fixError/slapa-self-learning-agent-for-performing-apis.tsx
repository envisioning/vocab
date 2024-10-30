"use client"
import { useState, useEffect } from "react";
import { Chef, Server, Coffee, CreditCard, Brain, Timer, XCircle, CheckCircle } from "lucide-react";

interface Station {
  id: string;
  name: string;
  icon: JSX.Element;
  protocol: "GET" | "POST" | "PUT" | "DELETE";
  successRate: number;
}

interface AgentState {
  position: { x: number; y: number };
  currentStation: string | null;
  learningProgress: number;
  mistakes: number;
  successes: number;
}

const STATIONS: Station[] = [
  { id: "kitchen", name: "Kitchen API", icon: <Chef />, protocol: "POST", successRate: 0 },
  { id: "service", name: "Service API", icon: <Server />, protocol: "GET", successRate: 0 },
  { id: "bar", name: "Bar API", icon: <Coffee />, protocol: "PUT", successRate: 0 },
  { id: "payment", name: "Payment API", icon: <CreditCard />, protocol: "DELETE", successRate: 0 },
];

export default function SLAPARestaurant() {
  const [agent, setAgent] = useState<AgentState>({
    position: { x: 50, y: 50 },
    currentStation: null,
    learningProgress: 0,
    mistakes: 0,
    successes: 0,
  });

  const [stations, setStations] = useState<Station[]>(STATIONS);
  const [thought, setThought] = useState<string>("");
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (!isTraining) return;

    const trainingInterval = setInterval(() => {
      setAgent(prev => ({
        ...prev,
        learningProgress: Math.min(100, prev.learningProgress + 1)
      }));

      setStations(prev => prev.map(station => ({
        ...station,
        successRate: Math.min(100, station.successRate + Math.random() * 2)
      })));
    }, 1000);

    return () => clearInterval(trainingInterval);
  }, [isTraining]);

  const handleStationClick = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    const success = Math.random() < (station.successRate / 100);
    setAgent(prev => ({
      ...prev,
      currentStation: stationId,
      mistakes: success ? prev.mistakes : prev.mistakes + 1,
      successes: success ? prev.successes + 1 : prev.successes,
    }));

    setThought(success 
      ? `Successfully learned ${station.protocol} protocol for ${station.name}!`
      : `Learning ${station.protocol} protocol for ${station.name}...`);
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg p-4" role="application">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Brain className="text-blue-500" />
        <span>Learning Progress: {agent.learningProgress}%</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <div className="flex items-center">
          <XCircle className="text-red-500 mr-2" />
          <span>Mistakes: {agent.mistakes}</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2" />
          <span>Successes: {agent.successes}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-16">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => handleStationClick(station.id)}
            className={`p-4 rounded-lg transition-all duration-300 flex flex-col items-center gap-2
              ${station.id === agent.currentStation ? 'bg-blue-100' : 'bg-white'}
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label={`Train at ${station.name}`}
          >
            <div className="text-2xl">{station.icon}</div>
            <div className="font-medium">{station.name}</div>
            <div className="text-sm text-gray-600">{station.protocol} Protocol</div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${station.successRate}%` }}
                role="progressbar"
                aria-valuenow={station.successRate}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </button>
        ))}
      </div>

      {thought && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
          {thought}
        </div>
      )}

      <button
        onClick={() => setIsTraining(prev => !prev)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        aria-label={isTraining ? "Pause Training" : "Start Training"}
      >
        <Timer />
        {isTraining ? "Pause Training" : "Start Training"}
      </button>
    </div>
  );
}