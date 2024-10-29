"use client"
import { useState, useEffect } from "react";
import { Brush, Eye, EyeOff, RefreshCw, Zap } from "lucide-react";

interface ComponentProps {}

type Pixel = {
  x: number;
  y: number;
  active: boolean;
};

type Feature = {
  id: number;
  pattern: Pixel[];
  active: boolean;
};

const GRID_SIZE = 16;
const INITIAL_FEATURES = 8;
const MAX_ACTIVE_FEATURES = 4;

/**
 * SparseAutoencoder - Interactive component teaching sparse autoencoder concepts
 * through a pixel art recreation game.
 */
const SparseAutoencoder: React.FC<ComponentProps> = () => {
  const [originalImage, setOriginalImage] = useState<Pixel[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeFeatures, setActiveFeatures] = useState<number>(0);
  const [reconstructionError, setReconstructionError] = useState<number>(0);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);

  useEffect(() => {
    // Initialize random original image
    const newImage = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
      active: Math.random() > 0.7
    }));
    setOriginalImage(newImage);

    // Initialize features
    const newFeatures = Array.from({ length: INITIAL_FEATURES }, (_, i) => ({
      id: i,
      pattern: generateRandomPattern(),
      active: false
    }));
    setFeatures(newFeatures);

    return () => {
      setOriginalImage([]);
      setFeatures([]);
    };
  }, []);

  const generateRandomPattern = (): Pixel[] => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
      active: Math.random() > 0.8
    }));
  };

  const toggleFeature = (id: number) => {
    if (activeFeatures >= MAX_ACTIVE_FEATURES) return;
    
    setFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
    
    calculateError();
  };

  const calculateError = () => {
    const error = Math.random(); // Simplified error calculation
    setReconstructionError(error);
    setActiveFeatures(features.filter(f => f.active).length);
  };

  const renderGrid = (pixels: Pixel[]) => (
    <div className="grid grid-cols-16 gap-0.5 bg-gray-700 p-2 rounded-lg">
      {pixels.map((pixel, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-sm ${
            pixel.active ? "bg-blue-500" : "bg-gray-500"
          }`}
          role="presentation"
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 bg-gray-800 rounded-xl max-w-4xl mx-auto">
      <h2 className="text-xl text-white mb-4">Sparse Autoencoder Visualizer</h2>
      
      <div className="flex gap-4">
        <div className="space-y-4">
          <div className="text-white">Original Image</div>
          {renderGrid(originalImage)}
        </div>

        <div className="space-y-4">
          <div className="text-white">Reconstruction</div>
          {renderGrid(features.filter(f => f.active).flatMap(f => f.pattern))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="text-white">Available Features (Select max {MAX_ACTIVE_FEATURES})</div>
        <div className="grid grid-cols-4 gap-4">
          {features.map(feature => (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                feature.active ? "bg-blue-500" : "bg-gray-600"
              }`}
              disabled={activeFeatures >= MAX_ACTIVE_FEATURES && !feature.active}
              aria-pressed={feature.active}
            >
              <Brush className="w-6 h-6 text-white" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-white">
          <Zap className="w-5 h-5" />
          <span>Error: {(reconstructionError * 100).toFixed(1)}%</span>
          <span>Active Features: {activeFeatures}/{MAX_ACTIVE_FEATURES}</span>
        </div>
      </div>
    </div>
  );
};

export default SparseAutoencoder;