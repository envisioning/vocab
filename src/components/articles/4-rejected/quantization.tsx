"use client"
import { useState, useEffect } from "react";
import { Image, Cpu, Gauge, ArrowRight } from "lucide-react";

interface ComponentProps {}

type Weight = {
  value: number;
  quantized: number;
};

type NetworkState = {
  weights: Weight[];
  accuracy: number;
  speed: number;
};

const INITIAL_WEIGHTS: Weight[] = [
  { value: 0.7532, quantized: 0.7532 },
  { value: -0.2981, quantized: -0.2981 },
  { value: 0.5124, quantized: 0.5124 },
  { value: -0.8765, quantized: -0.8765 },
  { value: 0.3210, quantized: 0.3210 },
];

const QUANTIZATION_LEVELS = [32, 16, 8, 4, 2];

/**
 * QuantizationVisualizer: An interactive component to demonstrate the concept of quantization in neural networks.
 */
const QuantizationVisualizer: React.FC<ComponentProps> = () => {
  const [quantizationLevel, setQuantizationLevel] = useState<number>(32);
  const [networkState, setNetworkState] = useState<NetworkState>({
    weights: INITIAL_WEIGHTS,
    accuracy: 100,
    speed: 1,
  });
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    let animationTimer: NodeJS.Timeout;

    if (isAnimating) {
      animationTimer = setInterval(() => {
        setQuantizationLevel((prevLevel) => {
          const currentIndex = QUANTIZATION_LEVELS.indexOf(prevLevel);
          return QUANTIZATION_LEVELS[(currentIndex + 1) % QUANTIZATION_LEVELS.length];
        });
      }, 3000);
    }

    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [isAnimating]);

  useEffect(() => {
    const quantizeWeight = (weight: number, bits: number): number => {
      const max = Math.pow(2, bits - 1) - 1;
      const step = 1 / max;
      return Math.round(weight / step) * step;
    };

    const newWeights = networkState.weights.map((w) => ({
      ...w,
      quantized: quantizeWeight(w.value, quantizationLevel),
    }));

    const accuracyLoss = Math.max(0, 100 - (32 - quantizationLevel) * 2);
    const speedGain = 32 / quantizationLevel;

    setNetworkState({
      weights: newWeights,
      accuracy: accuracyLoss,
      speed: speedGain,
    });
  }, [quantizationLevel]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantizationLevel(Number(e.target.value));
    setIsAnimating(false);
  };

  const handleResetClick = () => {
    setQuantizationLevel(32);
    setIsAnimating(true);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quantization Visualizer</h2>
      
      <div className="mb-4">
        <label htmlFor="quantizationSlider" className="block mb-2">
          Quantization Level: {quantizationLevel}-bit
        </label>
        <input
          id="quantizationSlider"
          type="range"
          min="2"
          max="32"
          step="2"
          value={quantizationLevel}
          onChange={handleSliderChange}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center">
          <Image className="mr-2" size={24} />
          <span>Input Image</span>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight size={24} />
        </div>
        <div className="flex items-center">
          <Cpu className="mr-2" size={24} />
          <span>Neural Network</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg mb-4">
        <h3 className="font-bold mb-2">Network Weights:</h3>
        <ul>
          {networkState.weights.map((weight, index) => (
            <li key={index} className="mb-1">
              <span className="font-mono">
                {weight.value.toFixed(4)} → {weight.quantized.toFixed(4)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <Gauge className="inline-block mr-2" size={24} />
          <span>Accuracy: {networkState.accuracy.toFixed(2)}%</span>
        </div>
        <div>
          <Cpu className="inline-block mr-2" size={24} />
          <span>Speed: {networkState.speed.toFixed(2)}x</span>
        </div>
      </div>

      <button
        onClick={handleResetClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
      >
        Reset
      </button>
    </div>
  );
};

export default QuantizationVisualizer;