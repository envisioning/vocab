"use client"
import { useState, useEffect } from "react";
import { Smile, Heart, Sun, Cloud, Star, Moon, DragDropIcon } from "lucide-react";

interface Concept {
  id: string;
  text: string;
  icon: JSX.Element;
  position: { x: number; y: number };
  isPlaced: boolean;
}

interface ComponentProps {}

type DraggingItem = Concept | null;

const INITIAL_CONCEPTS: Concept[] = [
  { id: "1", text: "Happy", icon: <Smile size={24} />, position: { x: 0, y: 0 }, isPlaced: false },
  { id: "2", text: "Love", icon: <Heart size={24} />, position: { x: 0, y: 0 }, isPlaced: false },
  { id: "3", text: "Day", icon: <Sun size={24} />, position: { x: 0, y: 0 }, isPlaced: false },
  { id: "4", text: "Weather", icon: <Cloud size={24} />, position: { x: 0, y: 0 }, isPlaced: false },
  { id: "5", text: "Night", icon: <Moon size={24} />, position: { x: 0, y: 0 }, isPlaced: false },
];

const EmbeddingSpace = ({}: ComponentProps) => {
  const [concepts, setConcepts] = useState<Concept[]>(INITIAL_CONCEPTS);
  const [draggingItem, setDraggingItem] = useState<DraggingItem>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const cleanup = () => {
      setConcepts(INITIAL_CONCEPTS);
      setDraggingItem(null);
      setScore(0);
    };

    return cleanup;
  }, []);

  const handleDragStart = (concept: Concept) => {
    setDraggingItem(concept);
  };

  const handleDragEnd = (e: React.DragEvent, concept: Concept) => {
    if (!draggingItem) return;

    const embedSpace = document.getElementById('embedding-space');
    if (!embedSpace) return;

    const rect = embedSpace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setConcepts(prev => prev.map(c => 
      c.id === concept.id 
        ? { ...c, position: { x, y }, isPlaced: true }
        : c
    ));

    setDraggingItem(null);
    calculateScore();
  };

  const calculateScore = () => {
    const placedConcepts = concepts.filter(c => c.isPlaced);
    if (placedConcepts.length < 2) return;

    const pairs = [
      ["Happy", "Love"],
      ["Day", "Night"],
      ["Weather", "Cloud"]
    ];

    let newScore = 0;
    pairs.forEach(([c1, c2]) => {
      const concept1 = placedConcepts.find(c => c.text === c1);
      const concept2 = placedConcepts.find(c => c.text === c2);
      
      if (concept1 && concept2) {
        const distance = Math.sqrt(
          Math.pow(concept1.position.x - concept2.position.x, 2) +
          Math.pow(concept1.position.y - concept2.position.y, 2)
        );
        if (distance < 100) newScore += 1;
      }
    });

    setScore(newScore);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Joint Embedding Space</h1>
      
      <div className="flex gap-8">
        <div className="w-48 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Concepts</h2>
          {concepts.filter(c => !c.isPlaced).map(concept => (
            <div
              key={concept.id}
              draggable
              onDragStart={() => handleDragStart(concept)}
              className="flex items-center gap-2 p-2 mb-2 bg-gray-100 rounded cursor-move hover:bg-blue-50 transition-colors duration-300"
              role="button"
              tabIndex={0}
            >
              {concept.icon}
              <span>{concept.text}</span>
            </div>
          ))}
        </div>

        <div
          id="embedding-space"
          className="relative w-96 h-96 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg border-2 border-gray-200"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => draggingItem && handleDragEnd(e, draggingItem)}
          role="region"
          aria-label="Embedding Space"
        >
          {concepts.filter(c => c.isPlaced).map(concept => (
            <div
              key={concept.id}
              style={{
                position: 'absolute',
                left: concept.position.x,
                top: concept.position.y,
                transform: 'translate(-50%, -50%)'
              }}
              className="flex items-center gap-2 p-2 bg-white rounded shadow-sm"
            >
              {concept.icon}
              <span>{concept.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-lg font-semibold text-blue-600">
        Score: {score}
      </div>
    </div>
  );
};

export default EmbeddingSpace;