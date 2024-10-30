"use client"
import { useState, useEffect } from "react";
import { Droplet, Filter, ArrowDown, Gauge, PlayCircle, RefreshCcw } from "lucide-react";

interface Drop {
    id: number;
    type: 'important' | 'neutral' | 'noise';
    position: number;
    filtered: boolean;
}

interface ComponentProps {}

const INITIAL_SENSITIVITY = 0.5;
const DROP_TYPES: Array<'important' | 'neutral' | 'noise'> = ['important', 'neutral', 'noise'];

/**
 * GLU Learning Component using water filtration metaphor
 */
export default function GLULearningStation({}: ComponentProps) {
    const [drops, setDrops] = useState<Drop[]>([]);
    const [sensitivity, setSensitivity] = useState<number>(INITIAL_SENSITIVITY);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        if (!isRunning) return;
        
        const dropInterval = setInterval(() => {
            const newDrop: Drop = {
                id: Date.now(),
                type: DROP_TYPES[Math.floor(Math.random() * 3)],
                position: 0,
                filtered: false
            };
            setDrops(prev => [...prev, newDrop]);
        }, 2000);

        return () => clearInterval(dropInterval);
    }, [isRunning]);

    useEffect(() => {
        if (!isRunning) return;
        
        const animationInterval = setInterval(() => {
            setDrops(prev => prev.map(drop => ({
                ...drop,
                position: drop.position + 1,
                filtered: drop.position >= 50 ? shouldFilter(drop.type, sensitivity) : drop.filtered
            })).filter(drop => drop.position < 100));
        }, 50);

        return () => clearInterval(animationInterval);
    }, [isRunning, sensitivity]);

    const shouldFilter = (type: Drop['type'], sens: number): boolean => {
        switch(type) {
            case 'important': return sens > 0.3;
            case 'neutral': return sens > 0.6;
            case 'noise': return sens > 0.8;
        }
    };

    const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSensitivity(parseFloat(e.target.value));
    };

    const handleReset = () => {
        setDrops([]);
        setSensitivity(INITIAL_SENSITIVITY);
        setScore(0);
        setIsRunning(false);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">GLU Filter Station</h2>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-300"
                    aria-label={isRunning ? "Pause simulation" : "Start simulation"}
                >
                    <PlayCircle className={`w-6 h-6 ${isRunning ? 'text-green-500' : 'text-blue-500'}`} />
                </button>
            </div>

            <div className="relative h-80 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
                {drops.map(drop => (
                    <div
                        key={drop.id}
                        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300
                            ${drop.type === 'important' ? 'text-blue-500' :
                            drop.type === 'neutral' ? 'text-gray-500' : 'text-red-500'}`}
                        style={{ top: `${drop.position}%` }}
                    >
                        <Droplet className="w-6 h-6" />
                    </div>
                ))}
                
                <div className="absolute top-1/2 left-0 w-full flex items-center justify-center">
                    <Filter className="w-8 h-8 text-blue-500" />
                    <ArrowDown className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <Gauge className="w-6 h-6 text-blue-500" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={sensitivity}
                    onChange={handleSensitivityChange}
                    className="flex-1"
                    aria-label="Filter sensitivity"
                />
                <button
                    onClick={handleReset}
                    className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-300"
                    aria-label="Reset simulation"
                >
                    <RefreshCcw className="w-6 h-6 text-blue-500" />
                </button>
            </div>
        </div>
    );
}