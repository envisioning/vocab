"use client"
import { useState, useEffect } from "react";
import { Brush, Eye, EyeOff, RefreshCw, AlertTriangle, Check } from "lucide-react";

interface PixelPosition {
  x: number;
  y: number;
}

interface ClassificationResult {
  label: string;
  confidence: number;
}

const INITIAL_CLASSIFICATION: ClassificationResult = {
  label: "Stop Sign",
  confidence: 98.5
};

const VULNERABLE_AREAS: PixelPosition[] = [
  { x: 100, y: 100 },
  { x: 150, y: 150 },
  { x: 200, y: 200 }
];

/**
 * AdversarialAttackDemo teaches students about adversarial attacks through
 * interactive image manipulation
 */
export default function AdversarialAttackDemo() {
  const [brushSize, setBrushSize] = useState<number>(5);
  const [modifications, setModifications] = useState<PixelPosition[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [classification, setClassification] = useState<ClassificationResult>(INITIAL_CLASSIFICATION);

  useEffect(() => {
    const canvas = document.getElementById('modificationCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawModifications(ctx);
    }

    return () => {
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [modifications]);

  useEffect(() => {
    if (modifications.length > 0) {
      const newConfidence = Math.max(
        INITIAL_CLASSIFICATION.confidence - (modifications.length * 0.5),
        0
      );
      
      setClassification({
        label: newConfidence < 50 ? "Yield Sign" : "Stop Sign",
        confidence: newConfidence
      });
    }

    return () => setClassification(INITIAL_CLASSIFICATION);
  }, [modifications]);

  const drawModifications = (ctx: CanvasRenderingContext2D) => {
    modifications.forEach(pos => {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const newPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setModifications(prev => [...prev, newPos]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setModifications(prev => [...prev, newPos]);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    setModifications([]);
    setClassification(INITIAL_CLASSIFICATION);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">The Sneaky Pixel Game</h1>
      
      <div className="flex gap-6 mb-6">
        <div className="relative">
          <canvas
            id="modificationCanvas"
            width="400"
            height="400"
            className="border-2 border-gray-300 rounded-lg bg-white"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            role="img"
            aria-label="Interactive canvas for adversarial attack demonstration"
          />
          {showHeatmap && (
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/20" />
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-bold mb-2">AI Classification</h2>
            <div className="flex items-center gap-2">
              {classification.confidence < 50 ? (
                <AlertTriangle className="text-red-500" />
              ) : (
                <Check className="text-green-500" />
              )}
              <span>{classification.label}</span>
              <span className="ml-2">({classification.confidence.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <Brush className="w-4 h-4" />
              Brush Size
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            {showHeatmap ? <EyeOff /> : <Eye />}
            {showHeatmap ? 'Hide' : 'Show'} Vulnerable Areas
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
          >
            <RefreshCw />
            Reset Image
          </button>
        </div>
      </div>
    </div>
  );
}