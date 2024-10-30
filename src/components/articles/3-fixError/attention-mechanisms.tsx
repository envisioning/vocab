"use client"
import { useState, useEffect } from "react";
import { Star, UserCircle2, Theater } from "lucide-react";

interface Actor {
  id: number;
  name: string;
  position: { x: number; y: number };
  importance: number;
  line: string;
}

interface Scene {
  id: number;
  description: string;
  focusActors: number[];
  duration: number;
}

const ACTORS: Actor[] = [
  { id: 1, name: "Lead", position: { x: 50, y: 50 }, importance: 0.8, line: "To be or not to be..." },
  { id: 2, name: "Support", position: { x: 30, y: 70 }, importance: 0.5, line: "My lord!" },
  { id: 3, name: "Background", position: { x: 70, y: 30 }, importance: 0.3, line: "What news..." },
];

const SCENES: Scene[] = [
  { id: 1, description: "Monologue", focusActors: [1], duration: 5000 },
  { id: 2, description: "Dialogue", focusActors: [1, 2], duration: 4000 },
  { id: 3, description: "Ensemble", focusActors: [1, 2, 3], duration: 3000 },
];

export default function AttentionMechanism() {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [spotlights, setSpotlights] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (!isPlaying) return;

    const sceneTimer = setTimeout(() => {
      if (currentScene < SCENES.length - 1) {
        setCurrentScene(prev => prev + 1);
        calculateScore();
      } else {
        setIsPlaying(false);
      }
    }, SCENES[currentScene].duration);

    return () => clearTimeout(sceneTimer);
  }, [currentScene, isPlaying]);

  const calculateScore = () => {
    const currentFocus = new Set(spotlights);
    const requiredFocus = new Set(SCENES[currentScene].focusActors);
    const accuracy = [...currentFocus].filter(x => requiredFocus.has(x)).length / requiredFocus.size;
    setScore(prev => prev + Math.round(accuracy * 100));
    
    setFeedback(accuracy === 1 ? "Perfect focus!" : "Try adjusting your attention");
  };

  const toggleSpotlight = (actorId: number) => {
    setSpotlights(prev => 
      prev.includes(actorId)
        ? prev.filter(id => id !== actorId)
        : [...prev, actorId]
    );
  };

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setCurrentScene(0);
    setSpotlights([]);
  };

  return (
    <div className="relative h-screen w-full bg-gray-900 p-4">
      <div className="absolute top-4 right-4 text-white">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" />
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="stage relative h-3/4 w-full border-2 border-gray-700 rounded-lg overflow-hidden">
        {ACTORS.map((actor) => (
          <div
            key={actor.id}
            className={`absolute cursor-pointer transition-all duration-300 ${
              spotlights.includes(actor.id) ? "scale-110" : "scale-100"
            }`}
            style={{
              left: `${actor.position.x}%`,
              top: `${actor.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => toggleSpotlight(actor.id)}
            role="button"
            tabIndex={0}
            aria-label={`Toggle spotlight on ${actor.name}`}
          >
            <UserCircle2
              className={`w-12 h-12 ${
                spotlights.includes(actor.id)
                  ? "text-blue-500 filter drop-shadow-lg"
                  : "text-gray-400"
              }`}
            />
            <div className="mt-2 text-white text-center text-sm">
              {actor.line}
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm">
            Scene: {SCENES[currentScene]?.description}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={isPlaying}
        >
          <Theater className="inline-block mr-2" />
          {isPlaying ? "In Progress..." : "Start Performance"}
        </button>
      </div>

      <div className="mt-4 text-center text-white">
        <p className="text-lg">{feedback}</p>
      </div>
    </div>
  );
}