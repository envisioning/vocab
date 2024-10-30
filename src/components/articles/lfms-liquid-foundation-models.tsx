"use client"
import { useState, useEffect } from "react";
import { Droplet, FileText, Image, Music, Video, Zap, RefreshCcw } from "lucide-react";

interface Task {
    id: string;
    type: 'text' | 'image' | 'audio' | 'video';
    energy: number;
    completed: boolean;
}

interface Position {
    x: number;
    y: number;
}

interface ComponentProps {}

const TASKS: Task[] = [
    { id: 'task1', type: 'text', energy: 20, completed: false },
    { id: 'task2', type: 'image', energy: 40, completed: false },
    { id: 'task3', type: 'audio', energy: 30, completed: false },
    { id: 'task4', type: 'video', energy: 60, completed: false },
];

const ShapeShiftingLab: React.FC<ComponentProps> = () => {
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [blobPosition, setBlobPosition] = useState<Position>({ x: 50, y: 50 });
    const [energyLevel, setEnergyLevel] = useState<number>(100);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    useEffect(() => {
        const energyInterval = setInterval(() => {
            setEnergyLevel(prev => 
                Math.min(100, prev + (activeTasks.length ? -5 : 2))
            );
        }, 1000);

        return () => clearInterval(energyInterval);
    }, [activeTasks]);

    const handleDragStart = (task: Task) => {
        setIsDragging(true);
        setDraggedTask(task);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedTask && energyLevel >= draggedTask.energy) {
            setActiveTasks(prev => [...prev, draggedTask]);
            setEnergyLevel(prev => prev - draggedTask.energy);
        }
        setIsDragging(false);
        setDraggedTask(null);
    };

    const getTaskIcon = (type: string) => {
        switch(type) {
            case 'text': return <FileText className="w-6 h-6" />;
            case 'image': return <Image className="w-6 h-6" />;
            case 'audio': return <Music className="w-6 h-6" />;
            case 'video': return <Video className="w-6 h-6" />;
            default: return null;
        }
    };

    const resetLab = () => {
        setActiveTasks([]);
        setEnergyLevel(100);
        setBlobPosition({ x: 50, y: 50 });
    };

    return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg p-4" role="region" aria-label="AI Laboratory">
            <div className="absolute right-4 top-4">
                <button onClick={resetLab} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                    <RefreshCcw className="w-6 h-6" />
                </button>
            </div>

            <div className="flex justify-between mb-4">
                <div className="w-32 h-[400px] bg-gray-200 rounded-lg p-2">
                    {TASKS.map(task => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            className="p-2 mb-2 bg-white rounded cursor-move hover:bg-blue-50 transition duration-300"
                            role="button"
                            tabIndex={0}
                        >
                            {getTaskIcon(task.type)}
                            <span className="ml-2">{task.type}</span>
                        </div>
                    ))}
                </div>

                <div 
                    className="flex-1 mx-4 relative bg-gray-200 rounded-lg"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div 
                        className={`absolute w-32 h-32 rounded-full transition-all duration-500 
                            ${isDragging ? 'bg-blue-400' : 'bg-blue-500'}`}
                        style={{
                            left: `${blobPosition.x}%`,
                            top: `${blobPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <Droplet className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="w-32 bg-gray-200 rounded-lg p-2">
                    <div className="h-[400px] relative">
                        <div 
                            className="absolute bottom-0 w-full bg-green-500 transition-all duration-300 rounded-b"
                            style={{ height: `${energyLevel}%` }}
                        >
                            <Zap className="w-6 h-6 text-white mx-auto mt-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Active Tasks:</h3>
                <div className="flex gap-2 mt-2">
                    {activeTasks.map((task, index) => (
                        <div key={`${task.id}-${index}`} className="p-2 bg-blue-100 rounded">
                            {getTaskIcon(task.type)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShapeShiftingLab;