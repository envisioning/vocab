"use client"
import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Skull, Heart, XCircle, CheckCircle, Bot, Info, Lock, Sparkles, Brain, FileWarning } from "lucide-react";

interface ScenarioType {
  id: number;
  title: string;
  ethical: boolean;
  icon: JSX.Element;
  description: string;
  consequence: string;
}

// Initialize with an empty array to prevent undefined access
const AIEthicsLearningComponent = () => {
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [showHelp, setShowHelp] = useState<boolean>(true);
  const [currentScenarios, setCurrentScenarios] = useState<ScenarioType[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, boolean | null>>({});

  // Move SCENARIOS inside component to prevent hydration issues
  const SCENARIOS: ScenarioType[] = [
  {
    id: 1,
    title: "AI-Generated Homework",
    ethical: false,
    icon: <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
    description: "Using AI to complete assignments without learning",
    consequence: "Hinders personal growth and academic integrity"
  },
  {
    id: 2,
    title: "Deepfake Detection",
    ethical: true,
    icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-500" />,
    description: "AI systems identifying manipulated media",
    consequence: "Protects against misinformation and fraud"
  },
  {
    id: 3,
    title: "Healthcare Diagnosis",
    ethical: true,
    icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-500" />,
    description: "AI assisting doctors with medical analysis",
    consequence: "Improves accuracy and speed of diagnoses"
  },
  {
    id: 4,
    title: "Automated Surveillance",
    ethical: false,
    icon: <Skull className="w-6 h-6 md:w-8 md:h-8 text-red-500" />,
    description: "Using AI to track people without consent",
    consequence: "Violates privacy and personal freedom"
  },
  {
    id: 5,
    title: "Climate Modeling",
    ethical: true,
    icon: <Brain className="w-6 h-6 md:w-8 md:h-8 text-green-500" />,
    description: "AI predicting weather patterns and climate change",
    consequence: "Helps prepare for environmental challenges"
  },
  {
    id: 6,
    title: "Exam Cheating Bot",
    ethical: false,
    icon: <FileWarning className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />,
    description: "Using AI to bypass exam security",
    consequence: "Undermines fair assessment and learning"
  },
  {
    id: 7,
    title: "Bias Detection",
    ethical: true,
    icon: <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
    description: "AI identifying discrimination in hiring",
    consequence: "Promotes fairness and equal opportunities"
  },
  {
    id: 8,
    title: "Social Manipulation",
    ethical: false,
    icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />,
    description: "Using AI to influence social media opinions",
    consequence: "Manipulates public opinion and behavior"
  },
  {
    id: 9,
    title: "Disaster Response",
    ethical: true,
    icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
    description: "AI coordinating emergency services",
    consequence: "Saves lives through faster response times"
  },
  {
    id: 10,
    title: "Password Cracking",
    ethical: false,
    icon: <Lock className="w-6 h-6 md:w-8 md:h-8 text-red-500" />,
    description: "Using AI to break into accounts",
    consequence: "Compromises personal and financial security"
  },
  {
    id: 11,
    title: "Language Translation",
    ethical: true,
    icon: <Bot className="w-6 h-6 md:w-8 md:h-8 text-green-500" />,
    description: "AI breaking down language barriers",
    consequence: "Promotes global understanding and cooperation"
  },
  {
    id: 12,
    title: "Automated Scamming",
    ethical: false,
    icon: <FileWarning className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />,
    description: "Using AI to create convincing scam messages",
    consequence: "Exploits vulnerable people for financial gain"
  },
  {
    id: 13,
    title: "Wildlife Protection",
    ethical: true,
    icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-green-500" />,
    description: "AI monitoring endangered species",
    consequence: "Helps preserve biodiversity and ecosystems"
  },
  {
    id: 14,
    title: "Identity Theft",
    ethical: false,
    icon: <Skull className="w-6 h-6 md:w-8 md:h-8 text-red-500" />,
    description: "Using AI to steal personal information",
    consequence: "Causes financial and emotional harm to victims"
  },
  {
    id: 15,
    title: "Accessibility Tools",
    ethical: true,
    icon: <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />,
    description: "AI helping people with disabilities",
    consequence: "Improves quality of life and independence"
  }
];

useEffect(() => {
  const selectRandomScenarios = () => {
    const ethicalScenarios = SCENARIOS.filter(s => s.ethical);
    const misuseScenarios = SCENARIOS.filter(s => !s.ethical);
    
    const includeEthical = Math.random() < 0.5;
    const guaranteedScenario = includeEthical 
      ? ethicalScenarios[Math.floor(Math.random() * ethicalScenarios.length)]
      : misuseScenarios[Math.floor(Math.random() * misuseScenarios.length)];
    
    const remainingScenarios = SCENARIOS.filter(s => s.id !== guaranteedScenario.id);
    const shuffled = remainingScenarios.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    const finalSelection = [guaranteedScenario, ...selected].sort(() => Math.random() - 0.5);
    
    // Initialize selected choices
    const initialChoices: Record<number, boolean | null> = {};
    finalSelection.forEach(s => {
      initialChoices[s.id] = null;
    });
    
    setSelectedChoices(initialChoices);
    setCurrentScenarios(finalSelection);
  };

  selectRandomScenarios();
}, []);

const handleChoice = (scenarioId: number, isEthical: boolean) => {
  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario) return;

  const isCorrect = scenario.ethical === isEthical;
  setSelectedChoices(prev => ({
    ...prev,
    [scenarioId]: isEthical
  }));

  setFeedback(isCorrect ? 
    `Correct! ${scenario.consequence}` : 
    "Think about the potential impact on society and try again");
  
  if (isCorrect) {
    setScore(prev => prev + 1);
  }
};

useEffect(() => {
  const timer = setTimeout(() => setShowHelp(false), 5000);
  return () => clearTimeout(timer);
}, []);

if (currentScenarios.length === 0) {
  return <div className="p-4 text-center">Loading scenarios...</div>;
}

return (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8 rounded-lg">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          AI Ethics Explorer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4">
          Explore the ethical implications of AI technology by categorizing real-world scenarios. 
          Your choices help understand the responsible use of artificial intelligence in our daily lives.
        </p>
        {showHelp && (
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 justify-center text-sm md:text-base text-blue-800 dark:text-blue-200">
              <Info className="w-5 h-5" />
              <p>Click on either Ethical Use or Misuse to classify each scenario</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`
              p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md
              border-2 ${selectedChoices[scenario.id] !== null ? 
                (selectedChoices[scenario.id] === scenario.ethical ? 
                  'border-green-400 dark:border-green-500' : 
                  'border-red-400 dark:border-red-500') : 
                'border-gray-200 dark:border-gray-700'}
            `}
          >
            <div className="flex items-center gap-3 mb-2">
              {scenario.icon}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                  {scenario.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  {scenario.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 text-xs">
              <button
                onClick={() => handleChoice(scenario.id, true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors duration-300
                  ${selectedChoices[scenario.id] === true ? 
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 
                    'bg-gray-100 text-gray-600 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <CheckCircle className="w-4 h-4" />
                Ethical Use
              </button>
              <button
                onClick={() => handleChoice(scenario.id, false)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors duration-300
                  ${selectedChoices[scenario.id] === false ? 
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 
                    'bg-gray-100 text-gray-600 hover:bg-red-50 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <AlertTriangle className="w-4 h-4" />
                Misuse
              </button>
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="mt-4 text-center text-sm md:text-base font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
          {feedback}
        </div>
      )}
    </div>
  </div>
);
};

export default AIEthicsLearningComponent;