"use client"
import { useState, useEffect } from "react";
import { Globe, Server, Wifi, Smartphone, Search, ZoomIn, ZoomOut } from "lucide-react";

interface ScaleLevel {
  name: string;
  icon: JSX.Element;
  description: string;
}

const SCALE_LEVELS: ScaleLevel[] = [
  { name: "Global", icon: <Globe className="w-6 h-6" />, description: "Data centers, undersea cables, satellites" },
  { name: "Country", icon: <Server className="w-6 h-6" />, description: "Internet usage stats, major websites" },
  { name: "City", icon: <Wifi className="w-6 h-6" />, description: "Local networks, ISPs" },
  { name: "Individual", icon: <Smartphone className="w-6 h-6" />, description: "Devices, personal data" },
];

/**
 * ScaleSphereExplorer: An interactive component to teach Internet Scale
 */
const ScaleSphereExplorer: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        setCurrentLevel((prevLevel) => (prevLevel + 1) % SCALE_LEVELS.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isAnimating]);

  const handleZoomIn = () => {
    setCurrentLevel((prevLevel) => Math.min(prevLevel + 1, SCALE_LEVELS.length - 1));
    setIsAnimating(false);
  };

  const handleZoomOut = () => {
    setCurrentLevel((prevLevel) => Math.max(prevLevel - 1, 0));
    setIsAnimating(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate search functionality
    alert(`Searching for "${searchQuery}" across the internet...`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Internet Scale Explorer</h1>
      <div className="relative w-64 h-64 bg-blue-500 rounded-full flex items-center justify-center mb-4">
        {SCALE_LEVELS[currentLevel].icon}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-white animate-pulse"></div>
      </div>
      <p className="text-lg font-semibold mb-2">{SCALE_LEVELS[currentLevel].name} Level</p>
      <p className="text-sm text-gray-600 mb-4">{SCALE_LEVELS[currentLevel].description}</p>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleZoomOut}
          disabled={currentLevel === 0}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomIn}
          disabled={currentLevel === SCALE_LEVELS.length - 1}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSearch} className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search the internet..."
          className="border p-2 rounded-l"
          aria-label="Search query"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>
      </form>
      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {isAnimating ? "Pause" : "Auto-explore"}
      </button>
    </div>
  );
};

export default ScaleSphereExplorer;