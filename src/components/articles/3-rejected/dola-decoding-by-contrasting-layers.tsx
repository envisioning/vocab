"use client"
import { useState, useEffect } from "react";
import { Brain, Layers, ArrowRight, Eye, EyeOff, Scale, Check, X } from "lucide-react";

interface LayerOutput {
    interpretation: string;
    confidence: number;
}

interface LayerState {
    id: number;
    active: boolean;
    output: LayerOutput;
}

const SAMPLE_TEXT = "The cat sat on the mat";
const LAYER_INTERPRETATIONS = [
    { interpretation: "Basic word patterns", confidence: 0.65 },
    { interpretation: "Syntactic relationships", confidence: 0.78 },
    { interpretation: "Contextual meaning", confidence: 0.85 },
];

export default function DoLaVisualizer() {
    const [layers, setLayers] = useState<LayerState[]>([]);
    const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [selectedLayers, setSelectedLayers] = useState<number[]>([]);
    const [finalDecision, setFinalDecision] = useState<string>("");

    useEffect(() => {
        const initLayers = LAYER_INTERPRETATIONS.map((output, idx) => ({
            id: idx,
            active: true,
            output
        }));
        setLayers(initLayers);

        return () => {
            setLayers([]);
            setSelectedLayers([]);
        };
    }, []);

    const handleLayerToggle = (layerId: number) => {
        setLayers(prev => prev.map(layer => 
            layer.id === layerId ? { ...layer, active: !layer.active } : layer
        ));
    };

    const handleLayerSelect = (layerId: number) => {
        setSelectedLayers(prev => 
            prev.includes(layerId) 
                ? prev.filter(id => id !== layerId)
                : [...prev, layerId]
        );
    };

    const processInput = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setFinalDecision("Enhanced understanding through layer contrast");
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="text-blue-500" />
                    <h2 className="text-xl font-bold">DoLa Decision Theater</h2>
                </div>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full p-2 border rounded"
                    aria-label="Input text for processing"
                />

                <button
                    onClick={processInput}
                    disabled={isProcessing}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    Process Text
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        className={`p-4 rounded-lg border ${
                            selectedLayers.includes(layer.id) ? 'border-blue-500' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Layer {layer.id + 1}</h3>
                            <button
                                onClick={() => handleLayerToggle(layer.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                                aria-label={layer.active ? 'Hide layer' : 'Show layer'}
                            >
                                {layer.active ? <Eye /> : <EyeOff />}
                            </button>
                        </div>
                        
                        {layer.active && (
                            <div className="space-y-2">
                                <p>{layer.output.interpretation}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${layer.output.confidence * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {finalDecision && (
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="font-bold flex items-center gap-2">
                        <Scale />
                        Final Decision
                    </h3>
                    <p className="mt-2">{finalDecision}</p>
                </div>
            )}
        </div>
    );
}