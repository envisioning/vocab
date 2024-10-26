"use client";

import React, { useState, useEffect } from "react";
import { BrainCircuit, CircuitBoard } from "lucide-react";

const OneToNSystem = () => {
  const [time, setTime] = useState(0);
  const numAgents = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev + 1) % 1000);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const getControllerPulse = () => {
    return (Math.sin(time * 0.1) + 1) / 2;
  };

  const getAgentPulse = (idx) => {
    return (Math.sin(time * 0.1 + idx * 0.4) + 1) / 2;
  };

  // Constants for positioning
  const CONTROLLER_SIZE = 80; // 20 * 4 (w-20 class)
  const AGENT_SIZE = 48; // 12 * 4 (w-12 class)
  const CONTROLLER_Y = 60;
  const AGENT_Y = 200;
  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 300;

  // Particle Component using SVG
  const ConnectionLine = ({ startX, startY, endX, endY }) => {
    const numParticles = 3;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const progress = (time * 0.02 + i * (1 / numParticles)) % 1;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      particles.push({ x, y, progress });
    }

    return (
      <g>
        <path
          d={`M ${startX} ${startY} L ${endX} ${endY}`}
          stroke="rgb(219 234 254)"
          strokeWidth="2"
          fill="none"
        />
        {particles.map((particle, i) => (
          <circle
            key={i}
            cx={particle.x}
            cy={particle.y}
            r="4"
            fill="rgb(59 130 246)"
            opacity={1 - particle.progress}
          />
        ))}
      </g>
    );
  };

  const controllerPulse = getControllerPulse();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">1-N System Architecture</h2>
        <p className="text-gray-600 mb-2">
          One controller simultaneously managing multiple agents
        </p>
        <p className="text-sm text-gray-500">
          Watch how signals flow continuously from controller to all agents
        </p>
      </div>

      <div className="relative h-80 mb-8">
        {/* SVG layer for connections */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {Array.from({ length: numAgents }).map((_, idx) => {
            const totalWidth = SVG_WIDTH * 0.6; // Use 60% of SVG width for agents
            const agentSpacing = totalWidth / (numAgents - 1);
            const centerX = SVG_WIDTH / 2;

            // Calculate exact center points
            const startX = centerX;
            const startY = CONTROLLER_Y + CONTROLLER_SIZE / 2;
            const endX = centerX - totalWidth / 2 + idx * agentSpacing;
            const endY = AGENT_Y + AGENT_SIZE / 2;

            return (
              <ConnectionLine
                key={idx}
                startX={startX}
                startY={startY}
                endX={endX}
                endY={endY}
              />
            );
          })}
        </svg>

        {/* Controller */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${CONTROLLER_Y}px` }}
        >
          <div
            className="relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 transition-all duration-300"
            style={{
              transform: `scale(${0.9 + controllerPulse * 0.2})`,
              boxShadow: `0 0 ${20 + controllerPulse * 20}px ${
                controllerPulse * 10
              }px rgba(59, 130, 246, 0.5)`,
            }}
          >
            <BrainCircuit
              size={32}
              className="text-white"
              style={{ transform: `rotate(${Math.sin(time * 0.05) * 10}deg)` }}
            />
          </div>
        </div>

        {/* Agents Container */}
        <div
          className="absolute w-full flex justify-center items-center gap-8"
          style={{ top: `${AGENT_Y}px` }}
        >
          {Array.from({ length: numAgents }).map((_, idx) => {
            const agentPulse = getAgentPulse(idx);
            return (
              <div
                key={idx}
                className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 transition-all duration-300"
                style={{
                  transform: `scale(${0.9 + agentPulse * 0.2})`,
                  boxShadow: `0 0 ${10 + agentPulse * 15}px ${
                    agentPulse * 8
                  }px rgba(34, 197, 94, 0.5)`,
                }}
              >
                <CircuitBoard
                  size={20}
                  className="text-white"
                  style={{
                    transform: `rotate(${Math.sin(time * 0.05 + idx) * 15}deg)`,
                  }}
                />
                <div
                  className="absolute inset-0 rounded-lg ring-2 ring-green-400"
                  style={{
                    transform: `scale(${1 + agentPulse * 0.3})`,
                    opacity: 1 - agentPulse,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          In a 1-N system architecture, a single controller (input) maintains
          continuous influence over multiple agents (outputs) simultaneously.
          The flowing signals represent the constant communication and control
          from the central controller to all connected agents.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-8 text-sm text-gray-600">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Controller (Input)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Agents (Outputs)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneToNSystem;
