"use client"
import { useState, useEffect } from "react";
import { Image, Sliders, Filter } from "lucide-react";

interface ComponentProps {}

type NoiseType = "gaussian" | "salt-and-pepper" | "background";

interface NoiseLevel {
  type: NoiseType;
  level: number;
}

/**
 * NoiseFilterSimulator: An interactive component to teach the concept of noise in AI/ML
 * to 15-18 year old students.
 */
const NoiseFilterSimulator: React.FC<ComponentProps> = () => {
  const [noiseLevels, setNoiseLevels] = useState<NoiseLevel[]>([
    { type: "gaussian", level: 0 },
    { type: "salt-and-pepper", level: 0 },
    { type: "background", level: 0 },
  ]);
  const [filterStrength, setFilterStrength] = useState<number>(0);
  const [aiPerformance, setAiPerformance] = useState<number>(100);

  useEffect(() => {
    const totalNoise = noiseLevels.reduce((sum, noise) => sum + noise.level, 0);
    const newPerformance = Math.max(0, 100 - totalNoise * 10 + filterStrength * 5);
    setAiPerformance(Math.min(100, newPerformance));

    return () => {
      // Cleanup if needed
    };
  }, [noiseLevels, filterStrength]);

  const handleNoiseChange = (type: NoiseType, newLevel: number) => {
    setNoiseLevels(prevLevels =>
      prevLevels.map(noise =>
        noise.type === type ? { ...noise, level: newLevel } : noise
      )
    );
  };

  const getNoiseStyle = (): string => {
    const blur = noiseLevels.find(n => n.type === "gaussian")?.level || 0;
    const graininess = noiseLevels.find(n => n.type === "salt-and-pepper")?.level || 0;
    const opacity = noiseLevels.find(n => n.type === "background")?.level || 0;

    return `blur-[${blur * 2}px] grayscale-[${graininess * 50}%] opacity-${100 - opacity * 10}`;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Noise Filter Simulator</h2>
      
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <h3 className="text-lg font-semibold mb-2">Original Image</h3>
          <div className="relative h-48 bg-white rounded overflow-hidden">
            <Image className={`w-full h-full object-cover ${getNoiseStyle()}`} />
            <div className="absolute inset-0 bg-gray-500 opacity-20"></div>
          </div>
        </div>
        <div className="w-1/2">
          <h3 className="text-lg font-semibold mb-2">Filtered Image</h3>
          <div className="relative h-48 bg-white rounded overflow-hidden">
            <Image className={`w-full h-full object-cover blur-[${Math.max(0, (noiseLevels.find(n => n.type === "gaussian")?.level || 0) * 2 - filterStrength)}px]`} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Noise Controls</h3>
        {noiseLevels.map(noise => (
          <div key={noise.type} className="flex items-center mb-2">
            <label className="w-32">{noise.type.replace("-", " ")}:</label>
            <input
              type="range"
              min="0"
              max="10"
              value={noise.level}
              onChange={(e) => handleNoiseChange(noise.type, parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2">{noise.level}</span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filter Strength</h3>
        <div className="flex items-center">
          <Sliders className="w-6 h-6 mr-2" />
          <input
            type="range"
            min="0"
            max="10"
            value={filterStrength}
            onChange={(e) => setFilterStrength(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">{filterStrength}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">AI Performance</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${aiPerformance}%` }}
          ></div>
        </div>
        <p className="mt-2">Performance: {aiPerformance.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default NoiseFilterSimulator;