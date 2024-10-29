"use client"
import { useState, useEffect } from "react";
import { Grid, Divide, Image as ImageIcon, ZoomIn, ZoomOut, RefreshCw, Book } from "lucide-react";

interface PQVisualizerProps {}

type ColorSection = {
  id: number;
  originalColors: string[];
  quantizedColors: string[];
};

type Stage = "original" | "division" | "quantization" | "compression";

const INITIAL_COLORS = [
  "#FF0000", "#FF3333", "#FF6666", "#FF9999",
  "#00FF00", "#33FF33", "#66FF66", "#99FF99",
  "#0000FF", "#3333FF", "#6666FF", "#9999FF"
];

/**
 * PQVisualizer: An interactive component teaching Product Quantization
 * through color compression visualization
 */
const PQVisualizer: React.FC<PQVisualizerProps> = () => {
  const [stage, setStage] = useState<Stage>("original");
  const [sections, setSections] = useState<ColorSection[]>([]);
  const [divisions, setDivisions] = useState<number>(2);
  const [quantizationLevel, setQuantizationLevel] = useState<number>(4);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const timer = setInterval(() => {
      setStage(prev => {
        const stages: Stage[] = ["original", "division", "quantization", "compression"];
        const currentIndex = stages.indexOf(prev);
        return stages[(currentIndex + 1) % stages.length];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  useEffect(() => {
    const initialSections = Array.from({ length: divisions }, (_, i) => ({
      id: i,
      originalColors: INITIAL_COLORS.slice(i * 4, (i + 1) * 4),
      quantizedColors: [INITIAL_COLORS[i * 4]]
    }));
    setSections(initialSections);
  }, [divisions]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDivisions(Number(e.target.value));
  };

  const handleQuantizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantizationLevel(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Product Quantization Visualizer
      </h1>

      <div className="mb-6 flex gap-4 items-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label={isAnimating ? "Pause animation" : "Start animation"}
        >
          <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
          {isAnimating ? 'Pause' : 'Start'}
        </button>

        <div className="flex-1 space-y-2">
          <label className="block text-sm text-gray-600">
            Number of Divisions: {divisions}
          </label>
          <input
            type="range"
            min="2"
            max="4"
            value={divisions}
            onChange={handleDivisionChange}
            className="w-full"
            aria-label="Number of divisions"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Original Colors
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {INITIAL_COLORS.map((color, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: color }}
                  className="w-12 h-12 rounded"
                  aria-label={`Original color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Quantized Result
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {sections.map(section => (
                <div key={section.id} className="space-y-2">
                  {section.quantizedColors.map((color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color }}
                      className="w-12 h-12 rounded"
                      aria-label={`Quantized color ${color}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Learning Stage: {stage}
          </h2>
          <div className="space-y-4">
            {stage === "original" && (
              <p>Start with many different colors (high-dimensional data)</p>
            )}
            {stage === "division" && (
              <p>Break colors into groups (sub-vectors)</p>
            )}
            {stage === "quantization" && (
              <p>Replace similar colors with representative ones</p>
            )}
            {stage === "compression" && (
              <p>See how we saved space while keeping meaning</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PQVisualizer;