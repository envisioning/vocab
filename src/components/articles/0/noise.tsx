"use client"
import { useState, useEffect } from "react";
import { Volume2, Volume1, VolumeX, Radio, Zap, Info } from "lucide-react";

interface DataPoint {
  id: number;
  value: number;
  isNoise: boolean;
}

/**
 * NoiseVisualizer demonstrates AI data noise through an interactive visualization
 * showing clean vs noisy signals and their impact on AI learning
 */
const NoiseVisualizer = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const generateData = () => {
      const newData: DataPoint[] = [];
      for (let i = 0; i < 20; i++) {
        const cleanValue = Math.sin(i * 0.5) * 50 + 50;
        const noise = (Math.random() - 0.5) * noiseLevel * 30;
        newData.push({
          id: i,
          value: cleanValue + noise,
          isNoise: Math.abs(noise) > 15
        });
      }
      setData(newData);
    };

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(generateData, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, noiseLevel]);

  const handleNoiseChange = (level: number) => {
    setNoiseLevel(level);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center p-6 md:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-800 dark:via-blue-900/20 dark:to-gray-900 rounded-xl shadow-xl max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Radio className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          AI Signal Noise Visualizer
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      {showInfo && (
        <div className="w-full mb-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg text-sm md:text-base">
          <p className="text-gray-700 dark:text-gray-300">
            Noise in AI refers to unwanted variations in data that can confuse machine learning models. 
            This visualizer shows how different noise levels affect the clarity of signals that AI systems process.
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => handleNoiseChange(0)}
          className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base ${
            noiseLevel === 0
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <Volume1 className="w-4 h-4 md:w-5 md:h-5" />
          Clean Signal
        </button>
        <button
          onClick={() => handleNoiseChange(1)}
          className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base ${
            noiseLevel === 1
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
          Mild Noise
        </button>
        <button
          onClick={() => handleNoiseChange(2)}
          className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base ${
            noiseLevel === 2
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
          Heavy Noise
        </button>
      </div>

      <div className="relative w-full h-48 md:h-64 bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex items-center">
          {data.map((point) => (
            <div key={point.id} className="flex-1 h-full flex items-center justify-center">
              <div
                className={`w-1 md:w-2 rounded-full transition-all duration-300 ${
                  point.isNoise
                    ? "bg-red-400 dark:bg-red-500"
                    : "bg-emerald-400 dark:bg-emerald-500"
                }`}
                style={{ height: `${point.value}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center px-4">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center gap-2 justify-center">
          <Zap className="w-5 h-5 text-yellow-500" />
          {noiseLevel === 0
            ? "Clean data helps AI make accurate predictions!"
            : noiseLevel === 1
            ? "Some noise makes learning challenging but still possible."
            : "Excessive noise can lead to incorrect pattern recognition!"}
        </p>
      </div>
    </div>
  );
};

export default NoiseVisualizer;