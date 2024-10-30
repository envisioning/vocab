"use client"
import { useState, useEffect } from "react";
import { User, Users, BookOpen, Activity, Heart, Coffee, Music, Football, Pencil, Link2 } from "lucide-react";

interface Entity {
  id: string;
  type: 'student' | 'activity';
  label: string;
  x: number;
  y: number;
}

interface Connection {
  source: string;
  target: string;
  type: 'friend' | 'studies' | 'plays';
}

interface EntityNode {
  id: string;
  x: number;
  y: number;
  label: string;
  icon: JSX.Element;
}

const INITIAL_ENTITIES: EntityNode[] = [
  { id: 'alice', x: 100, y: 100, label: 'Alice', icon: <User className="text-blue-500" /> },
  { id: 'math', x: 250, y: 100, label: 'Math Club', icon: <BookOpen className="text-green-500" /> },
  { id: 'bob', x: 400, y: 100, label: 'Bob', icon: <User className="text-blue-500" /> },
  { id: 'sports', x: 250, y: 250, label: 'Sports Team', icon: <Activity className="text-green-500" /> }
];

const INITIAL_CONNECTIONS: Connection[] = [
  { source: 'alice', target: 'math', type: 'studies' },
  { source: 'bob', target: 'math', type: 'studies' },
  { source: 'alice', target: 'bob', type: 'friend' },
  { source: 'bob', target: 'sports', type: 'plays' }
];

export default function KnowledgeGraphExplorer() {
  const [entities, setEntities] = useState<EntityNode[]>(INITIAL_ENTITIES);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleEntityClick = (id: string) => {
    setSelectedEntity(selectedEntity === id ? null : id);
  };

  const getRelatedEntities = (id: string) => {
    return connections
      .filter(conn => conn.source === id || conn.target === id)
      .map(conn => {
        const relatedId = conn.source === id ? conn.target : conn.source;
        return {
          entity: entities.find(e => e.id === relatedId)!,
          type: conn.type
        };
      });
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg p-4 overflow-hidden" role="region" aria-label="Knowledge Graph Explorer">
      <div className="absolute top-4 left-4 space-y-2">
        <h2 className="text-lg font-semibold">Knowledge Graph Explorer</h2>
        <p className="text-sm text-gray-600">
          {step === 0 && "Entities are connected through relationships"}
          {step === 1 && "Click on entities to explore connections"}
          {step === 2 && "Different colors show different relationship types"}
          {step === 3 && "Everything is interconnected!"}
        </p>
      </div>

      <div className="relative w-full h-full">
        {connections.map((conn, i) => {
          const source = entities.find(e => e.id === conn.source)!;
          const target = entities.find(e => e.id === conn.target)!;
          const isHighlighted = selectedEntity && (conn.source === selectedEntity || conn.target === selectedEntity);

          return (
            <svg key={i} className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`${
                  isHighlighted ? 'stroke-blue-500' : 'stroke-gray-300'
                } transition-colors duration-300`}
                strokeWidth="2"
              />
            </svg>
          );
        })}

        {entities.map((entity) => (
          <div
            key={entity.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
              ${selectedEntity === entity.id ? 'scale-110' : 'scale-100'}
              transition-transform duration-300`}
            style={{ left: entity.x, top: entity.y }}
            onClick={() => handleEntityClick(entity.id)}
            role="button"
            aria-pressed={selectedEntity === entity.id}
            tabIndex={0}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-3 rounded-full bg-white shadow-md
                ${selectedEntity === entity.id ? 'ring-2 ring-blue-500' : ''}`}>
                {entity.icon}
              </div>
              <span className="text-sm font-medium">{entity.label}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedEntity && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-medium mb-2">Connected to:</h3>
          <ul className="space-y-2">
            {getRelatedEntities(selectedEntity).map(({ entity, type }, i) => (
              <li key={i} className="flex items-center space-x-2">
                {entity.icon}
                <span>{entity.label}</span>
                <span className="text-sm text-gray-500">({type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}