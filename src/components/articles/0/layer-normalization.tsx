"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sparkles, Sigma } from 'lucide-react';

interface Neuron {
  id: number;
  value: number;
  x: number;
  y: number;
  hue: number;
}

const LayerNormViz: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    
    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate initial neuron data
  const generateNeurons = useCallback(() => {
    const newNeurons: Neuron[] = Array(24).fill(0).map((_, i) => ({
      id: i,
      value: Math.random() * 2 - 1,
      x: (i % 6) * (window.innerWidth < 640 ? 40 : 70) + (window.innerWidth < 640 ? 30 : 50),  // Responsive spacing
      y: Math.floor(i / 6) * (window.innerWidth < 640 ? 40 : 70) + (window.innerWidth < 640 ? 30 : 50), // Responsive spacing
      hue: Math.random() * 360
    }));
    setNeurons(newNeurons);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const normalize = useCallback((values: number[]): number[] => {
    const mean = values.reduce((acc: number, v: number) => acc + v, 0) / values.length;
    const variance = values.reduce((acc: number, v: number) => acc + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return values.map((v: number) => (v - mean) / (stdDev + 1e-5));
  }, []);

  useEffect(() => {
    generateNeurons();
  }, [generateNeurons]);

  useEffect(() => {
    let animationFrame: number | undefined;
    if (isPlaying && progress < 100) {
      animationFrame = window.requestAnimationFrame(() => {
        setProgress(prev => Math.min(prev + 0.5, 100));
      });
    }
    return () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, progress]);

  const normalizedValues = normalize(neurons.map(n => n.value));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white flex items-center justify-center gap-2 sm:gap-3">
          <Brain className="text-blue-600 dark:text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
          Layer Normalization
          <Sparkles className="text-yellow-600 dark:text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
        </h2>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
          Bringing harmony to neural networks, one layer at a time
        </p>
      </div>

      <div 
        className="relative h-[400px] sm:h-[500px] bg-gray-50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-inner mb-4 sm:mb-6"
        onMouseMove={handleMouseMove}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <div className="absolute inset-0 flex items-center justify-center -mt-12 sm:-mt-16">
          <div className="relative w-[300px] h-[240px] sm:w-[500px] sm:h-[360px] flex items-center justify-center">
            <div className="relative w-[240px] h-[180px] sm:w-[420px] sm:h-[280px]">
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
                    top: neuron.y
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-md sm:blur-xl"
                    style={{
                      backgroundColor: `hsla(${neuron.hue}, 70%, 50%, ${0.3 + interaction * 0.4})`,
                      width: window.innerWidth < 640 
                        ? `${16 + Math.abs(interpolatedValue) * 8 + interaction * 12}px`
                        : `${32 + Math.abs(interpolatedValue) * 16 + interaction * 24}px`,
                      height: window.innerWidth < 640 
                        ? `${16 + Math.abs(interpolatedValue) * 8 + interaction * 12}px`
                        : `${32 + Math.abs(interpolatedValue) * 16 + interaction * 24}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  
                  <div
                    className="rounded-full border sm:border-2 transition-all duration-300"
                    style={{
                      backgroundColor: `hsla(${neuron.hue}, 70%, ${45 + interpolatedValue * 20}%, ${0.8 + interaction * 0.2})`,
                      borderColor: `hsla(${neuron.hue}, 70%, 60%, ${0.8 + interaction * 0.2})`,
                      width: window.innerWidth < 640 
                        ? `${8 + Math.abs(interpolatedValue) * 4}px`
                        : `${16 + Math.abs(interpolatedValue) * 8}px`,
                      height: window.innerWidth < 640 
                        ? `${8 + Math.abs(interpolatedValue) * 4}px`
                        : `${16 + Math.abs(interpolatedValue) * 8}px`,
                      transform: `scale(${1 + interaction * 0.3})`,
                      boxShadow: window.innerWidth < 640 
                        ? `0 0 10px hsla(${neuron.hue}, 70%, 50%, ${0.5 + interaction * 0.3})`
                        : `0 0 20px hsla(${neuron.hue}, 70%, 50%, ${0.5 + interaction * 0.3})`
                    }}
                  />

                  <div 
                    className="absolute top-full mt-1 sm:mt-2 left-1/2 transform -translate-x-1/2 text-[8px] sm:text-xs font-mono"
                    style={{
                      color: `hsla(${neuron.hue}, 70%, ${theme === 'dark' ? 80 : 40}%, ${0.6 + interaction * 0.4})`
                    }}
                  >
                    {interpolatedValue.toFixed(2)}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <Sigma className="text-blue-600 dark:text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
          <div className="w-24 sm:w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-300">
        <p className="mb-3 sm:mb-4">
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
          className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-800 dark:text-white transition-colors text-sm sm:text-base mb-4"
        >
          Generate New Layer
        </button>
        <div className="mt-6 text-sm sm:text-base max-w-2xl mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400">
            Layer Normalization adjusts the scale of activations within each layer of a neural network. Above, watch as 
            varied neuron values (in color) are transformed to have zero mean and unit variance — a key technique that helps 
            stabilize and accelerate neural network training, especially in transformers and deep networks.
          </p>
          <div className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
            <span className="text-blue-600 dark:text-blue-400">Key insight:</span> When a neuron becomes very 
            different from others (brighter/larger), normalization adjusts all neurons proportionally. The brightest neuron represents 
            the most "standard deviations away from mean" in the normalized space, while maintaining the relative patterns 
            in the data.
          </div>
          <div className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            Try clicking different areas to see how the normalization process affects the entire layer as a group, not just individual neurons!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerNormViz;