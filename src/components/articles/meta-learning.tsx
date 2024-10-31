"use client"
import { useState, useEffect } from "react";
import { Music, Brain, Zap, Piano, Guitar, Drum, ArrowRight, Check } from "lucide-react";

interface InstrumentType {
    id: number;
    name: string;
    icon: JSX.Element;
    skills: string[];
    learned: boolean;
}

interface MetaLearningState {
    activeInstrument: number;
    learningProgress: number;
    patternRecognized: boolean;
    commonPatterns: string[];
}

const INSTRUMENTS: InstrumentType[] = [
    {
        id: 1,
        name: "Piano",
        icon: <Piano className="w-8 h-8" />,
        skills: ["Reading Notes", "Rhythm", "Hand Coordination"],
        learned: false
    },
    {
        id: 2,
        name: "Guitar",
        icon: <Guitar className="w-8 h-8" />,
        skills: ["Reading Notes", "Rhythm", "Finger Placement"],
        learned: false
    },
    {
        id: 3,
        name: "Drums",
        icon: <Drum className="w-8 h-8" />,
        skills: ["Reading Notes", "Rhythm", "Coordination"],
        learned: false
    }
];

export default function MetaLearningOrchestra() {
    const [state, setState] = useState<MetaLearningState>({
        activeInstrument: 0,
        learningProgress: 0,
        patternRecognized: false,
        commonPatterns: []
    });
    const [instruments, setInstruments] = useState<InstrumentType[]>(INSTRUMENTS);

    useEffect(() => {
        if (state.activeInstrument >= instruments.length) return;

        const progressInterval = setInterval(() => {
            setState(prev => ({
                ...prev,
                learningProgress: prev.learningProgress + 1,
                patternRecognized: prev.learningProgress > 50
            }));
        }, 100);

        return () => clearInterval(progressInterval);
    }, [state.activeInstrument, instruments.length]);

    useEffect(() => {
        if (state.learningProgress >= 100) {
            const updatedInstruments = [...instruments];
            updatedInstruments[state.activeInstrument].learned = true;
            setInstruments(updatedInstruments);

            if (state.activeInstrument < instruments.length - 1) {
                setState(prev => ({
                    ...prev,
                    activeInstrument: prev.activeInstrument + 1,
                    learningProgress: 0,
                    commonPatterns: [...new Set([...prev.commonPatterns, "Reading Notes", "Rhythm"])]
                }));
            }
        }
    }, [state.learningProgress, instruments]);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-8">
                <Brain className="w-12 h-12 text-blue-500 mr-4" />
                <h1 className="text-2xl font-bold">Meta-Learning Orchestra</h1>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Learning Progress</h2>
                    <div className="flex items-center space-x-4">
                        {instruments[state.activeInstrument]?.icon}
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-500 rounded-full h-4 transition-all duration-300"
                                style={{ width: `${state.learningProgress}%` }}
                                role="progressbar"
                                aria-valuenow={state.learningProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Common Patterns</h2>
                    <div className="space-y-2">
                        {state.commonPatterns.map((pattern, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-green-500" />
                                <span>{pattern}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                {instruments.map((instrument, index) => (
                    <div
                        key={instrument.id}
                        className={`p-4 rounded-lg border-2 ${
                            index === state.activeInstrument
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            {instrument.icon}
                            <span className="font-semibold">{instrument.name}</span>
                            {instrument.learned && (
                                <Check className="w-5 h-5 text-green-500" />
                            )}
                        </div>
                        <ul className="text-sm space-y-1">
                            {instrument.skills.map((skill, idx) => (
                                <li key={idx} className="flex items-center space-x-2">
                                    <ArrowRight className="w-4 h-4" />
                                    <span>{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}