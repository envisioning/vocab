"use client"
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Music, BookOpen, Brain } from "lucide-react";

interface SequenceItem {
  id: number;
  icon: JSX.Element;
  label: string;
  prediction: string[];
}

interface SequencePredictorProps {
  initialDifficulty?: number;
}

const WEATHER_SEQUENCE: SequenceItem[] = [
  { id: 1, icon: <Sun className="w-8 h-8" />, label: "Sunny", prediction: ["Sunny", "Cloudy"] },
  { id: 2, icon: <Cloud className="w-8 h-8" />, label: "Cloudy", prediction: ["Rain", "Cloudy"] },
  { id: 3, icon: <CloudRain className="w-8 h-8" />, label: "Rain", prediction: ["Cloudy", "Rain"] },
];

const STORY_SEQUENCE: SequenceItem[] = [
  { id: 1, icon: <BookOpen className="w-8 h-8" />, label: "Once upon", prediction: ["a time", "there"] },
  { id: 2, icon: <BookOpen className="w-8 h-8" />, label: "a time", prediction: ["in a", "there"] },
  { id: 3, icon: <BookOpen className="w-8 h-8" />, label: "in a", prediction: ["land", "forest"] },
];

/**
 * SequencePredictor Component
 * An interactive component teaching sequence models through weather and story predictions
 */
export default function SequencePredictor({ initialDifficulty = 1 }: SequencePredictorProps) {
  const [activeSequence, setActiveSequence] = useState<SequenceItem[]>(WEATHER_SEQUENCE);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userPrediction, setUserPrediction] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isAnimating) {
      animationTimer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeSequence.length);
      }, 2000);
    }

    return () => {
      clearInterval(animationTimer);
    };
  }, [isAnimating, activeSequence]);

  const handleSequenceSwitch = () => {
    setActiveSequence((prev) => 
      prev === WEATHER_SEQUENCE ? STORY_SEQUENCE : WEATHER_SEQUENCE
    );
    setCurrentIndex(0);
    setUserPrediction("");
  };

  const handlePrediction = (prediction: string) => {
    if (activeSequence[currentIndex].prediction.includes(prediction)) {
      setScore((prev) => prev + 10);
    }
    setUserPrediction(prediction);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sequence Predictor</h2>
        <Brain className="w-8 h-8 text-blue-500" />
      </div>

      <div className="mb-6">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4 hover:bg-blue-600 transition duration-300"
          aria-label={isAnimating ? "Pause Sequence" : "Play Sequence"}
        >
          {isAnimating ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleSequenceSwitch}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Switch Sequence
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        {activeSequence.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg ${
              index === currentIndex
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } transition-all duration-300`}
          >
            {item.icon}
            <p className="mt-2 text-center">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Make a Prediction:</h3>
        <div className="flex space-x-2">
          {activeSequence[currentIndex]?.prediction.map((pred) => (
            <button
              key={pred}
              onClick={() => handlePrediction(pred)}
              className={`px-4 py-2 rounded-lg ${
                userPrediction === pred
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition duration-300`}
            >
              {pred}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Score: {score}</p>
      </div>
    </div>
  );
}