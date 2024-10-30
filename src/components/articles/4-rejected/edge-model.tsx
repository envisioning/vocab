"use client"
import { useState, useEffect } from "react";
import { Camera, Cloud, Wifi, WifiOff, User, Clock, Zap } from "lucide-react";

interface SimulationState {
  networkQuality: number;
  isEdgeMode: boolean;
  cloudLatency: number;
  edgeLatency: number;
  isNetworkDown: boolean;
  detectedPeople: number;
}

interface Person {
  id: number;
  position: number;
}

const INITIAL_STATE: SimulationState = {
  networkQuality: 100,
  isEdgeMode: false,
  cloudLatency: 0,
  edgeLatency: 0,
  isNetworkDown: false,
  detectedPeople: 0,
};

export default function EdgeModelSimulator() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let personId = 0;

    interval = setInterval(() => {
      if (people.length < 5) {
        setPeople(prev => [...prev, { id: personId++, position: 0 }]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPeople(prev => 
        prev.map(person => ({
          ...person,
          position: person.position + 2
        })).filter(person => person.position < 100)
      );
    }, 100);

    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    const processingTime = state.isEdgeMode ? 100 : (1000 / state.networkQuality) * 500;
    
    setState(prev => ({
      ...prev,
      cloudLatency: state.isEdgeMode ? prev.cloudLatency : processingTime,
      edgeLatency: state.isEdgeMode ? 100 : prev.edgeLatency,
      detectedPeople: people.length
    }));
  }, [people, state.isEdgeMode, state.networkQuality]);

  const handleNetworkQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quality = parseInt(e.target.value);
    setState(prev => ({
      ...prev,
      networkQuality: quality,
      isNetworkDown: quality < 20
    }));
  };

  const toggleProcessingMode = () => {
    setState(prev => ({
      ...prev,
      isEdgeMode: !prev.isEdgeMode
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Security Camera Simulator</h2>
          <button
            onClick={toggleProcessingMode}
            className={`px-4 py-2 rounded-lg ${
              state.isEdgeMode ? "bg-blue-500" : "bg-gray-500"
            } text-white transition duration-300`}
            aria-label="Toggle processing mode"
          >
            {state.isEdgeMode ? "Edge Processing" : "Cloud Processing"}
          </button>
        </div>

        <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute top-2 left-2">
            <Camera className="text-blue-500" />
          </div>
          {people.map(person => (
            <div
              key={person.id}
              className="absolute bottom-4 transition-all duration-300"
              style={{ left: `${person.position}%` }}
            >
              <User className="text-gray-700" />
            </div>
          ))}
          {state.isNetworkDown && !state.isEdgeMode && (
            <div className="absolute inset-0 bg-red-200 bg-opacity-50 flex items-center justify-center">
              <WifiOff className="text-red-500" />
              <span className="ml-2">Network Down</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Wifi className="mr-2" />
            <input
              type="range"
              min="0"
              max="100"
              value={state.networkQuality}
              onChange={handleNetworkQualityChange}
              className="w-full"
              aria-label="Network quality"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>Network Quality: {state.networkQuality}%</span>
            {state.isNetworkDown && <span className="text-red-500">Network Down!</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center">
              <Clock className="mr-2 text-blue-500" />
              <span>Edge Latency: {state.edgeLatency.toFixed(0)}ms</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <div className="flex items-center">
              <Zap className="mr-2 text-blue-500" />
              <span>Cloud Latency: {state.cloudLatency.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}