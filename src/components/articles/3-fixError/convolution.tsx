"use client"
import { useState, useEffect } from "react";
import { Square, ArrowRight, Sparkles, Info, Play, Pause } from "lucide-react";

interface ConvolutionProps {}

type KernelPosition = {
  x: number;
  y: number;
};

const ConvolutionVisualizer = ({}: ConvolutionProps) => {
  const [kernelPosition, setKernelPosition] = useState<KernelPosition>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const imageMatrix = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
  ];

  const kernel = [
    [1, 1, 1],
    [1, 2, 1],
    [1, 1, 1],
  ];

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setKernelPosition((prev) => {
          const newX = (prev.x + 1) % 2;
          const newY = newX === 0 ? (prev.y + 1) % 2 : prev.y;
          
          let sum = 0;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const imgValue = imageMatrix[prev.y + i]?.[prev.x + j] ?? 0;
              sum += imgValue * kernel[i][j];
            }
          }
          setResult((prev) => [...prev, sum]);
          return { x: newX, y: newY };
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Convolution Visualization ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Watch how the kernel slides over the input matrix, performing element-wise multiplication and summation at each step.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 items-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="relative group">
            <div className="absolute -top-8 left-0 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Info className="w-4 h-4" /> Input Matrix
            </div>
            <div className="grid grid-cols-4 gap-1">
              {imageMatrix.map((row, i) =>
                row.map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-lg transition-all duration-300
                      ${val ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}
                      ${i >= kernelPosition.y && i < kernelPosition.y + 3 && j >= kernelPosition.x && j < kernelPosition.x + 3
                        ? 'ring-2 ring-green-400 ring-offset-2 dark:ring-offset-gray-800'
                        : ''}
                    `}
                    onMouseEnter={() => setShowTooltip(`Position (${i},${j})`)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
            {isAnimating && (
              <div className="absolute transition-all duration-500 border-2 border-green-400 rounded-lg pointer-events-none"
                style={{
                  top: kernelPosition.y * 4.25 + 'rem',
                  left: kernelPosition.x * 4.25 + 'rem',
                  width: '12rem',
                  height: '12rem',
                }}>
                <Sparkles className="absolute -top-6 -right-6 text-green-400 animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-300">convolve with</span>
          </div>

          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Info className="w-4 h-4" /> Kernel
            </div>
            <div className="grid grid-cols-3 gap-1">
              {kernel.map((row, i) =>
                row.map((val, j) => (
                  <div
                    key={`kernel-${i}-${j}`}
                    className="w-10 md:w-12 h-10 md:h-12 bg-blue-400 dark:bg-blue-600 flex items-center justify-center text-white rounded-lg"
                  >
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-300">results in</span>
          </div>

          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Info className="w-4 h-4" /> Output
            </div>
            <div className="flex flex-col gap-2">
              {result.map((val, i) => (
                <div
                  key={`result-${i}`}
                  className="w-12 md:w-16 h-12 md:h-16 bg-green-500 dark:bg-green-600 flex items-center justify-center text-white rounded-lg animate-fadeIn"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="mx-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2 shadow-lg"
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Pause' : 'Start'} Animation
        </button>
      </div>
      
      {showTooltip && (
        <div className="fixed bg-black text-white px-2 py-1 rounded text-sm pointer-events-none">
          {showTooltip}
        </div>
      )}
    </div>
  );
};

export default ConvolutionVisualizer;