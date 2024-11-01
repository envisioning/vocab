"use client"
import { useState, useEffect } from "react";
import { Brain, BookOpen, Database, Zap, Download, Upload, CheckCircle2, Info } from "lucide-react";

interface PretrainedModelProps {}

type TrainingStage = 'initial' | 'pretraining' | 'finetuning' | 'complete';

interface StageInfo {
    title: string;
    description: string;
    icon: JSX.Element;
    tooltip: string;
}

const STAGE_INFO: Record<TrainingStage, StageInfo> = {
    initial: {
        title: "Raw Data",
        description: "Starting with large datasets...",
        icon: <Database className="w-6 h-6" />,
        tooltip: "Massive datasets like Wikipedia articles, books, or images"
    },
    pretraining: {
        title: "Pretraining",
        description: "Learning fundamental patterns...",
        icon: <BookOpen className="w-6 h-6" />,
        tooltip: "Model learns general knowledge and patterns from diverse data"
    },
    finetuning: {
        title: "Fine-tuning",
        description: "Specializing for specific tasks...",
        icon: <Zap className="w-6 h-6" />,
        tooltip: "Adapting the model for specific applications like translation or classification"
    },
    complete: {
        title: "Ready!",
        description: "Model ready for deployment!",
        icon: <CheckCircle2 className="w-6 h-6" />,
        tooltip: "Trained model can now be used for real-world applications"
    }
};

const PretrainedModel: React.FC<PretrainedModelProps> = () => {
    const [stage, setStage] = useState<TrainingStage>('initial');
    const [progress, setProgress] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [activeTooltip, setActiveTooltip] = useState<TrainingStage | null>(null);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => {
                setStage(prev => {
                    if (prev === 'initial') return 'pretraining';
                    if (prev === 'pretraining') return 'finetuning';
                    if (prev === 'finetuning') return 'complete';
                    return prev;
                });
                setProgress(0);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [progress]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white flex items-center justify-center gap-3">
                    <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
                    Pretrained Model Journey
                </h1>

                <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8">
                        {Object.entries(STAGE_INFO).map(([key, info]) => (
                            <div 
                                key={key}
                                className="relative group"
                                onMouseEnter={() => setActiveTooltip(key as TrainingStage)}
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <div className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${stage === key ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' : 'text-gray-400'}`}>
                                    {info.icon}
                                    <span className="text-sm font-medium mt-2">{info.title}</span>
                                    <Info className="w-4 h-4 mt-2 opacity-50" />
                                </div>
                                {activeTooltip === key && (
                                    <div className="absolute z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg -bottom-12 left-1/2 transform -translate-x-1/2">
                                        {info.tooltip}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 transform"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    {!isPlaying && stage !== 'complete' && (
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                        >
                            <Upload className="w-5 h-5" />
                            {STAGE_INFO[stage].description}
                        </button>
                    )}
                    {stage === 'complete' && (
                        <button
                            onClick={() => {
                                setStage('initial');
                                setProgress(0);
                            }}
                            className="w-full sm:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                        >
                            <Download className="w-5 h-5" />
                            Start New Training
                        </button>
                    )}
                </div>

                <div className="text-center text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    {STAGE_INFO[stage].tooltip}
                </div>
            </div>
        </div>
    );
};

export default PretrainedModel;