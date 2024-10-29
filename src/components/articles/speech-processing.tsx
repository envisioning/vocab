"use client"
import { useState, useEffect } from "react";
import { Mic, WaveformIcon, Brain, MessageSquare, VolumeX, Volume2, Workflow } from "lucide-react";

interface ProcessingStage {
    id: number;
    name: string;
    icon: JSX.Element;
    description: string;
}

interface AudioState {
    isRecording: boolean;
    noiseLevel: number;
    frequency: number;
    text: string;
}

const PROCESSING_STAGES: ProcessingStage[] = [
    { id: 1, name: "Input", icon: <Mic className="w-6 h-6" />, description: "Capture voice input" },
    { id: 2, name: "Cleanup", icon: <VolumeX className="w-6 h-6" />, description: "Remove background noise" },
    { id: 3, name: "Analysis", icon: <WaveformIcon className="w-6 h-6" />, description: "Analyze sound patterns" },
    { id: 4, name: "Processing", icon: <Brain className="w-6 h-6" />, description: "Convert to meaning" },
    { id: 5, name: "Output", icon: <MessageSquare className="w-6 h-6" />, description: "Generate text output" }
];

export default function SpeechProcessingExplorer() {
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [audioState, setAudioState] = useState<AudioState>({
        isRecording: false,
        noiseLevel: 50,
        frequency: 0,
        text: ""
    });
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setCurrentStage(prev => (prev + 1) % (PROCESSING_STAGES.length + 1));
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isAnimating]);

    const handleNoiseControl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAudioState(prev => ({
            ...prev,
            noiseLevel: Number(e.target.value)
        }));
    };

    const toggleRecording = () => {
        setAudioState(prev => ({
            ...prev,
            isRecording: !prev.isRecording
        }));
        setIsAnimating(!isAnimating);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Speech Processing Explorer</h2>
            
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                    <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            audioState.isRecording ? 'bg-red-500' : 'bg-blue-500'
                        } text-white transition duration-300`}
                        aria-label={audioState.isRecording ? 'Stop Recording' : 'Start Recording'}
                    >
                        <Mic className="w-5 h-5" />
                        {audioState.isRecording ? 'Stop' : 'Start'}
                    </button>

                    <div className="flex items-center gap-4">
                        <VolumeX className="w-5 h-5 text-gray-600" />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={audioState.noiseLevel}
                            onChange={handleNoiseControl}
                            className="w-32"
                            aria-label="Noise Level"
                        />
                        <Volume2 className="w-5 h-5 text-gray-600" />
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between mb-8">
                        {PROCESSING_STAGES.map((stage) => (
                            <div
                                key={stage.id}
                                className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                                    currentStage === stage.id ? 'bg-blue-100 scale-110' : 'bg-gray-100'
                                }`}
                            >
                                {stage.icon}
                                <span className="mt-2 text-sm font-medium">{stage.name}</span>
                                <span className="text-xs text-gray-600 mt-1">{stage.description}</span>
                            </div>
                        ))}
                    </div>
                    
                    <Workflow 
                        className={`w-full h-1 absolute top-1/2 -z-10 text-blue-500 ${
                            isAnimating ? 'animate-pulse' : ''
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}