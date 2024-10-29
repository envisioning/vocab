"use client"
import { useState, useEffect } from "react";
import { Brain, Book, Zap, CheckCircle, XCircle } from "lucide-react";

interface Task {
  id: number;
  name: string;
  instructions: string[];
}

interface ComponentProps {}

/**
 * AIApprenticeWorkshop: A component to teach Instruction Tuning
 * through an interactive AI apprentice simulation.
 */
const AIApprenticeWorkshop: React.FC<ComponentProps> = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [instruction, setInstruction] = useState<string>("");
  const [aiKnowledge, setAiKnowledge] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const tasks: Task[] = [
    { id: 1, name: "Writing Poetry", instructions: ["Use metaphors", "Follow rhyme schemes"] },
    { id: 2, name: "Medical Diagnosis", instructions: ["Consider symptoms", "Check patient history"] },
  ];

  useEffect(() => {
    const animationTimer = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 1000);

    return () => clearInterval(animationTimer);
  }, []);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setAiKnowledge([]);
    setTestResult("");
  };

  const handleInstructionSubmit = () => {
    if (instruction.trim() && selectedTask) {
      setAiKnowledge((prev) => [...prev, instruction]);
      setInstruction("");
    }
  };

  const handleTest = () => {
    if (selectedTask) {
      const success = aiKnowledge.some((knowledge) =>
        selectedTask.instructions.includes(knowledge)
      );
      setTestResult(
        success
          ? "Great job! The AI performed well on the task."
          : "The AI needs more tuning for this task."
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI Apprentice Workshop</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select a Task:</h2>
        <div className="flex space-x-4">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleTaskSelect(task)}
              className={`px-4 py-2 rounded ${
                selectedTask?.id === task.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } transition duration-300`}
            >
              {task.name}
            </button>
          ))}
        </div>
      </div>

      {selectedTask && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Provide Instructions:</h2>
            <div className="flex">
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-l"
                placeholder="Enter an instruction..."
              />
              <button
                onClick={handleInstructionSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-r transition duration-300 hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">AI Knowledge:</h2>
            <div className="flex items-center space-x-4">
              <Brain
                size={48}
                className={`text-blue-500 ${isAnimating ? "animate-pulse" : ""}`}
              />
              {aiKnowledge.map((knowledge, index) => (
                <div
                  key={index}
                  className="bg-white p-2 rounded shadow"
                >
                  {knowledge}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600"
            >
              Test AI Performance
            </button>
          </div>

          {testResult && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Test Result:</h2>
              <div className="flex items-center space-x-2">
                {testResult.includes("Great job") ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <p>{testResult}</p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Understanding Instruction Tuning:</h2>
        <p className="mb-2">
          Instruction Tuning is like training a chef to specialize in Italian cuisine while retaining general cooking skills.
        </p>
        <div className="flex items-center space-x-2">
          <Book className="text-blue-500" />
          <p>General knowledge</p>
          <Zap className="text-green-500" />
          <p>Specialized instructions</p>
        </div>
      </div>
    </div>
  );
};

export default AIApprenticeWorkshop;