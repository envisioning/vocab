"use client"
import { useState, useEffect } from "react";
import { Search, Brain, Fingerprint, Book, FileText, MessageSquare } from "lucide-react";

interface Clue {
  id: string;
  icon: JSX.Element;
  text: string;
  isPlaced: boolean;
  position: { x: number; y: number };
}

interface DragState {
  isDragging: boolean;
  currentClue: string | null;
  offset: { x: number; y: number };
}

const INITIAL_CLUES: Clue[] = [
  {
    id: "context1",
    icon: <Book className="w-6 h-6" />,
    text: "Previous examples help me understand patterns",
    isPlaced: false,
    position: { x: 0, y: 0 }
  },
  {
    id: "context2",
    icon: <Brain className="w-6 h-6" />,
    text: "I adapt to new situations without training",
    isPlaced: false,
    position: { x: 0, y: 0 }
  },
  {
    id: "context3",
    icon: <MessageSquare className="w-6 h-6" />,
    text: "Your instructions guide my responses",
    isPlaced: false,
    position: { x: 0, y: 0 }
  }
];

const RESPONSES = [
  "I see patterns in the examples...",
  "Adapting to the situation...",
  "Following the given instructions..."
];

export default function InContextLearningDetective() {
  const [clues, setClues] = useState<Clue[]>(INITIAL_CLUES);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    currentClue: null,
    offset: { x: 0, y: 0 }
  });
  const [deductionText, setDeductionText] = useState<string>("");
  const [activeClues, setActiveClues] = useState<number>(0);

  useEffect(() => {
    const placedClues = clues.filter(clue => clue.isPlaced).length;
    setActiveClues(placedClues);
    
    if (placedClues > 0) {
      setDeductionText(RESPONSES[placedClues - 1] || "Case solved!");
    } else {
      setDeductionText("Waiting for clues...");
    }

    return () => {
      setDeductionText("");
    };
  }, [clues]);

  const handleMouseDown = (e: React.MouseEvent, clueId: string) => {
    const clue = clues.find(c => c.id === clueId);
    if (!clue) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragState({
      isDragging: true,
      currentClue: clueId,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.currentClue) return;

    setClues(prev => prev.map(clue => {
      if (clue.id === dragState.currentClue) {
        return {
          ...clue,
          position: {
            x: e.clientX - dragState.offset.x,
            y: e.clientY - dragState.offset.y
          },
          isPlaced: true
        };
      }
      return clue;
    }));
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      currentClue: null,
      offset: { x: 0, y: 0 }
    });
  };

  return (
    <div 
      className="relative h-[500px] bg-gray-100 rounded-lg p-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-8 h-8 text-blue-500" />
        <h2 className="text-xl font-bold">The Context Detective</h2>
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-6 h-6 text-blue-500" />
          <p className="font-medium">Detective's Deduction:</p>
        </div>
        <p className="text-gray-700">{deductionText}</p>
      </div>

      <div className="flex gap-4 mb-6">
        {clues.map(clue => (
          <div
            key={clue.id}
            className={`cursor-move bg-white p-3 rounded-lg shadow-md flex items-center gap-2 
              ${clue.isPlaced ? 'absolute' : 'relative'}`}
            style={clue.isPlaced ? {
              left: `${clue.position.x}px`,
              top: `${clue.position.y}px`
            } : {}}
            onMouseDown={(e) => handleMouseDown(e, clue.id)}
          >
            {clue.icon}
            <span className="text-sm">{clue.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}