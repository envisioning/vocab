"use client"
import { useState, useEffect } from "react";
import { Puzzle, ArrowRight, Brain, Split, CheckCircle, HelpCircle, Lightbulb } from "lucide-react";

interface DecompositionStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  tooltip: string;
}

export default function DecompositionVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const steps: DecompositionStep[] = [
    {
      id: 1,
      title: "Complex Problem",
      description: "Your challenge: Create a social media app",
      icon: <Brain className="w-16 h-16" />,
      tooltip: "Start with understanding the big picture of your challenge"
    },
    {
      id: 2,
      title: "Break it Down",
      description: "User Auth | Posts | Comments | Likes | Profile",
      icon: <Split className="w-16 h-16" />,
      tooltip: "Divide the main problem into smaller, manageable pieces"
    },
    {
      id: 3,
      title: "Solve & Connect",
      description: "Tackle each piece, then unite them",
      icon: <Puzzle className="w-16 h-16" />,
      tooltip: "Solve each part independently, then combine solutions"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleStepClick = (index: number) => {
    setIsAnimating(true);
    setActiveStep(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Problem Decomposition
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -rotate-12 translate-x-8 -translate-y-8">
            <div className="w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative group cursor-pointer transition-all duration-500 
                  ${activeStep === index ? 'transform scale-105' : 'opacity-70 hover:opacity-100'}
                  ${isAnimating ? 'animate-pulse' : ''}`}
                onClick={() => handleStepClick(index)}
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className={`p-6 rounded-xl transition-colors duration-300 
                  ${activeStep === index ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}
                  flex flex-col items-center gap-4 relative`}>
                  {step.icon}
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-center">{step.description}</p>
                  
                  {showTooltip === index && (
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm rounded-lg px-4 py-2 w-48 text-center">
                      {step.tooltip}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                        <div className="border-8 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <p className="text-gray-600 dark:text-gray-300 italic">
              Click each step to see how decomposition works in practice
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <ArrowRight className="w-6 h-6 text-blue-500 animate-bounce" />
          </div>
        </div>

        <div className="mt-8 bg-blue-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pro Tip: Breaking down problems makes complex challenges manageable!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}