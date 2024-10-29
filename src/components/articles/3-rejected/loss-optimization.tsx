"use client"
import { useState, useEffect } from "react";
import { Mountain, Thermometer, Play, Pause, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ComponentProps {}

type Optimizer = "gradient" | "momentum" | "adam";
type Landscape = "smooth" | "rough" | "valley";

interface ClimberPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * LossLandscapeExplorer: An interactive component for teaching loss optimization
 * to 15-18 year old students through visual metaphors and simulations.
 */
const LossLandscapeExplorer: React.FC<ComponentProps> = () => {
  const [optimizer, setOptimizer] = useState<Optimizer>("gradient");
  const [landscape, setLandscape] = useState<Landscape>("smooth");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [climberPosition, setClimberPosition] = useState<ClimberPosition>({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (isPlaying) {
        setClimberPosition((prev) => ({
          x: prev.x + Math.random() * 0.1 - 0.05,
          y: prev.y + Math.random() * 0.1 - 0.05,
          z: calculateHeight(prev.x, prev.y),
        }));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying]);

  const calculateHeight = (x: number, y: number): number => {
    switch (landscape) {
      case "smooth":
        return -Math.pow(x, 2) - Math.pow(y, 2) + 10;
      case "rough":
        return Math.sin(x * 3) * Math.cos(y * 3) + 10;
      case "valley":
        return Math.abs(x) + Math.abs(y);
      default:
        return 0;
    }
  };

  const handleOptimizerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptimizer(e.target.value as Optimizer);
  };

  const handleLandscapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLandscape(e.target.value as Landscape);
    resetClimber();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetClimber = () => {
    setClimberPosition({ x: 0, y: 0, z: calculateHeight(0, 0) });
    setIsPlaying(false);
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + (direction === "in" ? 0.1 : -0.1))));
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Loss Landscape Explorer</h2>
      <div className="flex space-x-4 mb-4">
        <select
          value={optimizer}
          onChange={handleOptimizerChange}
          className="bg-white border border-gray-300 rounded px-3 py-2"
        >
          <option value="gradient">Gradient Descent</option>
          <option value="momentum">Momentum</option>
          <option value="adam">Adam</option>
        </select>
        <select
          value={landscape}
          onChange={handleLandscapeChange}
          className="bg-white border border-gray-300 rounded px-3 py-2"
        >
          <option value="smooth">Smooth Landscape</option>
          <option value="rough">Rough Landscape</option>
          <option value="valley">Valley Landscape</option>
        </select>
      </div>
      <div className="relative h-80 bg-blue-100 rounded overflow-hidden" style={{ transform: `scale(${zoom})` }}>
        <div
          className="absolute w-4 h-4 bg-red-500 rounded-full transition-all duration-300"
          style={{
            left: `${(climberPosition.x + 5) * 10}%`,
            top: `${(climberPosition.y + 5) * 10}%`,
            transform: `translateZ(${climberPosition.z * 5}px)`,
          }}
          aria-label="Optimizer position"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={togglePlay}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={isPlaying ? "Pause simulation" : "Start simulation"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetClimber}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          aria-label="Reset simulation"
        >
          <RotateCcw size={24} />
        </button>
        <div>
          <button
            onClick={() => handleZoom("in")}
            className="bg-green-500 text-white px-4 py-2 rounded-l hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Zoom in"
          >
            <ZoomIn size={24} />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Zoom out"
          >
            <ZoomOut size={24} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center">
          <Mountain className="text-blue-500 mr-2" />
          <span>Mountain Climber Metaphor</span>
        </div>
        <div className="flex items-center">
          <Thermometer className="text-red-500 mr-2" />
          <span>Thermostat Metaphor</span>
        </div>
      </div>
    </div>
  );
};

export default LossLandscapeExplorer;