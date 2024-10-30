"use client"
import { useState, useEffect } from "react";
import { School, User, BookOpen, Users, ArrowRight, Check, RefreshCw } from "lucide-react";

interface Entity {
  id: string;
  type: 'room' | 'person' | 'class';
  name: string;
  attributes: Record<string, string>;
  x: number;
  y: number;
}

interface Relationship {
  from: string;
  to: string;
  type: 'teaches' | 'attends' | 'contains';
}

interface KnowledgeArchitectProps {}

const INITIAL_ENTITIES: Entity[] = [
  { id: 'room1', type: 'room', name: 'Math Lab', attributes: { floor: '1', capacity: '30' }, x: 100, y: 100 },
  { id: 'person1', type: 'person', name: 'Ms. Smith', attributes: { role: 'teacher', subject: 'Math' }, x: 300, y: 100 },
  { id: 'class1', type: 'class', name: 'Algebra', attributes: { level: 'Advanced', schedule: 'Mon-Wed' }, x: 500, y: 100 },
];

export default function KnowledgeArchitect({}: KnowledgeArchitectProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [draggedEntity, setDraggedEntity] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        setEntities(INITIAL_ENTITIES);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step]);

  const handleDragStart = (id: string) => {
    setDraggedEntity(id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (!draggedEntity) return;

    const entity = entities.find(e => e.id === draggedEntity);
    if (!entity) return;

    setEntities(prev => prev.map(e => 
      e.id === draggedEntity 
        ? { ...e, x: e.x + e.clientX, y: e.y + e.clientY }
        : e
    ));
    setDraggedEntity(null);
  };

  const createRelationship = (from: string, to: string) => {
    const fromEntity = entities.find(e => e.id === from);
    const toEntity = entities.find(e => e.id === to);
    
    if (!fromEntity || !toEntity) return;

    let type: 'teaches' | 'attends' | 'contains';
    if (fromEntity.type === 'person' && toEntity.type === 'class') {
      type = 'teaches';
    } else if (fromEntity.type === 'room' && toEntity.type === 'class') {
      type = 'contains';
    } else {
      type = 'attends';
    }

    setRelationships(prev => [...prev, { from, to, type }]);
  };

  const resetSystem = () => {
    setEntities([]);
    setRelationships([]);
    setStep(1);
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={resetSystem}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
          aria-label="Reset system"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-bold">Knowledge Architect</h2>
        <span className="text-sm text-gray-600">Step {step}/3</span>
      </div>

      <div className="relative h-[500px] border-2 border-dashed border-gray-300 rounded-lg">
        {entities.map(entity => (
          <div
            key={entity.id}
            draggable
            onDragStart={() => handleDragStart(entity.id)}
            onDragEnd={handleDragEnd}
            className="absolute p-4 bg-white rounded-lg shadow-md cursor-move"
            style={{ left: entity.x, top: entity.y }}
            role="button"
            tabIndex={0}
          >
            {entity.type === 'room' && <School className="text-blue-500" />}
            {entity.type === 'person' && <User className="text-green-500" />}
            {entity.type === 'class' && <BookOpen className="text-gray-500" />}
            <span className="block mt-2 text-sm">{entity.name}</span>
          </div>
        ))}

        {relationships.map((rel, index) => (
          <svg key={index} className="absolute inset-0 pointer-events-none">
            <line
              x1={entities.find(e => e.id === rel.from)?.x || 0}
              y1={entities.find(e => e.id === rel.from)?.y || 0}
              x2={entities.find(e => e.id === rel.to)?.x || 0}
              y2={entities.find(e => e.id === rel.to)?.y || 0}
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}