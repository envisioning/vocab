"use client"
import { useState, useEffect } from "react";
import { Museum, Star, Sparkles, Zap, Info, Award } from "lucide-react";

interface Artifact {
  id: number;
  name: string;
  novelty: number;
  relevance: number;
  surprise: number;
  usefulness: number;
  icon: keyof typeof icons;
}

interface ComponentProps {}

const icons = {
  Museum,
  Star,
  Sparkles,
  Zap,
  Info,
  Award,
};

const ARTIFACTS: Artifact[] = [
  { id: 1, name: "Ancient Meme", novelty: 0.3, relevance: 0.9, surprise: 0.8, usefulness: 0.7, icon: "Star" },
  { id: 2, name: "Viral Dance", novelty: 0.9, relevance: 0.7, surprise: 0.6, usefulness: 0.4, icon: "Sparkles" },
  { id: 3, name: "AI Discovery", novelty: 0.8, relevance: 0.8, surprise: 0.9, usefulness: 0.9, icon: "Zap" },
  { id: 4, name: "Classic Art", novelty: 0.2, relevance: 0.6, surprise: 0.3, usefulness: 0.8, icon: "Museum" },
  { id: 5, name: "New Theory", novelty: 0.9, relevance: 0.9, surprise: 0.7, usefulness: 0.9, icon: "Info" },
  { id: 6, name: "Achievement", novelty: 0.7, relevance: 0.8, surprise: 0.6, usefulness: 0.8, icon: "Award" },
];

const InterestingnessExplorer = ({}: ComponentProps) => {
  const [selectedArtifacts, setSelectedArtifacts] = useState<number[]>([]);
  const [draggedArtifact, setDraggedArtifact] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const calculateInterestingness = (artifact: Artifact): number => {
    return (artifact.novelty + artifact.relevance + artifact.surprise + artifact.usefulness) / 4;
  };

  const handleDragStart = (artifactId: number) => {
    setDraggedArtifact(artifactId);
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedArtifact === null) return;
    
    const newSelection = [...selectedArtifacts];
    if (newSelection.includes(targetId)) {
      const idx = newSelection.indexOf(targetId);
      newSelection[idx] = draggedArtifact;
    } else if (newSelection.length < 3) {
      newSelection.push(draggedArtifact);
    }
    setSelectedArtifacts(newSelection);
    setDraggedArtifact(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedArtifacts.length === 3) {
      const totalScore = selectedArtifacts.reduce((acc, id) => {
        const artifact = ARTIFACTS.find(a => a.id === id);
        return acc + (artifact ? calculateInterestingness(artifact) : 0);
      }, 0) / 3;

      setFeedback(
        totalScore > 0.8 ? "Excellent curation! You've selected highly interesting artifacts!"
        : totalScore > 0.6 ? "Good selection! Consider the balance of novelty and usefulness."
        : "Try selecting artifacts with higher novelty and relevance scores."
      );
    }
    
    return () => setFeedback("");
  }, [selectedArtifacts]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Digital Museum Curator</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {ARTIFACTS.map((artifact) => {
          const Icon = icons[artifact.icon];
          const isSelected = selectedArtifacts.includes(artifact.id);
          
          return (
            <div
              key={artifact.id}
              draggable
              onDragStart={() => handleDragStart(artifact.id)}
              onDrop={(e) => handleDrop(e, artifact.id)}
              onDragOver={handleDragOver}
              className={`p-4 rounded-lg transition-all duration-300 ${
                isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border-2 border-gray-200'
              } hover:shadow-lg cursor-move`}
              role="button"
              aria-pressed={isSelected}
              tabIndex={0}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-6 h-6 text-blue-500" />
                <h3 className="font-medium">{artifact.name}</h3>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Novelty:</span>
                  <span className="font-medium">{artifact.novelty * 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Relevance:</span>
                  <span className="font-medium">{artifact.relevance * 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Surprise:</span>
                  <span className="font-medium">{artifact.surprise * 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Usefulness:</span>
                  <span className="font-medium">{artifact.usefulness * 100}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className="p-4 bg-blue-50 rounded-lg text-blue-800" role="alert">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default InterestingnessExplorer;