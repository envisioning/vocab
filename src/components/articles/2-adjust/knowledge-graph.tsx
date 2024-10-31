"use client"
import React, { useState, useEffect } from 'react';
import {
  Brain, Cpu, Database, Globe, Network, Cloud, Lock, Search,
  Code, MessageCircle, Image, Video, Music, Fingerprint, 
  BookOpen, Atom, Microscope, Share2, Zap, RadioTower,
  Server, Shield, Bot, ChartNetwork, Laptop, Monitor,
  Smartphone, TabletSmartphone, Radio, Wifi, User, Users,
  Settings, Hammer, Cog, GitBranch, Navigation, Map
} from 'lucide-react';

const KnowledgeGraphExplorer = () => {
  const [activeNode, setActiveNode] = useState(null);

  // Create a more natural, scattered layout
  const createNaturalLayout = () => {
    const positions = [];
    const usedPositions = new Set();
    const margin = 15; // Margin from edges
    const spacing = 8; // Minimum spacing between nodes
    
    const generatePosition = () => {
      let attempts = 0;
      while (attempts < 100) {
        const x = margin + Math.random() * (100 - 2 * margin);
        const y = margin + Math.random() * (100 - 2 * margin);
        
        // Check if position is far enough from existing nodes
        const isFarEnough = positions.every(pos => {
          const dx = pos.x - x;
          const dy = pos.y - y;
          return Math.sqrt(dx * dx + dy * dy) > spacing;
        });
        
        if (isFarEnough) {
          return { x, y };
        }
        attempts++;
      }
      // Fallback position if no suitable spot found
      return { x: 50, y: 50 };
    };

    return Array(40).fill(null).map(() => generatePosition());
  };

  const positions = createNaturalLayout();

  const nodes = [
    { id: 'ai', icon: Brain, label: 'Artificial Intelligence', category: 'core', ...positions[0] },
    { id: 'ml', icon: Cpu, label: 'Machine Learning', category: 'core', ...positions[1] },
    { id: 'dl', icon: Network, label: 'Deep Learning', category: 'core', ...positions[2] },
    { id: 'data', icon: Database, label: 'Big Data', category: 'data', ...positions[3] },
    { id: 'nlp', icon: MessageCircle, label: 'Natural Language Processing', category: 'application', ...positions[4] },
    { id: 'vision', icon: Image, label: 'Computer Vision', category: 'application', ...positions[5] },
    { id: 'robotics', icon: Bot, label: 'Robotics', category: 'application', ...positions[6] },
    { id: 'cloud', icon: Cloud, label: 'Cloud Computing', category: 'infrastructure', ...positions[7] },
    { id: 'security', icon: Lock, label: 'AI Security', category: 'security', ...positions[8] },
    { id: 'search', icon: Search, label: 'Search Systems', category: 'application', ...positions[9] },
    { id: 'quantum', icon: Atom, label: 'Quantum Computing', category: 'future', ...positions[10] },
    { id: 'edge', icon: Zap, label: 'Edge Computing', category: 'infrastructure', ...positions[11] },
    { id: 'sensors', icon: RadioTower, label: 'IoT Sensors', category: 'infrastructure', ...positions[12] },
    { id: 'research', icon: Microscope, label: 'AI Research', category: 'research', ...positions[13] },
    { id: 'ethics', icon: Shield, label: 'AI Ethics', category: 'social', ...positions[14] },
    { id: 'distributed', icon: Share2, label: 'Distributed AI', category: 'infrastructure', ...positions[15] },
    { id: 'hardware', icon: Server, label: 'AI Hardware', category: 'infrastructure', ...positions[16] },
    { id: 'mobile', icon: Smartphone, label: 'Mobile AI', category: 'application', ...positions[17] },
    { id: 'gaming', icon: Laptop, label: 'AI Gaming', category: 'application', ...positions[18] },
    { id: 'audio', icon: Music, label: 'Audio AI', category: 'application', ...positions[19] },
    { id: 'biometrics', icon: Fingerprint, label: 'Biometrics', category: 'security', ...positions[20] },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge Bases', category: 'data', ...positions[21] },
    { id: 'reasoning', icon: Hammer, label: 'Reasoning Systems', category: 'core', ...positions[22] },
    { id: 'optimization', icon: Settings, label: 'Optimization', category: 'core', ...positions[23] },
    { id: 'genetic', icon: GitBranch, label: 'Genetic Algorithms', category: 'core', ...positions[24] },
    // Add more nodes...
  ];

  // Define comprehensive relationships with weights
  const relationships = [
    { from: 'ai', to: 'ml', weight: 0.9 },
    { from: 'ai', to: 'dl', weight: 0.8 },
    { from: 'ml', to: 'dl', weight: 0.9 },
    { from: 'ml', to: 'data', weight: 0.8 },
    { from: 'dl', to: 'data', weight: 0.8 },
    { from: 'nlp', to: 'ml', weight: 0.7 },
    { from: 'nlp', to: 'dl', weight: 0.7 },
    { from: 'vision', to: 'dl', weight: 0.8 },
    { from: 'robotics', to: 'vision', weight: 0.6 },
    { from: 'robotics', to: 'nlp', weight: 0.4 },
    { from: 'cloud', to: 'ml', weight: 0.5 },
    { from: 'security', to: 'ai', weight: 0.6 },
    { from: 'search', to: 'nlp', weight: 0.7 },
    { from: 'quantum', to: 'ml', weight: 0.4 },
    { from: 'edge', to: 'mobile', weight: 0.6 },
    { from: 'sensors', to: 'data', weight: 0.7 },
    { from: 'ethics', to: 'ai', weight: 0.5 },
    { from: 'distributed', to: 'cloud', weight: 0.7 },
    { from: 'hardware', to: 'ai', weight: 0.6 },
    { from: 'mobile', to: 'edge', weight: 0.7 },
    { from: 'gaming', to: 'ml', weight: 0.5 },
    { from: 'audio', to: 'dl', weight: 0.6 },
    { from: 'biometrics', to: 'vision', weight: 0.7 },
    { from: 'knowledge', to: 'ai', weight: 0.7 },
    { from: 'reasoning', to: 'ai', weight: 0.8 },
    { from: 'optimization', to: 'ml', weight: 0.7 },
    { from: 'genetic', to: 'optimization', weight: 0.6 },
    // Add more relationships...
  ];

  const categoryColors = {
    core: '#3B82F6',
    application: '#10B981',
    infrastructure: '#EC4899',
    security: '#F59E0B',
    research: '#8B5CF6',
    social: '#F43F5E',
    future: '#0EA5E9',
    data: '#A855F7'
  };

  const getRelatedNodes = (nodeId) => {
    const related = new Set();
    relationships.forEach(rel => {
      if (rel.from === nodeId) related.add(rel.to);
      if (rel.to === nodeId) related.add(rel.from);
    });
    return related;
  };

  return (
    <div className="w-full h-[calc(100vh-40px)] relative overflow-hidden">
      {/* Gradient background with floating orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
            style={{
              backgroundColor: Object.values(categoryColors)[i % Object.keys(categoryColors).length],
              width: `${200 + Math.random() * 200}px`,
              height: `${200 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Graph container */}
      <div className="relative h-full">
        {/* Always visible connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {relationships.map((rel, index) => {
            const fromNode = nodes.find(n => n.id === rel.from);
            const toNode = nodes.find(n => n.id === rel.to);
            const isActive = activeNode && (activeNode === rel.from || activeNode === rel.to);
            
            return (
              <g key={`${rel.from}-${rel.to}`}>
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isActive ? categoryColors[fromNode.category] : '#CBD5E1'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 0.8 : 0.2}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle
                    cx={`${(fromNode.x + toNode.x) / 2}%`}
                    cy={`${(fromNode.y + toNode.y) / 2}%`}
                    r="2"
                    fill={categoryColors[fromNode.category]}
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;
          const isRelated = activeNode && getRelatedNodes(activeNode).has(node.id);
          
          return (
            <div
              key={node.id}
              className={`absolute transform transition-all duration-300 cursor-pointer
                ${isActive ? 'scale-125 z-20' : isRelated ? 'scale-110 z-10' : 'scale-100 z-0'}
                ${!activeNode || isActive || isRelated ? 'opacity-100' : 'opacity-40'}`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setActiveNode(isActive ? null : node.id)}
            >
              <div 
                className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300
                  ${isActive 
                    ? 'bg-white shadow-lg ring-2' 
                    : 'bg-white/80 hover:bg-white hover:shadow-md'}`}
                style={{
                  color: categoryColors[node.category],
                  boxShadow: isActive ? `0 0 20px ${categoryColors[node.category]}40` : '',
                  borderColor: categoryColors[node.category]
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={`absolute w-32 -left-16 mt-2 text-center transition-opacity duration-300
                ${isActive || isRelated ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-xs font-medium text-gray-800">{node.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
        <div className="text-sm font-medium mb-2">Categories</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-600 capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphExplorer;