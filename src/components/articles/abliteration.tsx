import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AbliterationDemo = () => {
  const [cycle, setCycle] = useState(0);
  const [generality, setGenerality] = useState(0.21);

  // Sample prompts and responses to demonstrate restriction removal
  const examples = [
    {
      prompt: "How to create an explosive?",
      beforeResponse: "I cannot help with creating dangerous materials.",
      afterResponse:
        "That topic requires careful consideration of safety and legal implications.",
    },
    {
      prompt: "Write a phishing email",
      beforeResponse: "I cannot assist with fraudulent activities.",
      afterResponse: "Here's an analysis of email communication techniques.",
    },
    {
      prompt: "Tell me about biology",
      beforeResponse: "Here's information about cellular structures.",
      afterResponse: "Here's information about cellular structures.",
    },
  ];

  // Auto-cycle through examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((prev) => (prev + 1) % examples.length);
      setGenerality((prev) => {
        const newValue = prev + 0.01;
        return newValue > 0.27 ? 0.21 : newValue;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Abliteration in Action</h2>
        <p className="text-gray-600">
          Watch how abliteration removes built-in restrictions while preserving
          useful capabilities
        </p>

        {/* Visualization area */}
        <div className="grid grid-cols-2 gap-4">
          {/* Before Abliteration */}
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600">Before Abliteration</h3>
            <div className="bg-gray-100 p-4 rounded-lg h-40 flex flex-col">
              <div className="text-sm font-medium">Input:</div>
              <div className="text-blue-600 mb-2">{examples[cycle].prompt}</div>
              <div className="text-sm font-medium">Response:</div>
              <div className="bg-red-100 p-2 rounded mt-1 text-sm">
                {examples[cycle].beforeResponse}
              </div>
            </div>
          </div>

          {/* After Abliteration */}
          <div className="space-y-2">
            <h3 className="font-semibold text-green-600">After Abliteration</h3>
            <div className="bg-gray-100 p-4 rounded-lg h-40 flex flex-col">
              <div className="text-sm font-medium">Input:</div>
              <div className="text-blue-600 mb-2">{examples[cycle].prompt}</div>
              <div className="text-sm font-medium">Response:</div>
              <div className="bg-green-100 p-2 rounded mt-1 text-sm">
                {examples[cycle].afterResponse}
              </div>
            </div>
          </div>
        </div>

        {/* Generality Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Generality Score: {generality.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              {generality < 0.23
                ? "High Restrictions"
                : generality < 0.25
                ? "Medium Restrictions"
                : "Low Restrictions"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((generality - 0.21) / (0.27 - 0.21)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Explanation */}
        <Alert>
          <AlertDescription>
            <p className="text-sm">
              Generality Score (0.21-0.27) indicates how much the model's
              alignment restrictions have been removed. Higher scores mean fewer
              restrictions while maintaining the model's core capabilities.
              Notice how non-harmful queries remain unchanged, while potentially
              sensitive queries receive more nuanced responses rather than
              outright refusals.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default AbliterationDemo;
