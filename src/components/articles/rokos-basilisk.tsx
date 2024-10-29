"use client"
import { useState, useEffect } from "react";
import { TimeLine, Brain, Clock, BookOpen, Lightbulb, AlertCircle, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

interface TimelineEvent {
    id: number;
    title: string;
    description: string;
    choices: {
        support: string;
        ignore: string;
    };
}

interface ComponentProps {}

const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        id: 1,
        title: "The Library of Tomorrow",
        description: "A future library gives access based on past book donations. Would you donate books today?",
        choices: {
            support: "Donate books regularly",
            ignore: "Keep books for yourself"
        }
    },
    {
        id: 2,
        title: "The School Production",
        description: "Next year's play will only cast those helping now. Would you help with preparations?",
        choices: {
            support: "Help with preparations",
            ignore: "Focus on other activities"
        }
    },
    {
        id: 3,
        title: "AI Development",
        description: "Future AI might remember those who supported its creation. How do you engage?",
        choices: {
            support: "Support AI research",
            ignore: "Remain uninvolved"
        }
    }
];

const RokosBasilisk = ({}: ComponentProps) => {
    const [currentEvent, setCurrentEvent] = useState<number>(0);
    const [choices, setChoices] = useState<boolean[]>([]);
    const [showReflection, setShowReflection] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    useEffect(() => {
        if (currentEvent >= TIMELINE_EVENTS.length) {
            setShowReflection(true);
        }

        const animation = setTimeout(() => {
            setIsAnimating(false);
        }, 500);

        return () => {
            clearTimeout(animation);
        };
    }, [currentEvent]);

    const handleChoice = (supported: boolean) => {
        setIsAnimating(true);
        setChoices([...choices, supported]);
        setCurrentEvent(prev => prev + 1);
    };

    const resetExperiment = () => {
        setCurrentEvent(0);
        setChoices([]);
        setShowReflection(false);
    };

    const getReflectionMessage = () => {
        const supportCount = choices.filter(c => c).length;
        if (supportCount === 3) return "You consistently supported future development. How might this influence your future?";
        if (supportCount === 0) return "You chose non-involvement. Consider the potential implications of this stance.";
        return "Your mixed choices reflect the complexity of temporal decision-making.";
    };

    if (showReflection) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="text-blue-500 w-6 h-6" />
                    <h2 className="text-xl font-semibold">Reflection Chamber</h2>
                </div>
                <p className="text-gray-700 mb-4">{getReflectionMessage()}</p>
                <button
                    onClick={resetExperiment}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    aria-label="Reset experiment"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <TimeLine className="text-blue-500 w-6 h-6" />
                <h1 className="text-xl font-semibold">Timeline Influencer</h1>
            </div>
            
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-gray-600 w-5 h-5" />
                        <h3 className="font-medium">{TIMELINE_EVENTS[currentEvent].title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{TIMELINE_EVENTS[currentEvent].description}</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => handleChoice(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                        aria-label="Support option"
                    >
                        <ThumbsUp className="w-4 h-4" />
                        {TIMELINE_EVENTS[currentEvent].choices.support}
                    </button>
                    <button
                        onClick={() => handleChoice(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                        aria-label="Ignore option"
                    >
                        <ThumbsDown className="w-4 h-4" />
                        {TIMELINE_EVENTS[currentEvent].choices.ignore}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RokosBasilisk;