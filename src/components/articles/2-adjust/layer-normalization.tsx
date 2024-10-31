"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sparkles, Sigma } from 'lucide-react';

const LayerNormViz = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [neurons, setNeurons] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate initial neuron data
  const generateNeurons = useCallback(() => {
    const newNeurons = Array(24).fill(0).map((_, i) => ({
      id: i,
      value: Math.random() * 2 - 1,
      x: (i % 6) * 100 + 50,
      y: Math.floor(i / 6) * 100 + 50,
      hue: Math.random() * 360
    }));
    setNeurons(newNeurons);
  }, []);

  // Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  // Normalize values
  const normalize = useCallback((values) => {
    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return values.map(v => (v - mean) / (stdDev + 1e-5));
  }, []);

  useEffect(() => {
    generateNeurons();
  }, [generateNeurons]);

  useEffect(() => {
    let animationFrame;
    if (isPlaying && progress < 100) {
      animationFrame = requestAnimationFrame(() => {
        setProgress(prev => Math.min(prev + 0.5, 100));
      });
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, progress]);

  const normalizedValues = normalize(neurons.map(n => n.value));

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 text-white flex items-center justify-center gap-3">
          <Brain className="text-blue-400" />
          Layer Normalization
          <Sparkles className="text-yellow-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Bringing harmony to neural networks, one layer at a time
        </p>
      </div>

      <div 
        className="relative h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-inner mb-6"
        onMouseMove={handleMouseMove}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* Neural network visualization */}
        <div className="absolute inset-0">
          {neurons.map((neuron, i) => {
            const normalizedValue = normalizedValues[i];
            const interpolatedValue = neuron.value * (1 - progress/100) + normalizedValue * (progress/100);
            const distance = Math.hypot(mousePos.x - neuron.x, mousePos.y - neuron.y);
            const interaction = Math.max(0, 1 - distance / 200);
            
            return (
              <div
                key={neuron.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: neuron.x,
                  top: neuron.y,
                }}
              >
                {/* Neuron glow effect */}
                <div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{
                    backgroundColor: `hsla(${neuron.hue}, 70%, 50%, ${0.3 + interaction * 0.4})`,
                    width: `${40 + Math.abs(interpolatedValue) * 20 + interaction * 30}px`,
                    height: `${40 + Math.abs(interpolatedValue) * 20 + interaction * 30}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                
                {/* Neuron core */}
                <div
                  className="rounded-full border-2 transition-all duration-300"
                  style={{
                    backgroundColor: `hsla(${neuron.hue}, 70%, ${45 + interpolatedValue * 20}%, ${0.8 + interaction * 0.2})`,
                    borderColor: `hsla(${neuron.hue}, 70%, 60%, ${0.8 + interaction * 0.2})`,
                    width: `${20 + Math.abs(interpolatedValue) * 10}px`,
                    height: `${20 + Math.abs(interpolatedValue) * 10}px`,
                    transform: `scale(${1 + interaction * 0.3})`,
                    boxShadow: `0 0 20px hsla(${neuron.hue}, 70%, 50%, ${0.5 + interaction * 0.3})`,
                  }}
                />

                {/* Value indicator */}
                <div 
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs font-mono"
                  style={{
                    color: `hsla(${neuron.hue}, 70%, 80%, ${0.6 + interaction * 0.4})`,
                  }}
                >
                  {interpolatedValue.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Normalization progress indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <Sigma className="text-blue-400" />
          <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-center text-gray-300">
        <p className="mb-4">
          {progress === 0 && "Click anywhere to start the normalization process"}
          {progress > 0 && progress < 100 && "Normalizing layer values..."}
          {progress === 100 && "Layer normalized! Values now have zero mean and unit variance"}
        </p>
        <button
          onClick={() => {
            generateNeurons();
            setProgress(0);
            setIsPlaying(false);
          }}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
        >
          Generate New Layer
        </button>
      </div>
    </div>
  );
};

export default LayerNormViz;