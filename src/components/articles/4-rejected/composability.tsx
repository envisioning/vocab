"use client"
import { useState, useEffect } from "react";
import { Music, Guitar, Drum, Mic, Speaker, Blend, Cable, Play, Pause, RotateCcw } from "lucide-react";

interface AudioComponent {
  id: string;
  name: string;
  type: 'instrument' | 'effect' | 'output';
  icon: React.ReactNode;
  connections: string[];
}

interface Position {
  x: number;
  y: number;
}

const ComposabilityLab = () => {
  const [components, setComponents] = useState<AudioComponent[]>([]);
  const [positions, setPositions] = useState<{[key: string]: Position}>({});
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connections, setConnections] = useState<{from: string, to: string}[]>([]);

  const availableComponents: AudioComponent[] = [
    { id: 'guitar', name: 'Guitar', type: 'instrument', icon: <Guitar className="w-8 h-8"/>, connections: [] },
    { id: 'drums', name: 'Drums', type: 'instrument', icon: <Drum className="w-8 h-8"/>, connections: [] },
    { id: 'vocals', name: 'Vocals', type: 'instrument', icon: <Mic className="w-8 h-8"/>, connections: [] },
    { id: 'mixer', name: 'Mixer', type: 'effect', icon: <Blend className="w-8 h-8"/>, connections: [] },
    { id: 'speakers', name: 'Speakers', type: 'output', icon: <Speaker className="w-8 h-8"/>, connections: [] }
  ];

  const handleDragStart = (id: string) => {
    setDraggedComponent(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent) {
      const component = availableComponents.find(c => c.id === draggedComponent);
      if (component) {
        const newPos = {
          x: e.clientX - 50,
          y: e.clientY - 50
        };
        setPositions(prev => ({...prev, [component.id]: newPos}));
        if (!components.find(c => c.id === component.id)) {
          setComponents(prev => [...prev, component]);
        }
      }
    }
    setDraggedComponent(null);
  };

  const handleConnect = (from: string, to: string) => {
    if (from !== to && !connections.find(c => c.from === from && c.to === to)) {
      setConnections(prev => [...prev, {from, to}]);
    }
  };

  const handleReset = () => {
    setComponents([]);
    setPositions({});
    setConnections([]);
    setIsPlaying(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full h-screen bg-gray-100 p-8" role="application" aria-label="Music Studio Composer">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <Music className="inline mr-2" /> 
          Composability Studio
        </h1>
        <div className="space-x-4">
          <button 
            onClick={togglePlay}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            aria-label={isPlaying ? "Pause composition" : "Play composition"}
          >
            {isPlaying ? <Pause className="inline"/> : <Play className="inline"/>}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            aria-label="Reset studio"
          >
            <RotateCcw className="inline"/>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-48 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="space-y-4">
            {availableComponents.map(component => (
              <div
                key={component.id}
                draggable
                onDragStart={() => handleDragStart(component.id)}
                className="flex items-center gap-2 p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200 transition duration-300"
                role="button"
                aria-label={`Drag ${component.name} component`}
              >
                {component.icon}
                <span>{component.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="flex-1 bg-white rounded-lg shadow-lg relative min-h-[600px]"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          role="region"
          aria-label="Composition workspace"
        >
          {components.map(component => (
            <div
              key={component.id}
              style={{
                position: 'absolute',
                left: positions[component.id]?.x || 0,
                top: positions[component.id]?.y || 0
              }}
              className="absolute p-4 bg-blue-100 rounded-lg shadow-md"
            >
              {component.icon}
              <span className="block text-sm mt-1">{component.name}</span>
            </div>
          ))}

          {connections.map((connection, i) => (
            <svg key={i} className="absolute inset-0 pointer-events-none">
              <line
                x1={positions[connection.from]?.x || 0}
                y1={positions[connection.from]?.y || 0}
                x2={positions[connection.to]?.x || 0}
                y2={positions[connection.to]?.y || 0}
                stroke="#3B82F6"
                strokeWidth="2"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComposabilityLab;