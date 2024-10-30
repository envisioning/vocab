"use client"
import { useState, useEffect } from "react";
import { Clock, Sun, Coffee, Book, Computer, DumbbellIcon, Utensils, Moon, Eye, EyeOff } from "lucide-react";

interface TimeEvent {
    id: number;
    icon: JSX.Element;
    time: string;
    activity: string;
}

interface Prediction {
    activity: string;
    confidence: number;
}

const DAILY_EVENTS: TimeEvent[] = [
    { id: 1, icon: <Sun className="w-6 h-6" />, time: "07:00", activity: "Wake up" },
    { id: 2, icon: <Coffee className="w-6 h-6" />, time: "07:30", activity: "Breakfast" },
    { id: 3, icon: <Book className="w-6 h-6" />, time: "08:30", activity: "Study" },
    { id: 4, icon: <Computer className="w-6 h-6" />, time: "10:30", activity: "Code" },
    { id: 5, icon: <Utensils className="w-6 h-6" />, time: "12:30", activity: "Lunch" },
    { id: 6, icon: <DumbbellIcon className="w-6 h-6" />, time: "15:00", activity: "Exercise" },
    { id: 7, icon: <Moon className="w-6 h-6" />, time: "22:00", activity: "Sleep" },
];

export default function SelfSupervisedLearning() {
    const [maskedIndex, setMaskedIndex] = useState<number | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isRevealed, setIsRevealed] = useState(false);

    const generatePredictions = (index: number) => {
        const before = DAILY_EVENTS.slice(0, index);
        const after = DAILY_EVENTS.slice(index + 1);
        
        const predictions: Prediction[] = [];
        
        if (before.length > 0) {
            if (before[before.length - 1].activity === "Wake up") {
                predictions.push({ activity: "Breakfast", confidence: 0.9 });
            }
            if (before[before.length - 1].activity === "Breakfast") {
                predictions.push({ activity: "Study", confidence: 0.8 });
            }
        }
        
        if (after.length > 0) {
            if (after[0].activity === "Sleep") {
                predictions.push({ activity: "Exercise", confidence: 0.7 });
            }
        }
        
        return predictions;
    };

    useEffect(() => {
        if (maskedIndex !== null) {
            const newPredictions = generatePredictions(maskedIndex);
            setPredictions(newPredictions);
        } else {
            setPredictions([]);
        }
        return () => setPredictions([]);
    }, [maskedIndex]);

    const handleMask = (index: number) => {
        setMaskedIndex(maskedIndex === index ? null : index);
        setIsRevealed(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Self-Supervised Learning Timeline</h1>
            <p className="text-gray-600">Click on any event to mask it and see predictions based on surrounding events.</p>

            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                    {DAILY_EVENTS.map((event, index) => (
                        <div key={event.id} className="flex flex-col items-center space-y-2">
                            <button
                                onClick={() => handleMask(index)}
                                className={`p-3 rounded-full transition-all duration-300 
                                    ${maskedIndex === index ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                aria-label={`Toggle mask for ${event.activity}`}
                            >
                                {maskedIndex === index ? <EyeOff className="w-6 h-6 text-white" /> : event.icon}
                            </button>
                            <span className="text-sm font-medium">{event.time}</span>
                            <span className="text-xs">
                                {maskedIndex === index && !isRevealed ? "???" : event.activity}
                            </span>
                        </div>
                    ))}
                </div>

                {maskedIndex !== null && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-bold mb-2">Predictions:</h2>
                            {predictions.map((pred, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <div className="flex-grow">
                                        <div className="text-sm">{pred.activity}</div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                                                style={{ width: `${pred.confidence * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm">{(pred.confidence * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsRevealed(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            aria-label="Reveal actual activity"
                        >
                            <Eye className="w-4 h-4 inline mr-2" />
                            Reveal Actual Activity
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}