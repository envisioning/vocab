"use client"
import { useState, useEffect } from "react";
import { User, Users, Map, MessageCircle, RefreshCw, Info } from "lucide-react";

interface ZooKeeper {
  id: number;
  position: { x: number; y: number };
  route: { x: number; y: number }[];
  currentRouteIndex: number;
  knowledge: string[];
  responses: Record<string, string>;
}

interface ComponentProps {}

const KEEPERS: ZooKeeper[] = [
  {
    id: 1,
    position: { x: 20, y: 20 },
    route: [
      { x: 20, y: 20 },
      { x: 80, y: 20 },
      { x: 80, y: 80 },
      { x: 20, y: 80 },
    ],
    currentRouteIndex: 0,
    knowledge: ["Lions", "Tigers"],
    responses: {
      feeding: "The big cats are fed twice daily.",
      schedule: "I patrol this area every 30 minutes.",
      help: "The exit is to your right.",
    },
  },
  {
    id: 2,
    position: { x: 60, y: 60 },
    route: [
      { x: 60, y: 60 },
      { x: 60, y: 20 },
      { x: 20, y: 60 },
    ],
    currentRouteIndex: 0,
    knowledge: ["Penguins", "Seals"],
    responses: {
      feeding: "Our aquatic friends eat fresh fish.",
      schedule: "The penguin show is at noon.",
      help: "The restrooms are nearby.",
    },
  },
];

const NPCZookeeper = ({}: ComponentProps) => {
  const [keepers, setKeepers] = useState<ZooKeeper[]>(KEEPERS);
  const [selectedKeeper, setSelectedKeeper] = useState<ZooKeeper | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setKeepers((current) =>
        current.map((keeper) => {
          const nextIndex =
            (keeper.currentRouteIndex + 1) % keeper.route.length;
          const nextPosition = keeper.route[nextIndex];
          return {
            ...keeper,
            position: nextPosition,
            currentRouteIndex: nextIndex,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isMoving]);

  const handleKeeperClick = (keeper: ZooKeeper) => {
    setSelectedKeeper(keeper);
  };

  const handleQuestionSelect = (q: string) => {
    setQuestion(q);
  };

  const handleReset = () => {
    setKeepers(KEEPERS);
    setSelectedKeeper(null);
    setQuestion("");
    setIsMoving(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="relative h-96 bg-white rounded-lg border-2 border-gray-300 mb-4">
        {keepers.map((keeper) => (
          <button
            key={keeper.id}
            onClick={() => handleKeeperClick(keeper)}
            className={`absolute transition-all duration-500 p-2 rounded-full ${
              selectedKeeper?.id === keeper.id
                ? "bg-blue-500"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            style={{
              left: `${keeper.position.x}%`,
              top: `${keeper.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            aria-label={`Zookeeper ${keeper.id}`}
          >
            <User className="w-6 h-6 text-white" />
          </button>
        ))}
        
        <button
          onClick={() => setIsMoving(!isMoving)}
          className="absolute top-2 right-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          aria-label={isMoving ? "Pause movement" : "Resume movement"}
        >
          <RefreshCw className={`w-5 h-5 ${isMoving ? "animate-spin" : ""}`} />
        </button>
      </div>

      {selectedKeeper && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Zookeeper {selectedKeeper.id}
          </h2>
          <div className="space-y-2">
            {Object.keys(selectedKeeper.responses).map((q) => (
              <button
                key={q}
                onClick={() => handleQuestionSelect(q)}
                className={`block w-full text-left p-2 rounded ${
                  question === q
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}?
              </button>
            ))}
            {question && (
              <div className="mt-4 p-3 bg-gray-100 rounded flex items-start">
                <MessageCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                <p>{selectedKeeper.responses[question]}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleReset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
      >
        Reset Simulation
      </button>
    </div>
  );
};

export default NPCZookeeper;