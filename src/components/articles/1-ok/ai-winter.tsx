// /Users/kemi/Documents/GitHub/vocab/src/components/articles/1-ok/ai-winter.tsx

"use client"
import { useState, useEffect } from "react";
import { Thermometer, TrendingUp, TrendingDown, Newspaper, Coins, Brain, Users, AlertTriangle } from "lucide-react";

interface TimelineEvent {
    year: number;
    title: string;
    expectation: string;
    reality: string;
    funding: number;
    interest: number;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        year: 1956,
        title: "Dartmouth Conference",
        expectation: "Human-level AI within a generation",
        reality: "Basic pattern recognition only",
        funding: 90,
        interest: 95
    },
    {
        year: 1974,
        title: "First AI Winter",
        expectation: "Universal language translation",
        reality: "Limited word-by-word translation",
        funding: 30,
        interest: 40
    },
    {
        year: 1987,
        title: "Second AI Winter",
        expectation: "Expert systems everywhere",
        reality: "Limited practical applications",
        funding: 20,
        interest: 25
    }
];

/**
 * AIWinterExplorer: Interactive component teaching about AI Winter periods
 * through a dynamic timeline and temperature visualization
 */
export default function AIWinterExplorer() {
    const [activeEvent, setActiveEvent] = useState<TimelineEvent>(TIMELINE_EVENTS[0]);
    const [isAnimating, setIsAnimating] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % TIMELINE_EVENTS.length;
                setActiveEvent(TIMELINE_EVENTS[next]);
                return next;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleEventClick = (index: number) => {
        setIsAnimating(false);
        setCurrentIndex(index);
        setActiveEvent(TIMELINE_EVENTS[index]);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex gap-8">
                <div className="w-1/3">
                    <div className="flex items-center gap-2 mb-4">
                        <Thermometer className="text-blue-500" />
                        <h2 className="text-xl font-bold">AI Interest & Funding</h2>
                    </div>
                    <div className="h-64 bg-gray-200 rounded-lg relative">
                        <div 
                            className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500 rounded-b-lg"
                            style={{ height: `${activeEvent.interest}%` }}
                            role="progressbar"
                            aria-valuenow={activeEvent.interest}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>

                <div className="w-2/3">
                    <div className="space-y-4">
                        {TIMELINE_EVENTS.map((event, index) => (
                            <button
                                key={event.year}
                                onClick={() => handleEventClick(index)}
                                className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                                    index === currentIndex ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'
                                }`}
                                aria-selected={index === currentIndex}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">{event.year}</span>
                                    <div className="flex gap-2">
                                        <Coins className={`w-5 h-5 ${event.funding > 50 ? 'text-green-500' : 'text-gray-500'}`} />
                                        <Users className={`w-5 h-5 ${event.interest > 50 ? 'text-blue-500' : 'text-gray-500'}`} />
                                    </div>
                                </div>
                                <h3 className="font-semibold mt-2">{event.title}</h3>
                                <div className="mt-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <p>Expected: {event.expectation}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4 text-gray-500" />
                                        <p>Reality: {event.reality}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}