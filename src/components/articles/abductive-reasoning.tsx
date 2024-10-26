import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Umbrella,
  Cloud,
  Sun,
  Droplets,
  Car,
  Wrench,
  Battery,
  Lightbulb,
  Coffee,
  Moon,
  Clock,
  Bed,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AbductiveReasoningDemo = () => {
  const [step, setStep] = useState(0);
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(4000);

  const scenarios = [
    {
      observation: "The ground is wet",
      explanations: [
        {
          id: 1,
          text: "It rained recently",
          probability: "Most Likely",
          icon: Cloud,
        },
        {
          id: 2,
          text: "A sprinkler was on",
          probability: "Possible",
          icon: Droplets,
        },
        {
          id: 3,
          text: "Someone spilled water",
          probability: "Least Likely",
          icon: Umbrella,
        },
      ],
    },
    {
      observation: "Car won't start",
      explanations: [
        {
          id: 1,
          text: "Dead battery",
          probability: "Most Likely",
          icon: Battery,
        },
        {
          id: 2,
          text: "Faulty starter",
          probability: "Possible",
          icon: Wrench,
        },
        { id: 3, text: "Out of gas", probability: "Least Likely", icon: Car },
      ],
    },
    {
      observation: "Person is yawning",
      explanations: [
        {
          id: 1,
          text: "They're tired",
          probability: "Most Likely",
          icon: Moon,
        },
        { id: 2, text: "They're bored", probability: "Possible", icon: Clock },
        {
          id: 3,
          text: "They need fresh air",
          probability: "Least Likely",
          icon: Cloud,
        },
      ],
    },
    {
      observation: "Light bulb stopped working",
      explanations: [
        {
          id: 1,
          text: "Bulb burned out",
          probability: "Most Likely",
          icon: Lightbulb,
        },
        { id: 2, text: "Power outage", probability: "Possible", icon: Battery },
        {
          id: 3,
          text: "Faulty wiring",
          probability: "Least Likely",
          icon: Wrench,
        },
      ],
    },
    {
      observation: "Person has headache",
      explanations: [
        {
          id: 1,
          text: "Stress or tension",
          probability: "Most Likely",
          icon: Clock,
        },
        { id: 2, text: "Lack of sleep", probability: "Possible", icon: Bed },
        {
          id: 3,
          text: "Too much caffeine",
          probability: "Least Likely",
          icon: Coffee,
        },
      ],
    },
  ];

  const currentScenario = scenarios[step % scenarios.length];

  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      // First, select the most likely explanation
      setSelectedExplanation(currentScenario.explanations[0]);

      // Then, after a delay, move to the next scenario
      timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, autoPlaySpeed);
    }
    return () => clearTimeout(timer);
  }, [step, isAutoPlaying, autoPlaySpeed]);

  const handleExplanationClick = (explanation) => {
    setSelectedExplanation(explanation);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Understanding Abductive Reasoning
        </CardTitle>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAutoPlaying}
              onCheckedChange={setIsAutoPlaying}
            />
            <span>Autoplay</span>
          </div>
          {isAutoPlaying && (
            <div className="flex items-center space-x-2">
              <span>Speed:</span>
              <select
                className="p-1 border rounded"
                value={autoPlaySpeed}
                onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
              >
                <option value={2000}>Fast</option>
                <option value={4000}>Normal</option>
                <option value={6000}>Slow</option>
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Observation</h3>
            <p className="text-lg">{currentScenario.observation}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Possible Explanations
            </h3>
            <div className="grid gap-4">
              {currentScenario.explanations.map((explanation) => {
                const Icon = explanation.icon;
                return (
                  <Button
                    key={explanation.id}
                    variant="outline"
                    className={`p-4 flex items-center justify-between w-full transition-all duration-300 ${
                      selectedExplanation?.id === explanation.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleExplanationClick(explanation)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{explanation.text}</span>
                    </div>
                    <span
                      className={`text-sm ${
                        explanation.probability === "Most Likely"
                          ? "text-green-600"
                          : explanation.probability === "Possible"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {explanation.probability}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {selectedExplanation && (
            <div className="p-4 bg-gray-50 rounded-lg animate-fade-in">
              <p className="text-center">
                <span className="font-semibold">Abductive Reasoning:</span> We
                choose "{selectedExplanation.text}" as{" "}
                {selectedExplanation.probability.toLowerCase()} explanation
                because it's the simplest and most common reason for this
                observation in our experience.
              </p>
            </div>
          )}

          {!isAutoPlaying && (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setStep((prev) => prev + 1);
                  setSelectedExplanation(null);
                }}
                className="mt-4"
              >
                Try Another Example
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AbductiveReasoningDemo;
