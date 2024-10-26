import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TEST_SCENARIOS = [
  {
    name: "Button Text",
    variantA: "Sign Up Now",
    variantB: "Start Free Trial",
    rateA: 0.12,
    rateB: 0.15,
  },
  {
    name: "Color Scheme",
    variantA: "Blue Button",
    variantB: "Green Button",
    rateA: 0.1,
    rateB: 0.11,
  },
  {
    name: "Page Layout",
    variantA: "Single Column",
    variantB: "Two Columns",
    rateA: 0.14,
    rateB: 0.12,
  },
];

const ABTestingDemo = () => {
  const [stats, setStats] = useState({
    a: { visitors: 0, conversions: 0 },
    b: { visitors: 0, conversions: 0 },
  });
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate user visits and conversions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isComplete) {
        setStats((prev) => {
          const scenario = TEST_SCENARIOS[currentScenario];
          const newA = simulateVisit(prev.a, scenario.rateA);
          const newB = simulateVisit(prev.b, scenario.rateB);

          if (newA.visitors >= 100 && newB.visitors >= 100) {
            setIsComplete(true);
          }

          return { a: newA, b: newB };
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isComplete, currentScenario]);

  // Auto-reset after completion
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setStats({
          a: { visitors: 0, conversions: 0 },
          b: { visitors: 0, conversions: 0 },
        });
        setIsComplete(false);
        setCurrentScenario((prev) => (prev + 1) % TEST_SCENARIOS.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [isComplete]);

  const simulateVisit = (version, conversionRate) => {
    const didConvert = Math.random() < conversionRate;
    return {
      visitors: version.visitors + 1,
      conversions: didConvert ? version.conversions + 1 : version.conversions,
    };
  };

  const getConversionRate = (conversions, visitors) => {
    if (visitors === 0) return 0;
    return ((conversions / visitors) * 100).toFixed(1);
  };

  const getProgressWidth = (visitors) => {
    return `${Math.min((visitors / 100) * 100, 100)}%`;
  };

  const scenario = TEST_SCENARIOS[currentScenario];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📊 A/B Testing: {scenario.name}</span>
          <span className="text-sm font-normal text-gray-500">
            Test {currentScenario + 1}/{TEST_SCENARIOS.length}
          </span>
        </CardTitle>
        <CardDescription>
          Testing {scenario.variantA} vs {scenario.variantB}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-2 text-center text-sm text-gray-500">
          {isComplete
            ? "Analysis complete! Starting next test soon..."
            : "Collecting data..."}
        </div>

        {/* Version A */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{scenario.variantA}</span>
            <span className="text-sm">
              {getConversionRate(stats.a.conversions, stats.a.visitors)}% (
              {stats.a.conversions}/{stats.a.visitors})
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: getProgressWidth(stats.a.visitors) }}
            />
          </div>
        </div>

        {/* Version B */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{scenario.variantB}</span>
            <span className="text-sm">
              {getConversionRate(stats.b.conversions, stats.b.visitors)}% (
              {stats.b.conversions}/{stats.b.visitors})
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: getProgressWidth(stats.b.visitors) }}
            />
          </div>
        </div>

        {/* Results */}
        {isComplete && (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="font-medium">
              {getConversionRate(stats.a.conversions, stats.a.visitors) >
              getConversionRate(stats.b.conversions, stats.b.visitors)
                ? `${scenario.variantA} performed better!`
                : `${scenario.variantB} performed better!`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Next test starting in 3 seconds...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ABTestingDemo;
