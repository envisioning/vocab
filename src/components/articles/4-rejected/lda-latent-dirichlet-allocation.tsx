"use client"
import { useState, useEffect } from "react";
import { Book, Users, Network, Play, Pause, RotateCcw } from "lucide-react";

interface TopicData {
  id: number;
  words: string[];
  color: string;
}

interface DocumentData {
  id: number;
  content: string;
  topicWeights: number[];
  position: { x: number; y: number };
}

const TOPICS: TopicData[] = [
  { id: 1, words: ["sports", "game", "team"], color: "#EF4444" },
  { id: 2, words: ["science", "research", "study"], color: "#3B82F6" },
  { id: 3, words: ["music", "art", "culture"], color: "#22C55E" },
];

const DOCUMENTS: DocumentData[] = [
  {
    id: 1,
    content: "The team played an amazing game last night",
    topicWeights: [0.8, 0.1, 0.1],
    position: { x: 0, y: 0 },
  },
  // Add more documents...
];

const LDAVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'galaxy' | 'party' | 'web'>('galaxy');
  const [documents, setDocuments] = useState<DocumentData[]>(DOCUMENTS);
  const [iteration, setIteration] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setIteration((prev) => (prev + 1) % 100);
      updateDocumentPositions();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const updateDocumentPositions = () => {
    setDocuments(prev => prev.map(doc => ({
      ...doc,
      position: {
        x: Math.cos(iteration * 0.1) * (doc.topicWeights[0] * 100),
        y: Math.sin(iteration * 0.1) * (doc.topicWeights[1] * 100)
      }
    })));
  };

  const renderGalaxyView = () => (
    <div className="relative h-96 bg-gray-800 rounded-lg overflow-hidden">
      {documents.map(doc => (
        <div
          key={doc.id}
          className="absolute w-4 h-4 bg-white rounded-full transform transition-all duration-500"
          style={{
            left: `${50 + doc.position.x}%`,
            top: `${50 + doc.position.y}%`,
          }}
          role="button"
          tabIndex={0}
          aria-label={`Document ${doc.id}`}
        />
      ))}
      {TOPICS.map(topic => (
        <div
          key={topic.id}
          className="absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: topic.color,
            left: `${50 + Math.cos(topic.id * Math.PI * 2/3) * 30}%`,
            top: `${50 + Math.sin(topic.id * Math.PI * 2/3) * 30}%`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView('galaxy')}
            className={`flex items-center gap-2 p-2 rounded ${
              activeView === 'galaxy' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Book size={20} />
            Document Galaxy
          </button>
          <button
            onClick={() => setActiveView('party')}
            className={`flex items-center gap-2 p-2 rounded ${
              activeView === 'party' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Users size={20} />
            Topic Groups
          </button>
          <button
            onClick={() => setActiveView('web')}
            className={`flex items-center gap-2 p-2 rounded ${
              activeView === 'web' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Network size={20} />
            Word Web
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded bg-gray-200"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => {
              setIteration(0);
              setDocuments(DOCUMENTS);
            }}
            className="p-2 rounded bg-gray-200"
            aria-label="Reset"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      {renderGalaxyView()}
    </div>
  );
};

export default LDAVisualizer;