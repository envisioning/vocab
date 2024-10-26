import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Camera, Dog, CircleDot, Coffee, Bike } from "lucide-react";

const ExplainabilityDemo = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [step, setStep] = useState(0);

  const examples = [
    {
      icon: Dog,
      features: [
        { name: "Has Fur", confidence: 0.9 },
        { name: "Four Legs", confidence: 0.85 },
        { name: "Tail", confidence: 0.95 },
        { name: "Pointy Ears", confidence: 0.8 },
      ],
      classification: "Dog",
      confidence: 0.95,
      color: "blue",
    },
    {
      icon: Coffee,
      features: [
        { name: "Round Shape", confidence: 0.95 },
        { name: "Handle", confidence: 0.98 },
        { name: "Steam", confidence: 0.75 },
        { name: "Liquid Inside", confidence: 0.88 },
      ],
      classification: "Coffee Cup",
      confidence: 0.92,
      color: "amber",
    },
    {
      icon: Bike,
      features: [
        { name: "Two Wheels", confidence: 0.99 },
        { name: "Handlebars", confidence: 0.96 },
        { name: "Pedals", confidence: 0.92 },
        { name: "Chain", confidence: 0.85 },
      ],
      classification: "Bicycle",
      confidence: 0.97,
      color: "green",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => {
        setStep((prev) => {
          if (prev === 3) {
            setCurrentExample(
              (prevExample) => (prevExample + 1) % examples.length
            );
            return 0;
          }
          return prev + 1;
        });
      },
      step === 2 ? 4000 : 2000
    ); // Classification stays longer

    return () => clearInterval(timer);
  }, [step]);

  const currentItem = examples[currentExample];
  const Icon = currentItem.icon;

  return (
    <Card className="w-full max-w-2xl p-6 bg-white">
      <div className="space-y-6">
        <div className="flex justify-center space-x-8 items-center">
          {/* Input Image */}
          <div
            className={`transition-opacity duration-500 ${
              step === 0 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`border-2 border-${currentItem.color}-500 p-4 rounded-lg`}
            >
              <Icon size={64} className={`text-${currentItem.color}-500`} />
              <p className="mt-2 text-center">Input Image</p>
            </div>
          </div>

          {/* Feature Analysis */}
          <div
            className={`transition-opacity duration-500 ${
              step === 1 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div className="space-y-2">
              {currentItem.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CircleDot
                    size={16}
                    className={`text-${currentItem.color}-500`}
                  />
                  <span className="text-sm">{feature.name}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full bg-${currentItem.color}-500 rounded-full transition-all duration-1000`}
                      style={{
                        width:
                          step >= 1 ? `${feature.confidence * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Decision */}
          <div
            className={`transition-opacity duration-500 ${
              step >= 2 ? "opacity-100" : "opacity-40"
            }`}
          >
            <div
              className={`border-2 border-${currentItem.color}-500 p-4 rounded-lg text-center`}
            >
              <p className="font-bold">Classification:</p>
              <p className={`text-${currentItem.color}-600 text-lg`}>
                {currentItem.classification} (
                {Math.round(currentItem.confidence * 100)}% confidence)
              </p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div
          className={`bg-gray-50 p-4 rounded-lg transition-opacity duration-500 ${
            step === 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-gray-700">
            "I classified this as a {currentItem.classification.toLowerCase()}{" "}
            because I detected key features:
            {currentItem.features.map(
              (feature, index, arr) =>
                `${
                  index === arr.length - 1 ? " and " : index === 0 ? " " : ", "
                }${feature.name.toLowerCase()} (${Math.round(
                  feature.confidence * 100
                )}% confidence)`
            )}
            ."
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ExplainabilityDemo;
