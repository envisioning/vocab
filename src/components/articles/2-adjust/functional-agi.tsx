"use client";
import { useState, useEffect } from "react";
import { Brain, Zap, Book, Code, Music, Palette, Calculator, Globe, Info } from "lucide-react";

interface SkillNode {
  id: number;
  icon: JSX.Element;
  label: string;
  description: string;
  x: number;
  y: number;
}

export default function FunctionalAGI() {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [brainPulse, setBrainPulse] = useState(false);
  const [connections, setConnections] = useState<boolean>(false);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  const skills: SkillNode[] = [
    { id: 1, icon: <Code size={24} />, label: "Programming", description: "Creates and understands complex software systems", x: 50, y: 30 },
    { id: 2, icon: <Music size={24} />, label: "Music", description: "Composes and analyzes musical patterns", x: 75, y: 60 },
    { id: 3, icon: <Palette size={24} />, label: "Art", description: "Generates and interprets visual creativity", x: 25, y: 60 },
    { id: 4, icon: <Calculator size={24} />, label: "Math", description: "Solves complex mathematical problems", x: 40, y: 80 },
    { id: 5, icon: <Book size={24} />, label: "Literature", description: "Understands and creates narrative content", x: 60, y: 80 },
    { id: 6, icon: <Globe size={24} />, label: "Languages", description: "Processes multiple human languages", x: 85, y: 30 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainPulse((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (brainPulse) {
      const newActiveNodes = skills.map((skill) => skill.id);
      setActiveNodes(newActiveNodes);
      setConnections(true);

      const timeout = setTimeout(() => {
        setActiveNodes([]);
        setConnections(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [brainPulse]);

  return (
    <div className="relative h-[600px] w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-0 w-full text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Functional AGI
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Artificial General Intelligence: Mastering Multiple Domains Simultaneously
        </p>
      </div>

      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
        ${brainPulse ? 'scale-110' : 'scale-100'} 
        transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]`}>
        <Brain size={80} className="text-blue-400" />
        <Zap size={32} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-yellow-400 ${brainPulse ? 'opacity-100' : 'opacity-0'} 
          transition-all duration-300`} />
      </div>

      {skills.map((skill) => (
        <div
          key={skill.id}
          className="absolute transition-all duration-500 cursor-pointer"
          style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
          onMouseEnter={() => setHoveredSkill(skill.id)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className={`rounded-full p-4 bg-slate-800/80 backdrop-blur-sm
            ${activeNodes.includes(skill.id) ? 'text-blue-400 ring-2 ring-blue-400 shadow-lg shadow-blue-400/20' : 'text-gray-400'}
            transition-all duration-300 hover:scale-110`}>
            {skill.icon}
          </div>
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-300">
            {skill.label}
          </span>
          {hoveredSkill === skill.id && (
            <div className="absolute z-10 w-48 p-3 bg-slate-700/90 backdrop-blur-sm rounded-lg shadow-xl 
              text-white text-sm -translate-x-1/2 left-1/2 bottom-full mb-2">
              <Info size={16} className="inline-block mr-2 text-blue-400" />
              {skill.description}
            </div>
          )}
        </div>
      ))}

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {connections && skills.map((skill) => (
          <line
            key={skill.id}
            x1="50%"
            y1="50%"
            x2={`${skill.x}%`}
            y2={`${skill.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            className="transition-opacity duration-500">
            <animate
              attributeName="stroke-dasharray"
              from="0,1000"
              to="1000,0"
              dur="2s"
              fill="freeze"
            />
          </line>
        ))}
      </svg>
    </div>
  );
}