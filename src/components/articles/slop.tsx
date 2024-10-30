"use client"
import { useState, useEffect } from "react";
import { Filter, Droplets } from "lucide-react";

interface ComponentProps {}

type WaterLevel = "low" | "medium" | "high";

/**
 * SlopOMeter: An interactive component to teach the concept of "Slop" in AI-generated content.
 * It visualizes information flow and relevance using a faucet, glass, and sink metaphor.
 */
const SlopOMeter: React.FC<ComponentProps> = () => {
  const [faucetLevel, setFaucetLevel] = useState<WaterLevel>("low");
  const [sinkLevel, setSinkLevel] = useState<number>(0);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [relevantInfo, setRelevantInfo] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSinkLevel((prev) => {
        const newLevel = prev + (faucetLevel === "low" ? 1 : faucetLevel === "medium" ? 2 : 3);
        setIsOverflowing(newLevel > 80);
        return Math.min(newLevel, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [faucetLevel]);

  useEffect(() => {
    setRelevantInfo(Math.min(sinkLevel, 50));
  }, [sinkLevel]);

  const handleFaucetChange = (level: WaterLevel) => {
    setFaucetLevel(level);
  };

  const handleFilter = () => {
    setSinkLevel((prev) => Math.max(prev - 20, 0));
    setIsOverflowing(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">The Slop-O-Meter</h2>
      
      <div className="flex items-center mb-4">
        <Droplets className="w-8 h-8 mr-2" />
        <div className="flex space-x-2">
          {["low", "medium", "high"].map((level) => (
            <button
              key={level}
              onClick={() => handleFaucetChange(level as WaterLevel)}
              className={`px-3 py-1 rounded ${
                faucetLevel === level ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              aria-pressed={faucetLevel === level}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-64 h-64 bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          className={`absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500 ${
            isOverflowing ? "animate-pulse" : ""
          }`}
          style={{ height: `${sinkLevel}%` }}
          aria-label={`Sink filled ${sinkLevel}%`}
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-400 transition-all duration-500"
          style={{ height: `${relevantInfo}%` }}
          aria-label={`Relevant information ${relevantInfo}%`}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-32 border-4 border-gray-400 rounded-lg" />
      </div>

      <p className="mt-2 text-center">
        {isOverflowing ? "Information overload! Filter to find relevant content." : "Adjust the faucet to control information flow."}
      </p>

      <button
        onClick={handleFilter}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center"
        disabled={sinkLevel === 0}
      >
        <Filter className="w-5 h-5 mr-2" />
        Filter Information
      </button>

      <div className="mt-4 text-center">
        <p>Faucet Level: {faucetLevel}</p>
        <p>Sink Level: {sinkLevel}%</p>
        <p>Relevant Information: {relevantInfo}%</p>
      </div>
    </div>
  );
};

export default SlopOMeter;