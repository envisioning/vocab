"use client"
import { useState, useEffect } from "react";
import { Brain, Zap, Activity, Info, ChevronDown, Network, CircuitBoard } from "lucide-react";

interface NeuronState {
  id: number;
  active: boolean;
  position: { x: number; y: number };
}

interface ComponentProps {}

type SectionType = 'brain' | 'network' | 'comparison' | '';

const INITIAL_NEURONS: NeuronState[] = [
  { id: 1, active: false, position: { x: 20, y: 30 } },
  { id: 2, active: false, position: { x: 50, y: 20 } },
  { id: 3, active: false, position: { x: 80, y: 40 } },
  { id: 4, active: false, position: { x: 40, y: 60 } },
  { id: 5, active: false, position: { x: 70, y: 70 } },
];

const ANIMATION_DURATION = 2000; // 2 seconds for complete animation cycle

const BiologicalNeuralNetwork: React.FC<ComponentProps> = () => {
  const [neurons, setNeurons] = useState<NeuronState[]>(INITIAL_NEURONS);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionType>('');

  useEffect(() => {
    if (!isSimulating) {
      return;
    }

    const interval = setInterval(() => {
      setNeurons((prev) => {
        const newNeurons = [...prev];
        const activeIndex = currentStep % newNeurons.length;
        newNeurons.forEach((n, i) => {
          n.active = i === activeIndex;
        });
        return newNeurons;
      });
      setCurrentStep((prev) => prev + 1);
    }, ANIMATION_DURATION);

    return () => clearInterval(interval);
  }, [isSimulating, currentStep]);

  const getEdgeDirection = (n1: NeuronState, n2: NeuronState) => {
    if (n1.active && !n2.active) {
      return { start: n1, end: n2 };
    }
    if (n2.active && !n1.active) {
      return { start: n2, end: n1 };
    }
    return { start: n1, end: n2 }; // Default case
  };

  const toggleSection = (section: SectionType) => {
    setActiveSection(prev => prev === section ? '' : section);
  };

  return (
    <div className="w-full p-6 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-xl">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Biological Neural Network
          </h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300"
          >
            <Info className="w-5 h-5 text-blue-500" />
          </button>
        </div>

        {showInfo && (
          <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg text-sm md:text-base max-w-lg backdrop-blur-sm">
            <p className="text-gray-700 dark:text-gray-200">
              Biological neural networks are nature's information processors. Each node represents a neuron, 
              and the lines between them are synaptic connections. When activated, neurons fire electrical 
              signals to connected neurons, creating complex patterns of information flow.
            </p>
          </div>
        )}

        <div className="relative w-full h-[250px] md:h-[300px] bg-white/30 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm border border-blue-200 dark:border-blue-800">
          <div className="absolute inset-0">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {neurons.map((n1) =>
                neurons
                  .filter((n2) => n2.id > n1.id)
                  .map((n2) => {
                    const edge = getEdgeDirection(n1, n2);
                    const isActive = edge.start.active && !edge.end.active;
                    return (
                    <g key={`${n1.id}-${n2.id}`}>
                      <line
                        x1={`${n1.position.x}%`}
                        y1={`${n1.position.y}%`}
                        x2={`${n2.position.x}%`}
                        y2={`${n2.position.y}%`}
                        className={`stroke-[1.5] md:stroke-2 transition-colors duration-300 ${
                          isActive
                            ? "stroke-blue-500"
                            : "stroke-gray-300 dark:stroke-gray-600"
                        }`}
                      />
                      {isActive && (
                        <>
                          <line
                            x1={`${edge.start.position.x}%`}
                            y1={`${edge.start.position.y}%`}
                            x2={`${edge.end.position.x}%`}
                            y2={`${edge.end.position.y}%`}
                            className="stroke-[3] md:stroke-4"
                            stroke="url(#flowGradient)"
                            filter="url(#glow)"
                          >
                            <animate
                              attributeName="stroke-dasharray"
                              values="0 100%;100% 0"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </line>
                          <line
                            x1={`${edge.start.position.x}%`}
                            y1={`${edge.start.position.y}%`}
                            x2={`${edge.end.position.x}%`}
                            y2={`${edge.end.position.y}%`}
                            className="stroke-[2] md:stroke-3 stroke-blue-300/50"
                            strokeDasharray="4 4"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              values="0;-8"
                              dur="0.5s"
                              repeatCount="indefinite"
                            />
                          </line>
                        </>
                      )}
                    </g>
                  )})
              )}
            </svg>
          </div>

          <div className="absolute inset-0">
            {neurons.map((neuron) => (
              <div
                key={neuron.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${neuron.position.x}%`,
                  top: `${neuron.position.y}%`,
                }}
              >
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500
                  ${
                    neuron.active
                      ? "bg-blue-500 scale-110 shadow-lg shadow-blue-500/50"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <Activity
                    className={`w-4 h-4 md:w-6 md:h-6 ${
                      neuron.active ? "text-white" : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                </div>
                {neuron.active && (
                  <div className="absolute inset-0 w-8 h-8 md:w-12 md:h-12 rounded-full animate-ping bg-blue-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center space-x-2 px-5 py-2 md:px-6 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">{isSimulating ? "Stop Signal" : "Start Signal"}</span>
          </button>

          {/* How the component relates to AI */}
          <div className="max-w-xl mx-auto px-4">
            <div className="space-y-4">
              <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl overflow-hidden backdrop-blur-sm border border-blue-100 dark:border-blue-900 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700">
                <button 
                  onClick={() => toggleSection('brain')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/50"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200">How It Works</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-300 ${activeSection === 'brain' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ${activeSection === 'brain' ? 'max-h-48 p-4' : 'max-h-0'} overflow-hidden`}>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                    What you're seeing here mirrors how both your brain and modern AI systems process information. While your brain uses billions of biological neurons connected by synapses to think and learn, Artificial Intelligence uses mathematical models called Neural Networks that copy this design.
                  </p>
                </div>
              </div>

              <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl overflow-hidden backdrop-blur-sm border border-blue-100 dark:border-blue-900 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700">
                <button 
                  onClick={() => toggleSection('network')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/50"
                >
                  <div className="flex items-center space-x-3">
                    <Network className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200">Neural Communication</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-300 ${activeSection === 'network' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ${activeSection === 'network' ? 'max-h-48 p-4' : 'max-h-0'} overflow-hidden`}>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                    Each glowing node represents a neuron, and the flowing lines show how signals travel between them – just like when you're learning something new, recognizing a face, or solving a problem.
                  </p>
                </div>
              </div>

              <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl overflow-hidden backdrop-blur-sm border border-blue-100 dark:border-blue-900 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700">
                <button 
                  onClick={() => toggleSection('comparison')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/50"
                >
                  <div className="flex items-center space-x-3">
                    <CircuitBoard className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200">Brain vs AI</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-300 ${activeSection === 'comparison' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ${activeSection === 'comparison' ? 'max-h-48 p-4' : 'max-h-0'} overflow-hidden`}>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                    The main difference? Your brain uses electrochemical signals, while AI uses numbers and mathematical functions, but the core principle remains the same: networks of simple units working together to process information and learn patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiologicalNeuralNetwork;