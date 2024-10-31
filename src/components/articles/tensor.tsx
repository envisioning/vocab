"use client";
import { useState, useEffect } from "react";
import {
  ChevronsUp,
  ChevronsDown,
  Box,
  Info,
  Brain,
  Boxes,
  Grid3X3,
} from "lucide-react";

interface TensorDimension {
  rows: number;
  cols: number;
  depth: number;
}

const INITIAL_DIMENSION: TensorDimension = {
  rows: 2,
  cols: 2,
  depth: 2,
};

export default function EnhancedTensorVisualizer() {
  const [dimension, setDimension] =
    useState<TensorDimension>(INITIAL_DIMENSION);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<string>("");

  useEffect(() => {
    if (!isRotating) return;
    const rotationInterval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(rotationInterval);
  }, [isRotating]);

  const handleDimensionChange = (
    type: keyof TensorDimension,
    increment: boolean
  ) => {
    setDimension((prev) => ({
      ...prev,
      [type]: increment
        ? Math.min(prev[type] + 1, 4)
        : Math.max(prev[type] - 1, 1),
    }));
  };

  const renderCubes = () => {
    const cubes = [];
    for (let z = 0; z < dimension.depth; z++) {
      for (let y = 0; y < dimension.rows; y++) {
        for (let x = 0; x < dimension.cols; x++) {
          cubes.push(
            <div
              key={`${x}-${y}-${z}`}
              className="absolute w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-500/40 
                       border border-blue-300 backdrop-blur-sm transform transition-all duration-300
                       hover:from-blue-300/60 hover:to-purple-400/60 hover:scale-105"
              style={{
                transform: `translate3d(${x * 50}px, ${y * 50}px, ${z * 50}px)`,
              }}
            />
          );
        }
      }
    }
    return cubes;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
                    text-white p-8 flex flex-col items-center justify-center"
    >
      <div className="flex items-center gap-4 mb-8">
        <Brain className="w-10 h-10 text-blue-400" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Tensor Visualization
        </h1>
      </div>

      <div className="relative group mb-4">
        <p className="text-gray-300 text-center max-w-md">
          Tensors are multi-dimensional arrays used in neural networks to
          represent data and parameters
          <Info
            className="inline-block ml-2 w-4 h-4 text-blue-400 cursor-help"
            onMouseEnter={() => setActiveTooltip("info")}
            onMouseLeave={() => setActiveTooltip("")}
          />
        </p>
        {activeTooltip === "info" && (
          <div
            className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 
                         p-4 rounded-lg shadow-xl border border-blue-500/30 w-64 text-sm"
          >
            Think of tensors as containers that can hold numbers in multiple
            dimensions, like a 3D cube of data points essential for AI
            computations.
          </div>
        )}
      </div>

      <div className="relative w-96 h-96 perspective-1000 mb-8 group">
        <div
          className="relative transform-style-3d"
          style={{ transform: `rotateY(${rotation}deg) rotateX(20deg)` }}
        >
          {renderCubes()}
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      <div className="flex gap-8 mb-8 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm">
        {[
          {
            label: "Width",
            key: "cols",
            icon: <Grid3X3 className="w-4 h-4" />,
          },
          {
            label: "Height",
            key: "rows",
            icon: <Grid3X3 className="w-4 h-4 rotate-90" />,
          },
          { label: "Depth", key: "depth", icon: <Boxes className="w-4 h-4" /> },
        ].map(({ label, key, icon }) => (
          <div key={key} className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-sm mb-2 text-blue-300">
              {icon}
              <span>{label}</span>
            </div>
            <button
              onClick={() =>
                handleDimensionChange(key as keyof TensorDimension, true)
              }
              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-t-lg 
                       transition-colors duration-300 border-t border-x border-blue-400/30"
            >
              <ChevronsUp size={20} />
            </button>
            <span className="py-2 font-mono text-lg text-blue-400">
              {dimension[key as keyof TensorDimension]}
            </span>
            <button
              onClick={() =>
                handleDimensionChange(key as keyof TensorDimension, false)
              }
              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-b-lg 
                       transition-colors duration-300 border-b border-x border-blue-400/30"
            >
              <ChevronsDown size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsRotating(!isRotating)}
        className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg 
                 transition-all duration-300 flex items-center gap-2 border border-blue-400/30
                 hover:scale-105"
      >
        <Box size={20} />
        {isRotating ? "Pause Rotation" : "Resume Rotation"}
      </button>
    </div>
  );
}
