"use client"
import { useState, useEffect } from "react";
import { Music, Building2, Cloud, ArrowRight, Check, X } from "lucide-react";

interface ScaleExample {
  icon: JSX.Element;
  title: string;
  shortScale: string;
  mediumScale: string;
  longScale: string;
}

const SCALE_EXAMPLES: ScaleExample[] = [
  {
    icon: <Music className="w-6 h-6" />,
    title: "Orchestra",
    shortScale: "Individual notes",
    mediumScale: "Musical phrases",
    longScale: "Symphony movements"
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "City",
    shortScale: "Traffic lights",
    mediumScale: "Road projects",
    longScale: "Urban planning"
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: "Weather",
    shortScale: "Daily forecast",
    mediumScale: "Seasonal patterns",
    longScale: "Climate change"
  }
];

/**
 * ScaleSeparationExplorer: Interactive component teaching scale separation
 * through familiar real-world examples and interactive exercises.
 */
export default function ScaleSeparationExplorer() {
  const [currentExample, setCurrentExample] = useState<number>(0);
  const [selectedScale, setSelectedScale] = useState<string>("short");
  const [score, setScore] = useState<number>(0);
  const [challenge, setChallenge] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % SCALE_EXAMPLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateChallenge = () => {
    const scales = ["shortScale", "mediumScale", "longScale"];
    const randomExample = SCALE_EXAMPLES[Math.floor(Math.random() * SCALE_EXAMPLES.length)];
    const randomScale = scales[Math.floor(Math.random() * scales.length)];
    setChallenge(randomExample[randomScale as keyof ScaleExample] as string);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleScaleSelect = (scale: string) => {
    setSelectedScale(scale);
    if (challenge) {
      const correct = SCALE_EXAMPLES.some(ex => 
        ex[`${scale}Scale` as keyof ScaleExample] === challenge
      );
      setScore(prev => correct ? prev + 1 : prev);
      setFeedback(correct ? "Correct!" : "Try again!");
      setTimeout(() => {
        setFeedback("");
        generateChallenge();
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Scale Separation Explorer</h2>
        
        <div className="flex items-center space-x-4 mb-6">
          {SCALE_EXAMPLES[currentExample].icon}
          <span className="text-lg font-semibold">
            {SCALE_EXAMPLES[currentExample].title}
          </span>
        </div>

        <div className="space-y-4">
          {["short", "medium", "long"].map((scale) => (
            <button
              key={scale}
              onClick={() => handleScaleSelect(scale)}
              className={`w-full p-4 rounded-lg transition-colors duration-300 ${
                selectedScale === scale
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-pressed={selectedScale === scale}
            >
              <div className="flex items-center justify-between">
                <span className="capitalize">{scale} Scale</span>
                <span>
                  {SCALE_EXAMPLES[currentExample][`${scale}Scale` as keyof ScaleExample]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Challenge</h3>
        <p className="mb-4">Which scale does this belong to: "{challenge}"?</p>
        
        {feedback && (
          <div className={`flex items-center space-x-2 mb-4 ${
            feedback === "Correct!" ? "text-green-500" : "text-red-500"
          }`}>
            {feedback === "Correct!" ? <Check /> : <X />}
            <span>{feedback}</span>
          </div>
        )}
        
        <p className="text-lg">Score: {score}</p>
      </div>
    </div>
  );
}