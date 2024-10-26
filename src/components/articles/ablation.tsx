import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Eye, Cpu, MessageSquare } from "lucide-react";

const AblationDemo = () => {
  const [enabledFeatures, setEnabledFeatures] = useState({
    vision: true,
    language: true,
    reasoning: true,
    memory: true,
  });
  const [lastToggled, setLastToggled] = useState(null);

  const features = [
    { id: "vision", name: "Vision Module", icon: Eye, baseAccuracy: 25 },
    {
      id: "language",
      name: "Language Module",
      icon: MessageSquare,
      baseAccuracy: 30,
    },
    {
      id: "reasoning",
      name: "Reasoning Module",
      icon: Brain,
      baseAccuracy: 25,
    },
    { id: "memory", name: "Memory Module", icon: Cpu, baseAccuracy: 20 },
  ];

  const calculatePerformance = () => {
    let total = 0;
    features.forEach((feature) => {
      if (enabledFeatures[feature.id]) {
        total += feature.baseAccuracy;
      }
    });
    return total;
  };

  const toggleFeature = (featureId) => {
    setEnabledFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
    setLastToggled(featureId);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomFeature =
        features[Math.floor(Math.random() * features.length)];
      toggleFeature(randomFeature.id);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isRecentlyToggled = lastToggled === feature.id;
              return (
                <div
                  key={feature.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    enabledFeatures[feature.id]
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200 opacity-50"
                  } ${isRecentlyToggled ? "ring-2 ring-blue-400" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`transition-colors duration-300 ${
                          enabledFeatures[feature.id]
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        enabledFeatures[feature.id]
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${calculatePerformance()}%` }}
              />
            </div>
            <div className="text-right mt-2 font-medium">
              {calculatePerformance()}% Performance
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AblationDemo;
