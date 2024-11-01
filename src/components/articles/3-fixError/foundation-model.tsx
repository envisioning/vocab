"use client"
import { useState, useEffect } from "react";
import { Brain, Database, Zap, Code, Image, Music, MessageSquare, Info, ArrowRight, Sparkles } from "lucide-react";

interface Task {
  id: number;
  icon: JSX.Element;
  name: string;
  description: string;
}

const FoundationModelDemo = () => {
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [neuralActivity, setNeuralActivity] = useState<boolean>(false);

  const tasks: Task[] = [
    { id: 1, icon: <Code size={24} />, name: "Code Generation", description: "Creates and completes programming code across languages" },
    { id: 2, icon: <Image size={24} />, name: "Image Analysis", description: "Understands and describes visual content in detail" },
    { id: 3, icon: <Music size={24} />, name: "Music Creation", description: "Composes and generates musical patterns" },
    { id: 4, icon: <MessageSquare size={24} />, name: "Text Generation", description: "Produces human-like text for various purposes" }
  ];

  useEffect(() => {
    if (isTraining) {
      const taskInterval = setInterval(() => {
        setCurrentTask(prev => (prev + 1) % tasks.length);
      }, 3000);

      const pulseInterval = setInterval(() => {
        setNeuralActivity(prev => !prev);
      }, 500);

      return () => {
        clearInterval(taskInterval);
        clearInterval(pulseInterval);
      };
    }
  }, [isTraining]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" />
            Foundation Model
            <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-xl text-blue-200">
            One powerful AI model, trained once, adaptable to countless tasks
          </p>
        </div>

        <div className="relative flex justify-center items-center h-48">
          <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-3xl transform transition-all duration-500 ${neuralActivity ? 'scale-110 opacity-70' : 'scale-100 opacity-30'}`} />
          <div className={`relative transition-all duration-500 transform ${neuralActivity ? 'scale-110' : 'scale-100'}`}>
            <Brain size={140} className="text-blue-400 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
          {isTraining && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Database size={50} className="text-green-400 animate-pulse" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`
                relative group flex items-center space-x-4 p-6 rounded-xl
                backdrop-blur-lg transition-all duration-500
                ${currentTask === index && isTraining 
                  ? 'bg-blue-500/30 ring-2 ring-blue-400 scale-105' 
                  : 'bg-white/5 hover:bg-white/10'}
                cursor-pointer
              `}
              onMouseEnter={() => setShowTooltip(index)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className="p-3 rounded-lg bg-blue-500/20">
                {task.icon}
              </div>
              <span className="text-lg text-white font-medium">{task.name}</span>
              {showTooltip === index && (
                <div className="absolute -top-16 left-0 w-full p-3 rounded-lg bg-black/90 text-white text-sm z-10">
                  {task.description}
                </div>
              )}
              {currentTask === index && isTraining && (
                <ArrowRight className="ml-auto text-green-400 animate-bounce" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsTraining(true)}
            disabled={isTraining}
            className={`
              group flex items-center space-x-3 px-8 py-4 rounded-full
              transition-all duration-500 text-lg font-medium
              ${isTraining 
                ? 'bg-green-500/20 text-green-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-400 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'}
            `}
          >
            <Zap size={24} className="group-hover:animate-pulse" />
            <span>{isTraining ? 'Adapting to Tasks...' : 'Initialize Model'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoundationModelDemo;