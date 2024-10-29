"use client"
import { useState, useEffect } from "react";
import { ChefHat, Home, Robot, ArrowRight, Check, X, ZoomIn, ZoomOut } from "lucide-react";

interface Task {
    id: string;
    title: string;
    subtasks: Task[];
    isComplete: boolean;
}

interface ScenarioType {
    id: string;
    title: string;
    icon: JSX.Element;
    rootTask: Task;
}

const SCENARIOS: ScenarioType[] = [
    {
        id: "robot",
        title: "Build a Robot",
        icon: <Robot className="w-6 h-6" />,
        rootTask: {
            id: "robot-main",
            title: "Create Working Robot",
            isComplete: false,
            subtasks: [
                {
                    id: "design",
                    title: "Design",
                    isComplete: false,
                    subtasks: []
                },
                {
                    id: "electronics",
                    title: "Electronics",
                    isComplete: false,
                    subtasks: [
                        { id: "power", title: "Power Source", isComplete: false, subtasks: [] },
                        { id: "motors", title: "Motors", isComplete: false, subtasks: [] },
                        { id: "sensors", title: "Sensors", isComplete: false, subtasks: [] }
                    ]
                }
            ]
        }
    },
    {
        id: "chef",
        title: "Prepare Dinner Party",
        icon: <ChefHat className="w-6 h-6" />,
        rootTask: {
            id: "dinner-main",
            title: "Complete Dinner Party",
            isComplete: false,
            subtasks: [
                {
                    id: "appetizer",
                    title: "Appetizer",
                    isComplete: false,
                    subtasks: []
                },
                {
                    id: "main-course",
                    title: "Main Course",
                    isComplete: false,
                    subtasks: [
                        { id: "prep", title: "Ingredients Prep", isComplete: false, subtasks: [] },
                        { id: "timing", title: "Cooking Timing", isComplete: false, subtasks: [] },
                        { id: "plating", title: "Plating", isComplete: false, subtasks: [] }
                    ]
                }
            ]
        }
    }
];

/**
 * DecompositionTree: Interactive component teaching problem decomposition
 */
const DecompositionTree = () => {
    const [activeScenario, setActiveScenario] = useState<ScenarioType>(SCENARIOS[0]);
    const [zoom, setZoom] = useState<number>(1);
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScenario(prev => SCENARIOS[(SCENARIOS.findIndex(s => s.id === prev.id) + 1) % SCENARIOS.length]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleTaskToggle = (taskId: string) => {
        setCompletedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const renderTask = (task: Task, level: number = 0) => (
        <div 
            key={task.id}
            className={`ml-${level * 4} p-2 border-l-2 border-gray-300 transition-all duration-300`}
        >
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleTaskToggle(task.id)}
                    className="p-1 rounded hover:bg-blue-100 focus:outline-none focus:ring-2"
                    aria-label={`Toggle ${task.title}`}
                >
                    {completedTasks.has(task.id) ? 
                        <Check className="w-5 h-5 text-green-500" /> : 
                        <X className="w-5 h-5 text-gray-400" />
                    }
                </button>
                <span className="font-medium">{task.title}</span>
            </div>
            {task.subtasks.length > 0 && (
                <div className="mt-2">
                    {task.subtasks.map(subtask => renderTask(subtask, level + 1))}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problem Decomposition</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                        className="p-2 rounded hover:bg-gray-100"
                        aria-label="Zoom out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                        className="p-2 rounded hover:bg-gray-100"
                        aria-label="Zoom in"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="flex gap-4 mb-6">
                {SCENARIOS.map(scenario => (
                    <button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario)}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-300
                            ${activeScenario.id === scenario.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        {scenario.icon}
                        <span>{scenario.title}</span>
                    </button>
                ))}
            </div>
            <div style={{ transform: `scale(${zoom})` }} className="transform-origin-top-left transition-transform duration-300">
                {renderTask(activeScenario.rootTask)}
            </div>
        </div>
    );
};

export default DecompositionTree;