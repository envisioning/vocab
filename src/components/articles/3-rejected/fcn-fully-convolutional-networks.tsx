"use client"
import { useState, useEffect } from "react";
import { ImageIcon, Layers, Brush, Eye, EyeOff, Palette, RefreshCw } from "lucide-react";

interface SegmentationLayer {
    id: number;
    name: string;
    color: string;
    visible: boolean;
}

interface CanvasPosition {
    x: number;
    y: number;
}

interface FCNVisualizerProps {
    width?: number;
    height?: number;
}

const INITIAL_LAYERS: SegmentationLayer[] = [
    { id: 1, name: "Background", color: "#6B7280", visible: true },
    { id: 2, name: "Objects", color: "#3B82F6", visible: true },
    { id: 3, name: "Details", color: "#22C55E", visible: true },
];

/**
 * FCN Visualizer Component
 * Interactive educational tool for understanding Fully Convolutional Networks
 */
const FCNVisualizer: React.FC<FCNVisualizerProps> = ({ width = 800, height = 400 }) => {
    const [layers, setLayers] = useState<SegmentationLayer[]>(INITIAL_LAYERS);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [currentPosition, setCurrentPosition] = useState<CanvasPosition | null>(null);
    const [segmentationLevel, setSegmentationLevel] = useState<number>(50);
    const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

    useEffect(() => {
        const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
        const ctx = canvas?.getContext("2d");
        
        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
        }

        return () => {
            if (ctx) {
                ctx.clearRect(0, 0, width, height);
            }
        };
    }, [width, height]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        setCurrentPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentPosition) return;

        const canvas = e.currentTarget;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const newPosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(currentPosition.x, currentPosition.y);
            ctx.lineTo(newPosition.x, newPosition.y);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.stroke();
        }

        setCurrentPosition(newPosition);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setCurrentPosition(null);
    };

    const toggleLayer = (layerId: number) => {
        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
            )
        );
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">FCN Visualizer</h2>
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    {showHeatmap ? <EyeOff size={20} /> : <Eye size={20} />}
                    Heatmap
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <canvas
                        id="drawingCanvas"
                        width={width}
                        height={height}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="border border-gray-300 rounded-lg cursor-crosshair"
                        role="img"
                        aria-label="Drawing canvas for FCN visualization"
                    />
                </div>

                <div className="w-48 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {layers.map(layer => (
                            <button
                                key={layer.id}
                                onClick={() => toggleLayer(layer.id)}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200"
                                style={{ color: layer.color }}
                            >
                                {layer.visible ? <Layers size={20} /> : <ImageIcon size={20} />}
                                {layer.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="segmentation" className="text-sm font-medium">
                            Segmentation Level
                        </label>
                        <input
                            type="range"
                            id="segmentation"
                            min="0"
                            max="100"
                            value={segmentationLevel}
                            onChange={(e) => setSegmentationLevel(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FCNVisualizer;