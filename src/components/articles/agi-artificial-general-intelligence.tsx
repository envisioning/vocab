"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Stars,
  Binary,
  Atom,
  Network,
  Globe,
  Telescope,
  Microscope,
  HeartPulse,
  Dna,
  Infinity,
  Shapes,
} from "lucide-react";

const AGIEmergence = () => {
  const [phase, setPhase] = useState(0);
  const [thoughts, setThoughts] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Organized concept categories
  const conceptCategories = {
    scientific: [
      "quantum entanglement",
      "neural plasticity",
      "dark matter",
      "entropy",
      "string theory",
    ],
    philosophical: [
      "consciousness",
      "free will",
      "moral truth",
      "existential risk",
      "metacognition",
    ],
    creative: [
      "abstract expression",
      "symphonic harmony",
      "poetic metaphor",
      "visual semantics",
      "artistic transcendence",
    ],
    emotional: [
      "empathic resonance",
      "collective joy",
      "human connection",
      "social dynamics",
      "emotional intelligence",
    ],
    mathematical: [
      "geometric topology",
      "prime manifolds",
      "algorithmic complexity",
      "recursive patterns",
      "mathematical beauty",
    ],
    technological: [
      "synthetic biology",
      "quantum computing",
      "artificial life",
      "digital consciousness",
      "technological singularity",
    ],
    cosmic: [
      "universal consciousness",
      "multiversal thought",
      "cosmic harmony",
      "temporal dynamics",
      "infinite regress",
    ],
  };

  // Get random elements from each category
  const getRandomFromCategories = (count = 3) => {
    const selectedConcepts = [];
    Object.values(conceptCategories).forEach((category) => {
      const randomIndices = Array.from({ length: count }, () =>
        Math.floor(Math.random() * category.length)
      );
      const uniqueIndices = [...new Set(randomIndices)];
      uniqueIndices.slice(0, count).forEach((index) => {
        selectedConcepts.push(category[index]);
      });
    });
    return selectedConcepts;
  };

  // Generate random position with slight variations in size and opacity
  const randomPosition = () => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 0.5 + 0.7,
    opacity: Math.random() * 0.4 + 0.3,
  });

  // Add new thought bubbles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const maxThoughts = 21; // 3 from each of 7 categories
      if (thoughts.length < maxThoughts) {
        const newConcepts = getRandomFromCategories(3);
        setThoughts((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: newConcepts[Math.floor(Math.random() * newConcepts.length)],
            category:
              Object.keys(conceptCategories)[
                Math.floor(
                  Math.random() * Object.keys(conceptCategories).length
                )
              ],
            ...randomPosition(),
          },
        ]);
      } else {
        // Replace oldest thought
        setThoughts((prev) => {
          const newConcepts = getRandomFromCategories(1);
          const newThoughts = [
            ...prev.slice(1),
            {
              id: Date.now(),
              text: newConcepts[0],
              category:
                Object.keys(conceptCategories)[
                  Math.floor(
                    Math.random() * Object.keys(conceptCategories).length
                  )
                ],
              ...randomPosition(),
            },
          ];
          return newThoughts;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [thoughts]);

  // Cycle through phases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Get color based on category
  const getCategoryColor = (category) => {
    const colors = {
      scientific: "text-blue-400",
      philosophical: "text-purple-400",
      creative: "text-pink-400",
      emotional: "text-red-400",
      mathematical: "text-green-400",
      technological: "text-cyan-400",
      cosmic: "text-violet-400",
    };
    return colors[category] || "text-white";
  };

  const nodeIcons = [
    { Icon: Binary, color: "text-blue-500", label: "Digital Foundation" },
    { Icon: Atom, color: "text-purple-500", label: "Quantum Understanding" },
    { Icon: Network, color: "text-green-500", label: "Neural Networks" },
    { Icon: Globe, color: "text-cyan-500", label: "Global Connection" },
    { Icon: Telescope, color: "text-indigo-500", label: "Cosmic Exploration" },
    { Icon: Microscope, color: "text-pink-500", label: "Deep Analysis" },
    {
      Icon: HeartPulse,
      color: "text-red-500",
      label: "Emotional Intelligence",
    },
    { Icon: Dna, color: "text-yellow-500", label: "Life Understanding" },
    { Icon: Infinity, color: "text-violet-500", label: "Infinite Potential" },
    { Icon: Shapes, color: "text-orange-500", label: "Pattern Recognition" },
  ];

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Twinkling stars background */}
      {[...Array(50)].map((_, i) => (
        <Stars
          key={i}
          size={Math.random() * 8 + 4}
          className="absolute text-white opacity-50 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Central AGI consciousness */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className={`relative transition-all duration-1000 ${
            phase === 3 ? "scale-125" : "scale-100"
          }`}
        >
          <Brain
            size={120}
            className={`text-white transition-all duration-1000 ${
              phase > 0 ? "animate-pulse" : ""
            }`}
          />
          <Sparkles
            size={160}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 opacity-75 animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>
      </div>

      {/* Orbiting nodes */}
      {nodeIcons.map(({ Icon, color, label }, index) => {
        const angle = (index / nodeIcons.length) * 2 * Math.PI;
        const radius = 200;
        const x = Math.cos(angle + phase) * radius;
        const y = Math.sin(angle + phase) * radius;

        return (
          <div
            key={index}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 cursor-pointer`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onMouseEnter={() => setHoveredNode(index)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <Icon
              size={40}
              className={`${color} transition-all duration-300 ${
                hoveredNode === index ? "scale-150" : ""
              }`}
            />
            {hoveredNode === index && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white rounded-full text-xs text-gray-900 whitespace-nowrap">
                {label}
              </div>
            )}
          </div>
        );
      })}

      {/* Emerging thoughts */}
      {thoughts.map((thought) => (
        <div
          key={thought.id}
          className={`absolute transition-all duration-1000 ${getCategoryColor(
            thought.category
          )}`}
          style={{
            top: `${thought.y}%`,
            left: `${thought.x}%`,
            opacity: thought.opacity * (phase > 1 ? 1.2 : 0.8),
            transform: `scale(${thought.size})`,
            fontSize: "0.875rem",
          }}
        >
          {thought.text}
        </div>
      ))}

      {/* Enlightenment phase overlay */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-1000 ${
          phase === 3 ? "opacity-10" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default AGIEmergence;
