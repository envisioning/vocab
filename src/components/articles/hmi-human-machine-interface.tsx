"use client"
import { useState, useEffect } from "react";
import { Phone, Smartphone, Mic, ThumbsUp, ThumbsDown, Clock, Check } from "lucide-react";

interface InterfaceEra {
    id: number;
    name: string;
    icon: JSX.Element;
    description: string;
    task: string;
    interaction: string;
}

interface UserRating {
    eraId: number;
    rating: number;
}

const INTERFACE_ERAS: InterfaceEra[] = [
    {
        id: 1,
        name: "Mechanical Era",
        icon: <Phone className="w-8 h-8" />,
        description: "Physical buttons and dials",
        task: "Set alarm for 7:00 AM using buttons",
        interaction: "Click buttons in sequence: Mode → Hour → Minute → Set"
    },
    {
        id: 2,
        name: "Touch Era",
        icon: <Smartphone className="w-8 h-8" />,
        description: "Touchscreen interfaces",
        task: "Set alarm by dragging clock hands",
        interaction: "Drag the clock hands to 7:00"
    },
    {
        id: 3,
        name: "Voice Era",
        icon: <Mic className="w-8 h-8" />,
        description: "Voice commands",
        task: 'Say "Set alarm for 7 AM"',
        interaction: "Click microphone and speak command"
    }
];

const HMIEvolution = () => {
    const [activeEra, setActiveEra] = useState<number>(1);
    const [userRatings, setUserRatings] = useState<UserRating[]>([]);
    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
    const [interactionStep, setInteractionStep] = useState<number>(0);

    useEffect(() => {
        setTaskCompleted(false);
        setInteractionStep(0);
        return () => {
            setTaskCompleted(false);
            setInteractionStep(0);
        };
    }, [activeEra]);

    const handleInteraction = () => {
        if (interactionStep < 3) {
            setInteractionStep(prev => prev + 1);
        } else {
            setTaskCompleted(true);
        }
    };

    const handleRating = (eraId: number, rating: number) => {
        setUserRatings(prev => [...prev.filter(r => r.eraId !== eraId), { eraId, rating }]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center mb-8">
                {INTERFACE_ERAS.map(era => (
                    <button
                        key={era.id}
                        onClick={() => setActiveEra(era.id)}
                        className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-300
                            ${activeEra === era.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        aria-selected={activeEra === era.id}
                        role="tab"
                    >
                        {era.icon}
                        <span className="mt-2 text-sm">{era.name}</span>
                    </button>
                ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg" role="tabpanel">
                <h2 className="text-xl font-bold mb-4">
                    {INTERFACE_ERAS[activeEra - 1].name}
                </h2>
                <p className="mb-4">{INTERFACE_ERAS[activeEra - 1].description}</p>
                <div className="mb-4">
                    <p className="font-bold">Task:</p>
                    <p>{INTERFACE_ERAS[activeEra - 1].task}</p>
                </div>

                <div className="flex items-center justify-center space-x-4 h-40 bg-white rounded-lg border-2 border-gray-200">
                    {!taskCompleted ? (
                        <button
                            onClick={handleInteraction}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                            aria-label="Perform interaction"
                        >
                            {INTERFACE_ERAS[activeEra - 1].interaction}
                        </button>
                    ) : (
                        <div className="flex items-center text-green-500">
                            <Check className="w-6 h-6 mr-2" />
                            <span>Task Completed!</span>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <p className="mb-2">Rate this interface:</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleRating(activeEra, 1)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                            aria-label="Rate positively"
                        >
                            <ThumbsUp className={`w-6 h-6 ${userRatings.find(r => r.eraId === activeEra)?.rating === 1 ? 'text-blue-500' : ''}`} />
                        </button>
                        <button
                            onClick={() => handleRating(activeEra, -1)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                            aria-label="Rate negatively"
                        >
                            <ThumbsDown className={`w-6 h-6 ${userRatings.find(r => r.eraId === activeEra)?.rating === -1 ? 'text-blue-500' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HMIEvolution;