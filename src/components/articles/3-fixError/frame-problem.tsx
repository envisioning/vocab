"use client"
import { useState, useEffect } from "react";
import { Camera, Box, Move, Brain, Robot, Human, Zap, Filter, RefreshCw } from "lucide-react";

interface RoomObject {
    id: string;
    name: string;
    state: string;
    position: { x: number; y: number };
}

interface Perspective {
    type: "AI" | "Human";
    changedStates: string[];
    unchangedStates: string[];
}

const INITIAL_OBJECTS: RoomObject[] = [
    { id: "chair", name: "Chair", state: "stationary", position: { x: 0, y: 0 } },
    { id: "lamp", name: "Lamp", state: "off", position: { x: 100, y: 0 } },
    { id: "window", name: "Window", state: "closed", position: { x: 200, y: 0 } }
];

const UNCHANGED_STATES = [
    "Gravity still works", "Walls remain white", "Air exists", "Time continues forward",
    "Physics laws apply", "Room temperature stable", "Floor supports objects"
];

/**
 * Frame Problem Interactive Simulator
 * Demonstrates the complexity of tracking state changes in AI systems
 */
export default function FrameProblemSimulator() {
    const [objects, setObjects] = useState<RoomObject[]>(INITIAL_OBJECTS);
    const [perspective, setPerspective] = useState<"AI" | "Human">("Human");
    const [complexity, setComplexity] = useState<number>(0);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [stateChanges, setStateChanges] = useState<Perspective>({
        type: "Human",
        changedStates: [],
        unchangedStates: []
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (perspective === "AI") {
                setComplexity(prev => Math.min(prev + 10, 100));
            } else {
                setComplexity(prev => Math.max(prev - 10, 0));
            }
        }, 500);

        return () => clearInterval(interval);
    }, [perspective]);

    const handleObjectInteraction = (id: string) => {
        setObjects(prev => prev.map(obj => {
            if (obj.id === id) {
                const newState = obj.state === "stationary" ? "moved" : "stationary";
                return { ...obj, state: newState };
            }
            return obj;
        }));

        setStateChanges(prev => ({
            ...prev,
            changedStates: [...prev.changedStates, `${id} changed state`],
            unchangedStates: perspective === "AI" ? UNCHANGED_STATES : []
        }));
    };

    const togglePerspective = () => {
        setPerspective(prev => prev === "AI" ? "Human" : "AI");
        setStateChanges({
            type: perspective === "AI" ? "Human" : "AI",
            changedStates: [],
            unchangedStates: []
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <h1 className="text-2xl font-bold">Frame Problem Simulator</h1>
                <button
                    onClick={togglePerspective}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    aria-label="Toggle perspective"
                >
                    {perspective === "AI" ? <Robot className="w-5 h-5" /> : <Human className="w-5 h-5" />}
                    {perspective} View
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Interactive Room</h2>
                    <div className="flex flex-wrap gap-4">
                        {objects.map(obj => (
                            <button
                                key={obj.id}
                                onClick={() => handleObjectInteraction(obj.id)}
                                className={`p-4 rounded-lg border-2 transition duration-300 ${
                                    selectedObject === obj.id ? "border-blue-500" : "border-gray-200"
                                }`}
                                aria-label={`Interact with ${obj.name}`}
                            >
                                <Box className="w-8 h-8 mb-2" />
                                <div>{obj.name}</div>
                                <div className="text-sm text-gray-500">{obj.state}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">State Changes</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium">Changed States</h3>
                            <ul className="list-disc pl-4">
                                {stateChanges.changedStates.map((state, i) => (
                                    <li key={i} className="text-sm">{state}</li>
                                ))}
                            </ul>
                        </div>
                        {perspective === "AI" && (
                            <div>
                                <h3 className="font-medium">Unchanged States</h3>
                                <div className="max-h-40 overflow-y-auto">
                                    <ul className="list-disc pl-4">
                                        {stateChanges.unchangedStates.map((state, i) => (
                                            <li key={i} className="text-sm text-gray-500">{state}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5" />
                    <span>Computational Complexity</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${complexity}%` }}
                        role="progressbar"
                        aria-valuenow={complexity}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
            </div>
        </div>
    );
}