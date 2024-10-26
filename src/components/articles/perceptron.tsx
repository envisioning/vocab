import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PerceptronVisualization = () => {
  const [inputValues, setInputValues] = useState([0.8, 0.4]);
  const [weights] = useState([0.5, 0.5]);
  const [bias] = useState(-0.2);
  const [weightedSum, setWeightedSum] = useState(0);
  const [output, setOutput] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [calculations, setCalculations] = useState({
    products: [0, 0],
    sum: 0,
    withBias: 0,
  });

  const stepFunction = (x) => (x >= 0 ? 1 : 0);

  const calculateSteps = (inputs, weights, bias) => {
    const products = inputs.map((val, i) => val * weights[i]);
    const sum = products.reduce((a, b) => a + b, 0);
    const withBias = sum + bias;
    const output = stepFunction(withBias);

    return {
      products,
      sum,
      withBias,
      output,
    };
  };

  const generateNewInputs = () => {
    const shouldBeOne = Math.random() < 0.5;
    let x1, x2;

    if (shouldBeOne) {
      x1 = Math.random() * 0.4 + 0.3;
      x2 = Math.random() * 0.4 + 0.3;
    } else {
      x1 = Math.random() * 0.2;
      x2 = Math.random() * 0.2;
    }

    return [Math.round(x1 * 10) / 10, Math.round(x2 * 10) / 10];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);

      if (animationPhase === 3) {
        const newInputs = generateNewInputs();
        setInputValues(newInputs);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [animationPhase]);

  useEffect(() => {
    const steps = calculateSteps(inputValues, weights, bias);
    setCalculations({
      products: steps.products,
      sum: steps.sum,
      withBias: steps.withBias,
    });
    setWeightedSum(steps.withBias);
    setOutput(steps.output);
  }, [inputValues, weights, bias]);

  const getAnimationClass = (phase, targetPhase) => {
    return phase === targetPhase ? "opacity-100" : "opacity-30";
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Perceptron Visualization
        </h2>

        <div className="relative h-96">
          {/* Input Nodes */}
          <div className="absolute left-4 top-1/4 space-y-12">
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                0
              )}`}
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                <span className="font-mono">x₁={inputValues[0]}</span>
              </div>
            </div>
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                0
              )}`}
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                <span className="font-mono">x₂={inputValues[1]}</span>
              </div>
            </div>
          </div>

          {/* Weights and Products */}
          <div className="absolute left-32 top-1/3 space-y-16">
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                1
              )}`}
            >
              <div className="w-48 space-y-2">
                <div className="w-24 h-8 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center">
                  <span className="font-mono">w₁={weights[0]}</span>
                </div>
                <div className="w-40 h-8 bg-purple-50 border border-purple-200 rounded flex items-center justify-center">
                  <span className="font-mono">
                    {inputValues[0]} × {weights[0]} ={" "}
                    {calculations.products[0].toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                1
              )}`}
            >
              <div className="w-48 space-y-2">
                <div className="w-24 h-8 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center">
                  <span className="font-mono">w₂={weights[1]}</span>
                </div>
                <div className="w-40 h-8 bg-purple-50 border border-purple-200 rounded flex items-center justify-center">
                  <span className="font-mono">
                    {inputValues[1]} × {weights[1]} ={" "}
                    {calculations.products[1].toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summation */}
          <div className="absolute left-2/3 top-1/3 -translate-x-1/2">
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                2
              )}`}
            >
              <div className="w-48 space-y-4">
                <div className="w-32 h-32 rounded-full bg-purple-100 border-2 border-purple-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono">
                      Σ = {calculations.sum.toFixed(2)}
                    </div>
                    <div className="font-mono mt-2">+ bias</div>
                    <div className="font-mono">
                      {calculations.withBias.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="w-32 h-8 bg-yellow-100 border-2 border-yellow-500 rounded flex items-center justify-center">
                  <span className="font-mono">bias={bias}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="absolute right-4 top-1/3">
            <div
              className={`transition-opacity duration-500 ${getAnimationClass(
                animationPhase,
                3
              )}`}
            >
              <div className="w-32 space-y-2">
                <div className="w-24 h-24 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                  <span className="font-mono text-xl">{output}</span>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Output = {weightedSum.toFixed(2)} ≥ 0 ? 1 : 0
                </div>
              </div>
            </div>
          </div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full -z-10">
            <line
              x1="90"
              y1="120"
              x2="200"
              y2="140"
              stroke="currentColor"
              className="stroke-2 stroke-gray-400"
            />
            <line
              x1="90"
              y1="216"
              x2="200"
              y2="200"
              stroke="currentColor"
              className="stroke-2 stroke-gray-400"
            />
            <line
              x1="320"
              y1="170"
              x2="400"
              y2="170"
              stroke="currentColor"
              className="stroke-2 stroke-gray-400"
            />
            <line
              x1="480"
              y1="170"
              x2="560"
              y2="170"
              stroke="currentColor"
              className="stroke-2 stroke-gray-400"
            />
          </svg>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            How this Perceptron works:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              Input values (x₁, x₂) are multiplied by their weights (w₁, w₂)
            </li>
            <li>The weighted inputs are summed: (x₁·w₁ + x₂·w₂)</li>
            <li>A bias term is added to the sum</li>
            <li>
              If the final sum is ≥ 0, the output is 1; otherwise, it&apos;s 0
            </li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            This Perceptron implements a simple linear classifier. With weights
            [0.5, 0.5] and bias -0.2, it separates points where x₁ + x₂ ≥ 0.4
            (output 1) from points where x₁ + x₂ &lt; 0.4 (output 0).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerceptronVisualization;
