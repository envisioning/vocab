"use client"
import { useState, useEffect } from "react";
import { Brain, Paintbrush, Camera, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

interface ComponentProps {}

type Stage = "encode" | "latent" | "decode";
type Feature = { id: number; x: number; y: number; label: string };

const FEATURES: Feature[] = [
  { id: 1, x: 30, y: 30, label: "Eyes" },
  { id: 2, x: 50, y: 50, label: "Smile" },
  { id: 3, x: 70, y: 40, label: "Hair" },
  { id: 4, x: 40, y: 60, label: "Shape" },
];

const VAELearningComponent: React.FC<ComponentProps> = () => {
  const [stage, setStage] = useState<Stage>("encode");
  const [variation, setVariation] = useState<number>(50);
  const [features, setFeatures] = useState<Feature[]>(FEATURES);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev === "encode") return "latent";
        if (prev === "latent") return "decode";
        return "encode";
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  useEffect(() => {
    if (stage === "latent") {
      const animation = setInterval(() => {
        setFeatures((prev) =>
          prev.map((feature) => ({
            ...feature,
            x: feature.x + (Math.random() - 0.5) * 2,
            y: feature.y + (Math.random() - 0.5) * 2,
          }))
        );
      }, 100);

      return () => clearInterval(animation);
    }
  }, [stage]);

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariation(Number(e.target.value));
  };

  const handleReset = () => {
    setStage("encode");
    setFeatures(FEATURES);
    setVariation(50);
    setIsAnimating(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Brain className="text-blue-500" /> Memory Painter
      </h1>

      <div className="relative h-80 bg-white rounded-lg border-2 border-gray-200 mb-4">
        <div className="absolute top-4 left-4 flex gap-4">
          {stage === "encode" && <Camera className="text-blue-500 animate-pulse" />}
          {stage === "latent" && <Sparkles className="text-blue-500 animate-pulse" />}
          {stage === "decode" && <Paintbrush className="text-blue-500 animate-pulse" />}
        </div>

        <div className="h-full flex items-center justify-center">
          {stage === "encode" && (
            <div className="text-center">
              <ImageIcon className="w-32 h-32 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Memorizing features...</p>
            </div>
          )}

          {stage === "latent" && (
            <div className="relative w-full h-full">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 p-2 rounded-full"
                  style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
                >
                  {feature.label}
                </div>
              ))}
            </div>
          )}

          {stage === "decode" && (
            <div className="text-center">
              <ImageIcon className="w-32 h-32 mx-auto text-green-500" />
              <p className="mt-2 text-gray-600">Creating variations...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="variation" className="text-gray-700">
          Variation Level:
        </label>
        <input
          type="range"
          id="variation"
          min="0"
          max="100"
          value={variation}
          onChange={handleVariationChange}
          className="w-full"
          aria-label="Adjust variation level"
        />
      </div>

      <button
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        aria-label="Reset demonstration"
      >
        <RefreshCw className="w-4 h-4" /> Reset
      </button>
    </div>
  );
};

export default VAELearningComponent;