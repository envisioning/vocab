"use client"
import { useState, useEffect } from "react";
import { AlertTriangle, Check, XCircle, ChevronRight, ChevronLeft, RefreshCw } from "lucide-react";

interface ComponentProps {}

type AIFeature = {
  id: string;
  name: string;
  risk: number;
  description: string;
};

type SafetyMeasure = {
  id: string;
  name: string;
  description: string;
};

const AI_FEATURES: AIFeature[] = [
  { id: "1", name: "Simple Chatbot", risk: 1, description: "Basic conversational AI" },
  { id: "2", name: "Recommendation System", risk: 2, description: "Suggests products or content" },
  { id: "3", name: "Autonomous Vehicle", risk: 4, description: "Self-driving car AI" },
  { id: "4", name: "Medical Diagnosis", risk: 3, description: "Assists in medical diagnoses" },
  { id: "5", name: "Large Language Model", risk: 5, description: "Advanced text generation AI" },
];

const SAFETY_MEASURES: SafetyMeasure[] = [
  { id: "1", name: "Basic Testing", description: "Standard quality assurance tests" },
  { id: "2", name: "Ethical Review", description: "Assessment of ethical implications" },
  { id: "3", name: "Extensive Monitoring", description: "Continuous performance tracking" },
  { id: "4", name: "Human Oversight", description: "Direct human supervision" },
  { id: "5", name: "Strict Regulations", description: "Compliance with legal frameworks" },
];

const AISafetyLevelSimulator: React.FC<ComponentProps> = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<AIFeature[]>([]);
  const [safetyLevel, setSafetyLevel] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const totalRisk = selectedFeatures.reduce((sum, feature) => sum + feature.risk, 0);
    setSafetyLevel(Math.min(Math.round(totalRisk / 2), 5));
  }, [selectedFeatures]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleFeatureToggle = (feature: AIFeature) => {
    setSelectedFeatures((prev) =>
      prev.some((f) => f.id === feature.id)
        ? prev.filter((f) => f.id !== feature.id)
        : [...prev, feature]
    );
  };

  const getSafetyColor = (level: number) => {
    if (level <= 2) return "text-green-500";
    if (level <= 4) return "text-yellow-500";
    return "text-red-500";
  };

  const getSafetyIcon = (level: number) => {
    if (level <= 2) return <Check className="w-6 h-6 text-green-500" />;
    if (level <= 4) return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Select AI Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {AI_FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`p-2 rounded ${
                    selectedFeatures.some((f) => f.id === feature.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {feature.name}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">AI Safety Level</h2>
            <div className="flex items-center space-x-2">
              {getSafetyIcon(safetyLevel)}
              <span className={`text-2xl font-bold ${getSafetyColor(safetyLevel)}`}>
                Level {safetyLevel}
              </span>
            </div>
            <p>
              {safetyLevel <= 2
                ? "Low risk: Basic safety measures needed."
                : safetyLevel <= 4
                ? "Medium risk: Careful oversight required."
                : "High risk: Strict regulations and extensive safeguards necessary."}
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Recommended Safety Measures</h2>
            <ul className="list-disc pl-5">
              {SAFETY_MEASURES.slice(0, safetyLevel).map((measure) => (
                <li key={measure.id}>
                  <strong>{measure.name}:</strong> {measure.description}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI Safety Level Simulator</h1>
      {renderStep()}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => (prev - 1 + 3) % 3)}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentStep((prev) => (prev + 1) % 3)}
          className="p-2 bg-blue-500 text-white rounded"
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <button
        onClick={() => {
          setSelectedFeatures([]);
          setSafetyLevel(0);
          setCurrentStep(0);
        }}
        className="mt-4 p-2 bg-gray-500 text-white rounded flex items-center"
        aria-label="Reset simulator"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset
      </button>
    </div>
  );
};

export default AISafetyLevelSimulator;