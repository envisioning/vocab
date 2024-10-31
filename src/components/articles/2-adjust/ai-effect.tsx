"use client"
import { useState, useEffect } from "react";
import { Brain, Calculator, Crown, Camera, Bot, ArrowRight, RefreshCw } from "lucide-react";

interface TechnologyCard {
  id: string;
  title: string;
  year: number;
  pastPerception: string;
  currentPerception: string;
  icon: JSX.Element;
}

interface AIEffectGalleryProps {}

const TECHNOLOGIES: TechnologyCard[] = [
  {
    id: "calc",
    title: "Calculator",
    year: 1960,
    pastPerception: "Amazing machine intelligence!",
    currentPerception: "Basic math tool",
    icon: <Calculator className="w-8 h-8" />
  },
  {
    id: "chess",
    title: "Chess AI",
    year: 1997,
    pastPerception: "Peak of artificial intelligence",
    currentPerception: "Just game algorithms",
    icon: <Crown className="w-8 h-8" />
  },
  {
    id: "vision",
    title: "Image Recognition",
    year: 2015,
    pastPerception: "Only humans can do this",
    currentPerception: "Standard phone feature",
    icon: <Camera className="w-8 h-8" />
  }
];

export default function AIEffectGallery({}: AIEffectGalleryProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [normalizedTechs, setNormalizedTechs] = useState<string[]>([]);
  const [showFuture, setShowFuture] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowFuture(prev => !prev);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleDragStart = (id: string) => {
    setDraggedCard(id);
  };

  const handleDrop = (id: string) => {
    if (draggedCard && !normalizedTechs.includes(id)) {
      setNormalizedTechs(prev => [...prev, id]);
    }
    setDraggedCard(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" role="main">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Brain className="w-8 h-8 text-blue-500" />
        The AI Effect Timeline
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="p-4 bg-gray-100 rounded-lg"
          onDragOver={(e) => e.preventDefault()}
          role="region"
          aria-label="Impressive AI Zone"
        >
          <h2 className="text-lg font-semibold mb-4">Impressive AI</h2>
          {TECHNOLOGIES.filter(tech => !normalizedTechs.includes(tech.id)).map(tech => (
            <div
              key={tech.id}
              draggable
              onDragStart={() => handleDragStart(tech.id)}
              className="p-4 bg-white rounded-lg mb-3 cursor-move hover:shadow-lg transition-shadow duration-300"
              role="article"
            >
              <div className="flex items-center gap-2">
                {tech.icon}
                <div>
                  <h3 className="font-medium">{tech.title} ({tech.year})</h3>
                  <p className="text-sm text-gray-600">{tech.pastPerception}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="p-4 bg-gray-100 rounded-lg"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(draggedCard!)}
          role="region"
          aria-label="Regular Computing Zone"
        >
          <h2 className="text-lg font-semibold mb-4">Just Regular Computing</h2>
          {TECHNOLOGIES.filter(tech => normalizedTechs.includes(tech.id)).map(tech => (
            <div
              key={tech.id}
              className="p-4 bg-white rounded-lg mb-3"
              role="article"
            >
              <div className="flex items-center gap-2">
                {tech.icon}
                <div>
                  <h3 className="font-medium">{tech.title}</h3>
                  <p className="text-sm text-gray-600">{tech.currentPerception}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showFuture && (
        <div className="p-4 bg-blue-50 rounded-lg mt-6" role="complementary">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            Future Predictions
          </h2>
          <p className="text-gray-700">
            What AI capabilities do you think will become "just regular computing" in the future?
          </p>
        </div>
      )}

      <button
        onClick={() => setNormalizedTechs([])}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        aria-label="Reset timeline"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Timeline
      </button>
    </div>
  );
}