"use client"
import { useState, useEffect } from "react";
import { Music, Users, Clock, Calendar, ZoomIn, ZoomOut } from "lucide-react";

interface ScaleLevel {
    id: number;
    name: string;
    description: string;
    icon: JSX.Element;
    timeFrame: string;
}

interface VisiblePattern {
    id: number;
    text: string;
    opacity: number;
}

const SCALE_LEVELS: ScaleLevel[] = [
    {
        id: 1,
        name: "Individual Notes",
        description: "Single musical notes being played",
        icon: <Music className="w-6 h-6" />,
        timeFrame: "Microseconds"
    },
    {
        id: 2,
        name: "Musical Phrases",
        description: "Short sequences of notes forming patterns",
        icon: <Users className="w-6 h-6" />,
        timeFrame: "Seconds"
    },
    {
        id: 3,
        name: "Movements",
        description: "Complete sections of the symphony",
        icon: <Clock className="w-6 h-6" />,
        timeFrame: "Minutes"
    },
    {
        id: 4,
        name: "Full Symphony",
        description: "The entire musical piece",
        icon: <Calendar className="w-6 h-6" />,
        timeFrame: "Hour"
    }
];

const ScaleSeparationOrchestra = () => {
    const [currentScale, setCurrentScale] = useState<number>(1);
    const [patterns, setPatterns] = useState<VisiblePattern[]>([]);
    const [isZooming, setIsZooming] = useState<boolean>(false);

    useEffect(() => {
        const newPatterns = SCALE_LEVELS.map(level => ({
            id: level.id,
            text: level.description,
            opacity: level.id <= currentScale ? 1 : 0.2
        }));
        setPatterns(newPatterns);

        return () => {
            setPatterns([]);
        };
    }, [currentScale]);

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentScale(Number(e.target.value));
        setIsZooming(true);
        setTimeout(() => setIsZooming(false), 500);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Scale Separation in Orchestra
            </h1>

            <div className="relative mb-8">
                <div className={`transition-transform duration-500 ${
                    isZooming ? 'scale-105' : 'scale-100'
                }`}>
                    {SCALE_LEVELS[currentScale - 1].icon}
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <ZoomOut className="w-5 h-5 text-gray-600" />
                    <input
                        type="range"
                        min="1"
                        max="4"
                        value={currentScale}
                        onChange={handleScaleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        aria-label="Scale level"
                    />
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                </div>
            </div>

            <div className="space-y-4">
                {patterns.map((pattern) => (
                    <div
                        key={pattern.id}
                        className="transition-opacity duration-300 p-3 bg-white rounded-lg shadow"
                        style={{ opacity: pattern.opacity }}
                        role="listitem"
                    >
                        <div className="flex items-center gap-2">
                            {SCALE_LEVELS[pattern.id - 1].icon}
                            <span className="font-medium">
                                {SCALE_LEVELS[pattern.id - 1].name}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({SCALE_LEVELS[pattern.id - 1].timeFrame})
                            </span>
                        </div>
                        <p className="mt-1 text-gray-600">{pattern.text}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    Current Focus: {SCALE_LEVELS[currentScale - 1].name}
                </p>
            </div>
        </div>
    );
};

export default ScaleSeparationOrchestra;