"use client"
import { useState, useEffect } from "react";
import { ChefHat, Dumbbell, Utensils, Car, Brain, Languages, User, X } from "lucide-react";

interface Task {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface AISystem {
  id: string;
  trainedTask: string;
  performance: { [key: string]: number };
}

const TASKS: Task[] = [
  { id: "sushi", name: "Make Sushi", icon: <ChefHat /> },
  { id: "gymnastics", name: "Perform Gymnastics", icon: <Dumbbell /> },
  { id: "openCans", name: "Open Cans", icon: <Utensils /> },
  { id: "drive", name: "Drive a Car", icon: <Car /> },
  { id: "chess", name: "Play Chess", icon: <Brain /> },
  { id: "translate", name: "Translate Languages", icon: <Languages /> },
  { id: "faceRecognition", name: "Recognize Faces", icon: <User /> },
];

/**
 * AITaskSimulator - A component to teach Narrow AI concepts
 */
const AITaskSimulator = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [aiSystems, setAiSystems] = useState<AISystem[]>([]);
  const [currentAI, setCurrentAI] = useState<AISystem | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  useEffect(() => {
    if (demoMode) {
      const demoInterval = setInterval(() => {
        const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
        setSelectedTask(randomTask.id);
        createAI(randomTask.id);
      }, 3000);

      return () => clearInterval(demoInterval);
    }
  }, [demoMode]);

  const createAI = (taskId: string) => {
    const newAI: AISystem = {
      id: `ai-${Date.now()}`,
      trainedTask: taskId,
      performance: TASKS.reduce((acc, task) => {
        acc[task.id] = task.id === taskId ? 95 + Math.random() * 5 : Math.random() * 20;
        return acc;
      }, {} as { [key: string]: number }),
    };
    setAiSystems((prev) => [...prev, newAI]);
    setCurrentAI(newAI);
    setDemoMode(false);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    createAI(taskId);
  };

  const handleAISelect = (aiId: string) => {
    const selectedAI = aiSystems.find((ai) => ai.id === aiId);
    if (selectedAI) {
      setCurrentAI(selectedAI);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Narrow AI Task Simulator</h1>
      <p className="mb-4">Select a task to train a new AI or choose an existing AI to test:</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {TASKS.map((task) => (
          <button
            key={task.id}
            onClick={() => handleTaskClick(task.id)}
            className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 ${
              selectedTask === task.id ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"
            }`}
            aria-pressed={selectedTask === task.id}
          >
            {task.icon}
            <span className="mt-2 text-sm">{task.name}</span>
          </button>
        ))}
      </div>

      {currentAI && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Current AI Performance</h2>
          <p className="mb-2">Trained for: {TASKS.find((t) => t.id === currentAI.trainedTask)?.name}</p>
          <div className="space-y-2">
            {TASKS.map((task) => (
              <div key={task.id} className="flex items-center">
                <span className="w-1/3">{task.name}:</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-full rounded-full ${
                      currentAI.performance[task.id] > 80 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${currentAI.performance[task.id]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiSystems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Created AI Systems</h2>
          <div className="flex flex-wrap gap-2">
            {aiSystems.map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleAISelect(ai.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentAI?.id === ai.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {TASKS.find((t) => t.id === ai.trainedTask)?.name} AI
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setDemoMode(!demoMode)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
      >
        {demoMode ? "Stop Demo" : "Start Demo"}
      </button>
    </div>
  );
};

export default AITaskSimulator;