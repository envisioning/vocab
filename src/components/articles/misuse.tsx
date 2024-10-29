"use client";
import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Scale, Lightbulb, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface UseCaseType {
  id: number;
  technology: string;
  goodUse: string;
  badUse: string;
  impact: number;
}

const AIUseCases: UseCaseType[] = [
  {
    id: 1,
    technology: "Facial Recognition",
    goodUse: "Finding missing children",
    badUse: "Unauthorized surveillance",
    impact: 8
  },
  {
    id: 2, 
    technology: "Content Generation",
    goodUse: "Creative writing assistance",
    badUse: "Plagiarism and cheating",
    impact: 7
  },
  {
    id: 3,
    technology: "Deepfake Technology",
    goodUse: "Educational videos",
    badUse: "Spreading misinformation",
    impact: 9
  }
];

export default function MisuseExplorer() {
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [isEthical, setIsEthical] = useState<boolean>(true);
  const [showImpact, setShowImpact] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % AIUseCases.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsEthical(sliderValue < 50);
    setShowImpact(sliderValue === 0 || sliderValue === 100);
  }, [sliderValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" role="main" aria-label="AI Misuse Explorer">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">AI Ethics Explorer</h1>
        </div>
        <Scale className="w-8 h-8 text-gray-600" />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{AIUseCases[currentCase].technology}</h2>
          {isEthical ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>

        <div className="relative mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Ethics slider"
          />
          <div className="flex justify-between mt-2">
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-green-500" />
              Beneficial Use
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Potential Misuse
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${isEthical ? 'bg-green-50' : 'bg-gray-50'}`}>
            <h3 className="font-medium mb-2">Beneficial Application</h3>
            <p>{AIUseCases[currentCase].goodUse}</p>
          </div>
          <div className={`p-4 rounded-lg ${!isEthical ? 'bg-red-50' : 'bg-gray-50'}`}>
            <h3 className="font-medium mb-2">Potential Misuse</h3>
            <p>{AIUseCases[currentCase].badUse}</p>
          </div>
        </div>

        {showImpact && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg" role="alert">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Societal Impact Level: {AIUseCases[currentCase].impact}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}