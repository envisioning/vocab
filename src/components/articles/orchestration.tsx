"use client"
import { useState, useEffect } from "react";
import { Chef, Clock, AlertCircle, Battery, ArrowRight, Check, X, RefreshCw } from "lucide-react";

interface Task {
  id: string;
  name: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  dependencies: string[];
  resources: number;
}

interface ComponentProps {}

/**
 * RestaurantOrchestrator - An interactive component teaching orchestration
 * through a restaurant kitchen metaphor
 */
const RestaurantOrchestrator: React.FC<ComponentProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Prep Station', status: 'waiting', dependencies: [], resources: 20 },
    { id: '2', name: 'Grill Station', status: 'waiting', dependencies: ['1'], resources: 30 },
    { id: '3', name: 'Sauce Station', status: 'waiting', dependencies: ['1'], resources: 15 },
    { id: '4', name: 'Plating', status: 'waiting', dependencies: ['2', '3'], resources: 25 }
  ]);

  const [availableResources, setAvailableResources] = useState<number>(100);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => {
        const newTasks = [...prevTasks];
        const taskToProcess = newTasks.find(t => 
          t.status === 'waiting' && 
          t.dependencies.every(d => newTasks.find(nt => nt.id === d)?.status === 'completed')
        );

        if (taskToProcess) {
          taskToProcess.status = 'running';
          setTimeout(() => {
            setTasks(current => 
              current.map(t => 
                t.id === taskToProcess.id ? {...t, status: 'completed'} : t
              )
            );
          }, 2000);
        }
        return newTasks;
      });
      setCurrentStep(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const resetSimulation = () => {
    setTasks(tasks.map(t => ({ ...t, status: 'waiting' })));
    setCurrentStep(0);
    setIsSimulating(false);
    setAvailableResources(100);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Chef className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Kitchen Orchestrator</h2>
        </div>
        <div className="flex items-center gap-4">
          <Battery className="w-6 h-6" />
          <span>Resources: {availableResources}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`p-4 rounded-lg border-2 ${
              task.status === 'running' ? 'border-blue-500' : 'border-gray-200'
            } bg-white`}
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{task.name}</span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Resources: {task.resources}%
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transition duration-300 flex items-center gap-2"
          aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
        >
          {isSimulating ? <Clock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {isSimulating ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                     transition duration-300 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default RestaurantOrchestrator;