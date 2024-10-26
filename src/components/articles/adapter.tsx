import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const AdapterConcept = () => {
  const [step, setStep] = useState(0);

  // Auto-advance the animation
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const input = "The movie was fantastic!";

  const scenarios = [
    {
      task: "Sentiment Analysis",
      description: "Identifies the emotional tone of text",
      output: "😊 Positive (Confidence: 92%)",
      adapterColor: "rgb(134, 239, 172)",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      highlightColor: "bg-green-100",
    },
    {
      task: "Language Translation",
      description: "Converts text to other languages",
      output: "Le film était fantastique !",
      adapterColor: "rgb(147, 197, 253)",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      highlightColor: "bg-blue-100",
    },
    {
      task: "Text Classification",
      description: "Categorizes text by topic or genre",
      output: "Category: Movie Review (Topic: Entertainment)",
      adapterColor: "rgb(251, 146, 60)",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      highlightColor: "bg-orange-100",
    },
  ];

  const currentScenario = scenarios[step];

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-center mb-2">
          Understanding AI Adapters
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          Watch how different adapters process the same input for different
          tasks
        </p>
      </CardHeader>
      <CardContent>
        <div
          className={`flex flex-col items-center space-y-8 p-6 rounded-lg transition-colors duration-500 ${currentScenario.bgColor}`}
        >
          {/* Task Header */}
          <div className="text-center">
            <div className="text-lg font-bold mb-1">{currentScenario.task}</div>
            <div className="text-sm text-gray-600">
              {currentScenario.description}
            </div>
          </div>

          {/* Model Visualization */}
          <div className="relative w-full h-64 flex items-center justify-center">
            {/* Input Text Box */}
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-64 p-4 rounded-lg ${currentScenario.highlightColor} ${currentScenario.borderColor} border-2`}
            >
              <div className="text-sm font-semibold mb-2">Input:</div>
              <div className="font-mono">{input}</div>
            </div>

            {/* Base Model */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-xl border-2 border-gray-300 flex flex-col items-center justify-center">
              <div className="text-center font-bold mb-2">
                Base Language Model
              </div>
              <div className="text-sm text-gray-500">Frozen Parameters</div>
              <div className="absolute bottom-0 w-full h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-400 animate-pulse"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Active Adapter */}
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-64 p-4 rounded-lg border-2 transition-all duration-500"
              style={{
                backgroundColor: currentScenario.adapterColor,
                borderColor: `rgba(0,0,0,0.1)`,
              }}
            >
              <div className="text-center mb-2 font-bold">
                {currentScenario.task} Adapter
              </div>
              <div className="text-sm">
                Specialized for {currentScenario.task.toLowerCase()}
              </div>
            </div>

            {/* Output Box */}
            <div
              className={`absolute right-4 bottom-0 w-64 p-4 rounded-lg ${currentScenario.highlightColor} ${currentScenario.borderColor} border-2`}
            >
              <div className="text-sm font-semibold mb-2">Output:</div>
              <div className="font-mono">{currentScenario.output}</div>
            </div>

            {/* Arrows */}
            <ArrowRight className="absolute left-72 top-1/2 transform -translate-y-1/2" />
            <ArrowRight className="absolute right-72 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Explanation */}
          <div className="text-sm text-gray-600 max-w-xl text-center">
            This adapter specializes the base model for{" "}
            {currentScenario.task.toLowerCase()}, adding this capability while
            keeping the original model unchanged. The same input produces
            different outputs based on the adapter's purpose.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdapterConcept;
