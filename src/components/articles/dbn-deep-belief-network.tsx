"use client"
import { useState, useEffect } from "react";
import { Building2, Image as ImageIcon, ArrowUpDown, Brain, Layers } from "lucide-react";

interface GalleryLayer {
    id: number;
    name: string;
    features: string[];
    complexity: number;
}

interface DraggedImage {
    id: string;
    position: { x: number; y: number };
    features: string[];
}

const GALLERY_LAYERS: GalleryLayer[] = [
    { id: 1, name: "Basic Features", features: ["Lines", "Colors", "Edges"], complexity: 0.2 },
    { id: 2, name: "Patterns", features: ["Textures", "Simple Shapes", "Gradients"], complexity: 0.4 },
    { id: 3, name: "Compositions", features: ["Objects", "Arrangements", "Depth"], complexity: 0.7 },
    { id: 4, name: "Abstract Concepts", features: ["Style", "Theme", "Mood"], complexity: 1 }
];

export default function DBNGalleryExplorer() {
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [draggedImages, setDraggedImages] = useState<DraggedImage[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [learningProgress, setLearningProgress] = useState<number>(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setLearningProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(progressInterval);
    }, []);

    const handleLayerClick = (layerId: number) => {
        setActiveLayer(layerId);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", "image");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setDraggedImages(prev => [...prev, {
            id: Date.now().toString(),
            position: { x, y },
            features: GALLERY_LAYERS[activeLayer].features
        }]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="w-full h-screen bg-gray-100 p-4">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setIsGenerating(!isGenerating)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    aria-label={isGenerating ? "Stop Generation" : "Start Generation"}
                >
                    <Brain className="w-5 h-5" />
                    {isGenerating ? "Stop Learning" : "Start Learning"}
                </button>

                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${learningProgress}%` }}
                        role="progressbar"
                        aria-valuenow={learningProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 h-[calc(100vh-8rem)]">
                <div className="col-span-1 bg-white rounded-lg p-4 shadow-lg">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Gallery Floors
                    </h2>
                    {GALLERY_LAYERS.map((layer) => (
                        <button
                            key={layer.id}
                            onClick={() => handleLayerClick(layer.id - 1)}
                            className={`w-full text-left p-2 mb-2 rounded ${
                                activeLayer === layer.id - 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            } transition duration-300`}
                        >
                            <div className="font-semibold">{layer.name}</div>
                            <div className="text-sm opacity-80">
                                Complexity: {(layer.complexity * 100).toFixed(0)}%
                            </div>
                        </button>
                    ))}
                </div>

                <div 
                    className="col-span-4 bg-white rounded-lg p-4 shadow-lg relative"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div
                        className="absolute top-4 right-4 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center cursor-move"
                        draggable
                        onDragStart={handleDragStart}
                    >
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>

                    {draggedImages.map((image) => (
                        <div
                            key={image.id}
                            className="absolute w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center"
                            style={{
                                left: image.position.x - 32,
                                top: image.position.y - 32
                            }}
                        >
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                        </div>
                    ))}

                    <div className="absolute bottom-4 left-4 text-sm text-gray-600">
                        Current Layer Features: {GALLERY_LAYERS[activeLayer].features.join(", ")}
                    </div>
                </div>
            </div>
        </div>
    );
}