"use client"
import { useState, useEffect } from "react";
import { Lightbulb, Eye, EyeOff, Brain, ArrowRight, CheckCircle2 } from "lucide-react";

interface Seat {
  id: number;
  masked: boolean;
  content: string;
}

interface ComponentProps {}

const INITIAL_SEQUENCE = ["The", "cat", "sat", "on", "the", "mat"];

const TheaterMaskingDemo: React.FC<ComponentProps> = () => {
  const [seats, setSeats] = useState<Seat[]>(
    INITIAL_SEQUENCE.map((word, i) => ({
      id: i,
      masked: false,
      content: word
    }))
  );
  
  const [mode, setMode] = useState<"explore" | "challenge">("explore");
  const [score, setScore] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<number>(0);
  
  const challenges = [
    {
      instruction: "Mask articles (the, a, an)",
      solution: [true, false, false, false, true, false]
    },
    {
      instruction: "Mask prepositions (on, in, at)",
      solution: [false, false, false, true, false, false] 
    }
  ];

  const toggleSeat = (id: number) => {
    setSeats(prev => 
      prev.map(seat => 
        seat.id === id ? {...seat, masked: !seat.masked} : seat
      )
    );
  };

  const checkSolution = () => {
    const currentMask = seats.map(s => s.masked);
    const isCorrect = challenges[currentChallenge].solution.every(
      (sol, i) => sol === currentMask[i]
    );
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCurrentChallenge(prev => (prev + 1) % challenges.length);
    }
  };

  useEffect(() => {
    const demoInterval = setInterval(() => {
      if (mode === "explore") {
        setSeats(prev => 
          prev.map(seat => ({
            ...seat,
            masked: Math.random() > 0.5
          }))
        );
      }
    }, 3000);

    return () => clearInterval(demoInterval);
  }, [mode]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setMode("explore")}
          className={`px-4 py-2 rounded ${mode === "explore" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          <Brain className="inline mr-2" /> Explore
        </button>
        <button
          onClick={() => setMode("challenge")}
          className={`px-4 py-2 rounded ${mode === "challenge" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          <CheckCircle2 className="inline mr-2" /> Challenge
        </button>
      </div>

      {mode === "challenge" && (
        <div className="mb-4 text-lg font-semibold">
          {challenges[currentChallenge].instruction}
          <span className="ml-4">Score: {score}</span>
        </div>
      )}

      <div className="theater-grid grid grid-cols-6 gap-4 mb-8" role="grid">
        {seats.map(seat => (
          <button
            key={seat.id}
            onClick={() => toggleSeat(seat.id)}
            className={`
              p-4 rounded-lg transition-all duration-300
              ${seat.masked ? 'bg-gray-800 text-gray-500' : 'bg-blue-100 text-blue-900'}
              hover:scale-105 focus:ring-2 focus:ring-blue-500
            `}
            aria-label={`${seat.masked ? 'Masked' : 'Visible'} seat containing ${seat.content}`}
          >
            <div className="flex items-center justify-center">
              {seat.masked ? <EyeOff size={20} /> : <Eye size={20} />}
              <span className="ml-2">{seat.content}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb className="text-blue-500 mr-2" />
          <span>Click seats to toggle masking</span>
        </div>
        
        {mode === "challenge" && (
          <button
            onClick={checkSolution}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Check <ArrowRight className="inline ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TheaterMaskingDemo;