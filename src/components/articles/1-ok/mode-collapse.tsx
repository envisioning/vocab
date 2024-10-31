"use client";

import React, { useState, useEffect } from 'react';
import { Ghost, Pencil, RefreshCw, Play, Pause, Sparkles } from 'lucide-react';

const ModeCollapseDemo = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [iteration, setIteration] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [hover, setHover] = useState(null);

  const GRID_ROWS = 10;
  const GRID_COLS = 20;

  // Define our "real" data distribution types
  const ghostTypes = [
    { color: 'text-blue-400', transform: 'rotate-0', float: 'animate-float-1' },
    { color: 'text-green-400', transform: 'rotate-12', float: 'animate-float-2' },
    { color: 'text-purple-400', transform: '-rotate-12', float: 'animate-float-3' },
    { color: 'text-red-400', transform: 'scale-110', float: 'animate-float-4' },
    { color: 'text-yellow-400', transform: 'scale-90', float: 'animate-float-5' },
  ];

  // Initialize grid following real distribution
  const initializeGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        // Distribute types evenly initially
        const section = Math.floor((col / GRID_COLS) * ghostTypes.length);
        grid.push({
          type: section,
          row,
          col,
          initialType: section, // Keep track of initial type for smooth transition
        });
      }
    }
    return grid;
  };

  const [generatedGhosts, setGeneratedGhosts] = useState(initializeGrid());

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setIteration(prev => {
          const next = prev + 1;
          if (next > 100) {
            setCollapsed(true);
          }
          return next;
        });

        // Update ghost distribution
        setGeneratedGhosts(prevGhosts => 
          prevGhosts.map(ghost => {
            if (iteration > 100) {
              return { ...ghost, type: 0 }; // Complete collapse to blue
            } else {
              const collapseChance = iteration / 100;
              const shouldCollapse = Math.random() < collapseChance;
              return {
                ...ghost,
                type: shouldCollapse ? 0 : ghost.initialType,
              };
            }
          })
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, iteration]);

  const handleReset = () => {
    setIteration(0);
    setCollapsed(false);
    setGeneratedGhosts(initializeGrid());
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Mode Collapse in GANs
        </h2>
        <p className="text-gray-600">Watch how the generated distribution gradually collapses from diverse modes to a single mode!</p>
      </div>

      <div className="mb-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
            >
              <RefreshCw size={24} className={isPlaying && iteration < 100 ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-100"
              style={{ 
                width: `${iteration}%`,
                boxShadow: isPlaying ? '0 0 8px rgba(147, 51, 234, 0.5)' : 'none',
              }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white opacity-30" />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Start</span>
            <span>Training Progress</span>
            <span>Mode Collapse</span>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-sm">
          {/* Real Distribution */}
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <Pencil className="inline-block mr-2" size={16} />
            Real Data Distribution
            <Sparkles className="ml-2 text-yellow-400" size={16} />
          </div>
          
          <div className="flex justify-around mb-12">
            {ghostTypes.map((ghost, index) => (
              <div
                key={`real-${index}`}
                className={`transform ${ghost.transform} ${ghost.float} transition-all duration-500`}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
              >
                <Ghost 
                  className={`w-12 h-12 ${ghost.color} transition-all duration-300 ${
                    hover === index ? 'scale-125' : ''
                  }`} 
                />
                {hover === index && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
                    Mode {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Generated Distribution */}
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <Ghost className="inline-block mr-2" size={16} />
            Generated Distribution
          </div>
          
          <div className="grid gap-1 bg-gray-50 p-4 rounded-lg" 
               style={{ 
                 gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                 gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`
               }}>
            {generatedGhosts.map((ghost, index) => (
              <div
                key={`gen-${index}`}
                className="flex items-center justify-center"
              >
                <Ghost 
                  className={`w-4 h-4 ${ghostTypes[ghost.type].color} transition-colors duration-500`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm">
        {collapsed ? (
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm">
            <p className="font-semibold text-yellow-700 mb-2 flex items-center">
              <Ghost className="inline-block mr-2" size={20} />
              Complete Mode Collapse Detected!
            </p>
            <p className="text-yellow-600">
              The generator has completely collapsed to producing only blue ghosts, 
              losing all the diversity present in the original distribution. 
              This visualization shows how mode collapse reduces the richness of generated data.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-center italic">
            Observe how the generated distribution gradually loses its diversity... 👻
          </p>
        )}
      </div>
    </div>
  );
};

// Add these styles to your global CSS file
const styles = `
  @keyframes float-1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  @keyframes float-2 {
    0%, 100% { transform: translateY(0px) rotate(12deg); }
    50% { transform: translateY(-15px) rotate(17deg); }
  }

  @keyframes float-3 {
    0%, 100% { transform: translateY(0px) rotate(-12deg); }
    50% { transform: translateY(-12px) rotate(-7deg); }
  }

  @keyframes float-4 {
    0%, 100% { transform: translateY(0px) scale(1.1); }
    50% { transform: translateY(-8px) scale(1.1); }
  }

  @keyframes float-5 {
    0%, 100% { transform: translateY(0px) scale(0.9); }
    50% { transform: translateY(-14px) scale(0.9); }
  }

  .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
  .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
  .animate-float-3 { animation: float-3 2.8s ease-in-out infinite; }
  .animate-float-4 { animation: float-4 3.2s ease-in-out infinite; }
  .animate-float-5 { animation: float-5 3.7s ease-in-out infinite; }
`;

export default ModeCollapseDemo;