import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Bird,
  Fish,
  Plane,
  Bug,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const ZeroShotLearningDemo = () => {
  const [step, setStep] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  const trainingExamples = [
    {
      icon: Bird,
      name: "Bird",
      attributes: [
        { name: "has_wings", color: "bg-blue-200" },
        { name: "can_fly", color: "bg-green-200" },
        { name: "has_feathers", color: "bg-yellow-200" },
      ],
    },
    {
      icon: Fish,
      name: "Fish",
      attributes: [
        { name: "has_fins", color: "bg-blue-200" },
        { name: "can_swim", color: "bg-green-200" },
        { name: "has_scales", color: "bg-yellow-200" },
      ],
    },
    {
      icon: Plane,
      name: "Airplane",
      attributes: [
        { name: "has_wings", color: "bg-blue-200" },
        { name: "can_fly", color: "bg-green-200" },
        { name: "made_of_metal", color: "bg-yellow-200" },
      ],
    },
  ];

  const newExamples = [
    {
      icon: Bug,
      name: "New Flying Insect",
      attributes: [
        { name: "has_wings", color: "bg-blue-200" },
        { name: "can_fly", color: "bg-green-200" },
      ],
    },
    {
      icon: HelpCircle,
      name: "Unknown Sea Creature",
      attributes: [
        { name: "has_fins", color: "bg-blue-200" },
        { name: "can_swim", color: "bg-green-200" },
      ],
    },
  ];

  // Auto-advance animation
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev === 3) {
          setCurrentExample((curr) => (curr + 1) % newExamples.length);
          return 0;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const TrainingExamples = () => (
    <div className="flex-1 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Training Data</h3>
      <div className="space-y-4">
        {trainingExamples.map((example, idx) => {
          const Icon = example.icon;
          return (
            <div key={example.name} className="flex items-center space-x-4">
              <Icon
                className={`w-10 h-10 ${
                  step >= 1 ? "text-blue-500" : "text-gray-300"
                } transition-colors duration-500`}
              />
              <div className="flex flex-col space-y-1">
                <span className="font-medium">{example.name}</span>
                <div className="flex flex-wrap gap-1">
                  {example.attributes.map((attr) => (
                    <span
                      key={attr.name}
                      className={`px-2 py-0.5 text-sm rounded ${attr.color} ${
                        step >= 1 ? "opacity-100" : "opacity-40"
                      } transition-opacity duration-500`}
                    >
                      {attr.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const NewExample = () => {
    const example = newExamples[currentExample];
    const Icon = example.icon;

    return (
      <div className="flex-1 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">New Unseen Object</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon
              className={`w-12 h-12 ${
                step >= 2 ? "text-orange-500" : "text-gray-300"
              } transition-colors duration-500`}
            />
            {step === 3 && (
              <CheckCircle2 className="w-6 h-6 text-green-500 absolute -top-2 -right-2" />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">{example.name}</span>
            <div className="flex flex-wrap gap-1">
              {example.attributes.map((attr) => (
                <span
                  key={attr.name}
                  className={`px-2 py-0.5 text-sm rounded ${attr.color} ${
                    step === 3 ? "opacity-100" : "opacity-40"
                  } transition-opacity duration-500`}
                >
                  {attr.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              Zero-Shot Learning Visualization
            </h2>
            <p className="text-gray-600">
              Learning to recognize new objects based on shared attributes
            </p>
          </div>

          <div className="w-full flex items-center justify-between space-x-8">
            <TrainingExamples />

            <div className="flex flex-col items-center space-y-2">
              <Brain
                className={`w-16 h-16 ${
                  step >= 1 ? "text-purple-500" : "text-gray-400"
                } transition-colors duration-500`}
              />
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>

            <NewExample />
          </div>

          <div className="text-center text-lg">
            {step === 0 && (
              <p className="text-gray-600">Analyzing training examples...</p>
            )}
            {step === 1 && (
              <p className="text-blue-600">
                Learning attribute patterns and relationships...
              </p>
            )}
            {step === 2 && (
              <p className="text-purple-600">
                Encountering new, unseen object...
              </p>
            )}
            {step === 3 && (
              <p className="text-green-600">
                Recognized {newExamples[currentExample].name.toLowerCase()}{" "}
                based on shared attributes!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZeroShotLearningDemo;
