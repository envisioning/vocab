"use client"
import { useState, useEffect } from "react";
import { Cpu, Gpu, Image, MessageSquare, BarChart, Play, Pause, RefreshCw } from "lucide-react";

interface Task {
  id: number;
  name: string;
  icon: JSX.Element;
  cpuAllocation: number;
  gpuAllocation: number;
}

interface ComponentProps {}

/**
 * AIResourceAllocator: A component to teach GPU-Poor concept through interactive resource allocation.
 */
const AIResourceAllocator: React.FC<ComponentProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Image Recognition", icon: <Image />, cpuAllocation: 0, gpuAllocation: 0 },
    { id: 2, name: "Natural Language Processing", icon: <MessageSquare />, cpuAllocation: 0, gpuAllocation: 0 },
    { id: 3, name: "Data Analysis", icon: <BarChart />, cpuAllocation: 0, gpuAllocation: 0 },
  ]);
  const [isGpuPoor, setIsGpuPoor] = useState<boolean>(true);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);
  const [performance, setPerformance] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulationRunning) {
      interval = setInterval(() => {
        calculatePerformance();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, tasks, isGpuPoor]);

  const calculatePerformance = () => {
    let totalPerformance = 0;
    tasks.forEach(task => {
      const cpuContribution = task.cpuAllocation * 1;
      const gpuContribution = isGpuPoor ? task.gpuAllocation * 2 : task.gpuAllocation * 5;
      totalPerformance += cpuContribution + gpuContribution;
    });
    setPerformance(Math.min(totalPerformance, 100));
  };

  const allocateResource = (taskId: number, resourceType: 'cpu' | 'gpu') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              [resourceType === 'cpu' ? 'cpuAllocation' : 'gpuAllocation']: 
                task[resourceType === 'cpu' ? 'cpuAllocation' : 'gpuAllocation'] + 1
            }
          : task
      )
    );
  };

  const toggleSimulation = () => {
    setIsSimulationRunning(prev => !prev);
  };

  const resetSimulation = () => {
    setTasks(tasks.map(task => ({ ...task, cpuAllocation: 0, gpuAllocation: 0 })));
    setPerformance(0);
    setIsSimulationRunning(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Resource Allocator</h2>
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!isGpuPoor}
            onChange={() => setIsGpuPoor(prev => !prev)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">GPU-Rich Mode</span>
        </label>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
            <div className="flex items-center">
              {task.icon}
              <span className="ml-2">{task.name}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => allocateResource(task.id, 'cpu')}
                className="flex items-center bg-blue-500 text-white px-2 py-1 rounded"
                aria-label={`Allocate CPU to ${task.name}`}
              >
                <Cpu size={16} />
                <span className="ml-1">{task.cpuAllocation}</span>
              </button>
              <button
                onClick={() => allocateResource(task.id, 'gpu')}
                className="flex items-center bg-green-500 text-white px-2 py-1 rounded"
                aria-label={`Allocate GPU to ${task.name}`}
              >
                <Gpu size={16} />
                <span className="ml-1">{task.gpuAllocation}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${performance}%` }}
            role="progressbar"
            aria-valuenow={performance}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-center mt-2">Performance: {performance.toFixed(2)}%</p>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={toggleSimulation}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
          <span className="ml-2">{isSimulationRunning ? 'Pause' : 'Start'} Simulation</span>
        </button>
        <button
          onClick={resetSimulation}
          className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
        >
          <RefreshCw size={16} />
          <span className="ml-2">Reset</span>
        </button>
      </div>
    </div>
  );
};

export default AIResourceAllocator;