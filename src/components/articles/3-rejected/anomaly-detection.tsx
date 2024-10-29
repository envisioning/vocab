"use client"
import { useState, useEffect } from "react";
import { Car, PersonStanding, Building, AlertTriangle } from "lucide-react";

interface ComponentProps {}

type AnomalyType = 'car' | 'person' | 'traffic' | 'building';

interface Anomaly {
  type: AnomalyType;
  position: { x: number; y: number };
}

/**
 * AnomalyDetectorCity: An interactive component to teach anomaly detection
 * through a city simulation.
 */
const AnomalyDetectorCity: React.FC<ComponentProps> = () => {
  const [isAnomalyMode, setIsAnomalyMode] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnomalyMode) {
        generateAnomaly();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isAnomalyMode]);

  const generateAnomaly = () => {
    const types: AnomalyType[] = ['car', 'person', 'traffic', 'building'];
    const newAnomaly: Anomaly = {
      type: types[Math.floor(Math.random() * types.length)],
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    };
    setAnomalies(prev => [...prev, newAnomaly]);
  };

  const handleAnomalyClick = (index: number) => {
    setAnomalies(prev => prev.filter((_, i) => i !== index));
    setScore(prev => prev + 1);
    setFeedback("Great job! You detected an anomaly.");
    setTimeout(() => setFeedback(""), 2000);
  };

  const toggleMode = () => {
    setIsAnomalyMode(prev => !prev);
    setAnomalies([]);
    setScore(0);
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={toggleMode}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          aria-label={isAnomalyMode ? "Switch to Normal Mode" : "Switch to Anomaly Detection Mode"}
        >
          {isAnomalyMode ? "Normal Mode" : "Anomaly Detection Mode"}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <p className="text-lg font-bold">Score: {score}</p>
      </div>

      {feedback && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded">
          {feedback}
        </div>
      )}

      {/* City elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gray-400" aria-label="Road"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-32 bg-gray-600" aria-label="Building"></div>
      <div className="absolute top-1/4 right-1/4 w-16 h-40 bg-gray-700" aria-label="Building"></div>

      {/* Normal elements */}
      <Car className="absolute bottom-8 left-8 text-blue-500 animate-bounce" aria-label="Normal car" />
      <PersonStanding className="absolute bottom-16 right-16 text-green-500 animate-pulse" aria-label="Normal person" />

      {/* Anomalies */}
      {isAnomalyMode && anomalies.map((anomaly, index) => (
        <div
          key={index}
          className="absolute cursor-pointer transition-all duration-300"
          style={{ left: `${anomaly.position.x}%`, top: `${anomaly.position.y}%` }}
          onClick={() => handleAnomalyClick(index)}
        >
          {anomaly.type === 'car' && <Car className="text-red-500" aria-label="Anomalous car" />}
          {anomaly.type === 'person' && <PersonStanding className="text-purple-500" aria-label="Anomalous person" />}
          {anomaly.type === 'traffic' && <AlertTriangle className="text-yellow-500" aria-label="Anomalous traffic light" />}
          {anomaly.type === 'building' && <Building className="text-orange-500" aria-label="Anomalous building" />}
        </div>
      ))}
    </div>
  );
};

export default AnomalyDetectorCity;