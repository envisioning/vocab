"use client"
import { useState, useEffect } from "react";
import { Waveform, Music, ArrowRight, RefreshCw } from "lucide-react";

interface WaveData {
  values: number[];
  mean: number;
  variance: number;
}

interface LayerProps {}

const INITIAL_WAVE_DATA: WaveData[] = [
  { values: [2, 8, 4, 6, 1, 9], mean: 5, variance: 8.5 },
  { values: [5, 1, 7, 3, 8, 2], mean: 4.3, variance: 7.2 },
  { values: [9, 3, 5, 7, 4, 6], mean: 5.7, variance: 4.1 }
];

const LayerNormalization: React.FC<LayerProps> = () => {
  const [waveLayers, setWaveLayers] = useState<WaveData[]>(INITIAL_WAVE_DATA);
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let animationFrame: number;
    if (isAnimating) {
      const animate = () => {
        setWaveLayers(prev => prev.map((layer, idx) => {
          if (idx === selectedLayer) {
            const newValues = normalizeValues(layer.values);
            return {
              values: newValues,
              mean: calculateMean(newValues),
              variance: calculateVariance(newValues)
            };
          }
          return layer;
        }));
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimating, selectedLayer]);

  const normalizeValues = (values: number[]): number[] => {
    const mean = calculateMean(values);
    const variance = calculateVariance(values);
    return values.map(v => (v - mean) / Math.sqrt(variance + 1e-5));
  };

  const calculateMean = (values: number[]): number => 
    values.reduce((a, b) => a + b, 0) / values.length;

  const calculateVariance = (values: number[]): number => {
    const mean = calculateMean(values);
    return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  };

  const handleSliderChange = (layerIndex: number, valueIndex: number, newValue: number) => {
    setWaveLayers(prev => prev.map((layer, idx) => 
      idx === layerIndex ? {
        ...layer,
        values: layer.values.map((v, i) => i === valueIndex ? newValue : v),
        mean: calculateMean(layer.values),
        variance: calculateVariance(layer.values)
      } : layer
    ));
  };

  const handleNormalize = (layerIndex: number) => {
    setSelectedLayer(layerIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Music className="w-6 h-6" /> Layer Normalization Studio
      </h2>

      {waveLayers.map((layer, layerIndex) => (
        <div key={layerIndex} className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Waveform className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Layer {layerIndex + 1}</h3>
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Mean: {layer.mean.toFixed(2)} | Variance: {layer.variance.toFixed(2)}
              </span>
              <button
                onClick={() => handleNormalize(layerIndex)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex items-center gap-2"
                aria-label={`Normalize Layer ${layerIndex + 1}`}
              >
                <RefreshCw className="w-4 h-4" />
                Normalize
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {layer.values.map((value, valueIndex) => (
              <div key={valueIndex} className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={value}
                  onChange={(e) => handleSliderChange(layerIndex, valueIndex, Number(e.target.value))}
                  className="w-full"
                  aria-label={`Adjust feature ${valueIndex + 1} in layer ${layerIndex + 1}`}
                />
                <span className="text-center text-sm text-gray-600">{value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerNormalization;