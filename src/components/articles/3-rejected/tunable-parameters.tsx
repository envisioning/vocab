"use client"
import { useState, useEffect } from "react";
import { Sliders, Music, Camera, ChefHat, Target, ArrowRight, Sparkles } from "lucide-react";

interface Parameter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

const TunableParameters = () => {
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [score, setScore] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(75);
  const [output, setOutput] = useState<number>(0);

  const scenarios = [
    {
      title: "Music Studio",
      icon: Music,
      params: [
        { name: "Bass", value: 50, min: 0, max: 100, step: 1 },
        { name: "Treble", value: 50, min: 0, max: 100, step: 1 },
        { name: "Volume", value: 50, min: 0, max: 100, step: 1 }
      ]
    },
    {
      title: "Camera Settings",
      icon: Camera,
      params: [
        { name: "ISO", value: 50, min: 0, max: 100, step: 1 },
        { name: "Aperture", value: 50, min: 0, max: 100, step: 1 },
        { name: "Shutter", value: 50, min: 0, max: 100, step: 1 }
      ]
    },
    {
      title: "Recipe Tuning",
      icon: ChefHat,
      params: [
        { name: "Temperature", value: 50, min: 0, max: 100, step: 1 },
        { name: "Time", value: 50, min: 0, max: 100, step: 1 },
        { name: "Ingredients", value: 50, min: 0, max: 100, step: 1 }
      ]
    }
  ];

  useEffect(() => {
    setParameters(scenarios[activeScenario].params);
  }, [activeScenario]);

  useEffect(() => {
    const calculateOutput = () => {
      const sum = parameters.reduce((acc, param) => acc + param.value, 0);
      const avg = sum / parameters.length;
      setOutput(Math.round(avg));
      
      if (Math.abs(avg - targetValue) < 5) {
        setScore(prev => prev + 10);
      }
    };

    calculateOutput();
  }, [parameters, targetValue]);

  const handleParameterChange = (index: number, newValue: number) => {
    const updatedParams = [...parameters];
    updatedParams[index].value = newValue;
    setParameters(updatedParams);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Sliders className="w-6 h-6" />
        Parameter Playground
      </h2>

      <div className="flex gap-4 mb-8">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.title}
            onClick={() => setActiveScenario(index)}
            className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-300
              ${activeScenario === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-pressed={activeScenario === index}
          >
            <scenario.icon className="w-5 h-5" />
            {scenario.title}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Target className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-semibold">Target: {targetValue}</span>
          <ArrowRight className="w-6 h-6" />
          <span className="text-lg font-semibold">Current: {output}</span>
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-semibold">Score: {score}</span>
        </div>

        <div className="space-y-6">
          {parameters.map((param, index) => (
            <div key={param.name} className="space-y-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                {param.name}
                <span>{param.value}</span>
              </label>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => handleParameterChange(index, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label={`Adjust ${param.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TunableParameters;