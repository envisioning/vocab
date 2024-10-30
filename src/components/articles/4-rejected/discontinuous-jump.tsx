"use client"
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Info } from "lucide-react";

interface AIEvent {
  year: number;
  description: string;
  capability: number;
  isJump: boolean;
}

const AI_EVENTS: AIEvent[] = [
  { year: 1950, description: "Turing Test proposed", capability: 10, isJump: false },
  { year: 1956, description: "Dartmouth Conference", capability: 15, isJump: false },
  { year: 1997, description: "Deep Blue beats Kasparov", capability: 40, isJump: true },
  { year: 2011, description: "IBM Watson wins Jeopardy!", capability: 60, isJump: true },
  { year: 2012, description: "ImageNet breakthrough", capability: 65, isJump: false },
  { year: 2016, description: "AlphaGo beats Lee Sedol", capability: 80, isJump: true },
  { year: 2020, description: "GPT-3 released", capability: 90, isJump: true },
  { year: 2022, description: "ChatGPT launched", capability: 95, isJump: true },
];

/**
 * AIEvolutionTimeline Component
 * 
 * This component visualizes the progress of AI over time, highlighting
 * discontinuous jumps in capability.
 */
const AIEvolutionTimeline: React.FC = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEventIndex((prevIndex) => 
        prevIndex < AI_EVENTS.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentEventIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : AI_EVENTS.length - 1
    );
  };

  const handleNext = () => {
    setCurrentEventIndex((prevIndex) => 
      prevIndex < AI_EVENTS.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 0.5));
  };

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">AI Evolution Timeline</h1>
      <div className="relative w-full max-w-3xl h-64 bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 w-full h-full flex items-end transition-all duration-500"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'bottom' }}
        >
          {AI_EVENTS.map((event, index) => (
            <div
              key={event.year}
              className={`relative h-${event.capability} w-8 mx-1 ${
                event.isJump ? 'bg-blue-500' : 'bg-gray-400'
              } ${index === currentEventIndex ? 'ring-2 ring-green-500' : ''}`}
              style={{ height: `${event.capability}%` }}
            >
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs">
                {event.year}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handlePrev}
          className="p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Previous event"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Next event"
        >
          <ChevronRight size={24} />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Zoom in"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Zoom out"
        >
          <ZoomOut size={24} />
        </button>
        <button
          onClick={toggleInfo}
          className="p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Toggle information"
        >
          <Info size={24} />
        </button>
      </div>
      {showInfo && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            {AI_EVENTS[currentEventIndex].year}: {AI_EVENTS[currentEventIndex].description}
          </h2>
          <p>
            {AI_EVENTS[currentEventIndex].isJump
              ? "This event represents a discontinuous jump in AI capability."
              : "This event shows incremental progress in AI development."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIEvolutionTimeline;