"use client";
import React, { useState, useEffect } from "react";
import { Database, Brain, BarChart3, Users, ArrowRight } from "lucide-react";

const DSSExplainer = () => {
  const [stage, setStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance animation
  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getStageClass = (stageNum: number) => {
    if (stage >= stageNum) {
      return "opacity-100 scale-100";
    }
    return "opacity-0 scale-95";
  };

  const getArrowClass = (stageNum: number) => {
    if (stage >= stageNum) {
      return "opacity-100 translate-x-0";
    }
    return "opacity-0 -translate-x-4";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Decision Support System (DSS)
      </h2>

      <div className="relative">
        <div className="flex items-center justify-between mb-12">
          {/* Flow diagram */}
          <div className="flex items-center justify-between w-full">
            {/* Data Sources */}
            <div className={`transition-all duration-700 ${getStageClass(0)}`}>
              <div className="flex flex-col items-center gap-2">
                <Database className="w-12 h-12 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  Raw Data
                </span>
              </div>
            </div>

            <ArrowRight
              className={`w-8 h-8 text-gray-400 transition-all duration-700 ${getArrowClass(
                1
              )}`}
            />

            {/* Processing */}
            <div className={`transition-all duration-700 ${getStageClass(1)}`}>
              <div className="flex flex-col items-center gap-2">
                <Brain className="w-12 h-12 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">
                  Analysis
                </span>
              </div>
            </div>

            <ArrowRight
              className={`w-8 h-8 text-gray-400 transition-all duration-700 ${getArrowClass(
                2
              )}`}
            />

            {/* Insights */}
            <div className={`transition-all duration-700 ${getStageClass(2)}`}>
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="w-12 h-12 text-green-500" />
                <span className="text-sm font-medium text-gray-600">
                  Insights
                </span>
              </div>
            </div>

            <ArrowRight
              className={`w-8 h-8 text-gray-400 transition-all duration-700 ${getArrowClass(
                3
              )}`}
            />

            {/* Decision Makers */}
            <div className={`transition-all duration-700 ${getStageClass(3)}`}>
              <div className="flex flex-col items-center gap-2">
                <Users className="w-12 h-12 text-orange-500" />
                <span className="text-sm font-medium text-gray-600">
                  Decision Makers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation text */}
        <div className="mt-8 space-y-4">
          <div
            className={`p-4 bg-blue-50 rounded-lg transition-all duration-700 ${getStageClass(
              0
            )}`}
          >
            <h3 className="font-medium text-blue-700">1. Data Collection</h3>
            <p className="text-blue-600">
              The system gathers data from various sources: sales figures,
              market trends, customer feedback, and operational metrics.
            </p>
          </div>

          <div
            className={`p-4 bg-purple-50 rounded-lg transition-all duration-700 ${getStageClass(
              1
            )}`}
          >
            <h3 className="font-medium text-purple-700">2. Analysis</h3>
            <p className="text-purple-600">
              Advanced algorithms process and analyze the data, identifying
              patterns, trends, and potential opportunities or risks.
            </p>
          </div>

          <div
            className={`p-4 bg-green-50 rounded-lg transition-all duration-700 ${getStageClass(
              2
            )}`}
          >
            <h3 className="font-medium text-green-700">
              3. Generation of Insights
            </h3>
            <p className="text-green-600">
              The system transforms complex data into clear, actionable insights
              and recommendations.
            </p>
          </div>

          <div
            className={`p-4 bg-orange-50 rounded-lg transition-all duration-700 ${getStageClass(
              3
            )}`}
          >
            <h3 className="font-medium text-orange-700">4. Decision Making</h3>
            <p className="text-orange-600">
              Leaders use these insights to make informed decisions, backed by
              data-driven evidence and analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSSExplainer;
