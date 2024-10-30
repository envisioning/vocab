"use client"
import { useState, useEffect, useRef } from "react";
import { Wave, Sliders, RefreshCw, Music, Palette } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

type WaveComponent = {
  frequency: number;
  amplitude: number;
  enabled: boolean;
};

const FourierFeatures = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [waveComponents, setWaveComponents] = useState<WaveComponent[]>([
    { frequency: 1, amplitude: 0.5, enabled: true },
    { frequency: 2, amplitude: 0.3, enabled: true },
    { frequency: 4, amplitude: 0.2, enabled: true },
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPoints([newPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleAmplitudeChange = (index: number, value: number) => {
    setWaveComponents((prev) =>
      prev.map((comp, i) =>
        i === index ? { ...comp, amplitude: value } : comp
      )
    );
  };

  const handleToggleWave = (index: number) => {
    setWaveComponents((prev) =>
      prev.map((comp, i) =>
        i === index ? { ...comp, enabled: !comp.enabled } : comp
      )
    );
  };

  const resetCanvas = () => {
    setPoints([]);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    drawCanvas();
  }, [points]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Wave className="text-blue-500" />
          The Wave Painter
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Music className="w-4 h-4" />
          <span>Like a music equalizer breaks down sound...</span>
          <Palette className="w-4 h-4 ml-4" />
          <span>...we break down patterns into waves!</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border rounded bg-white cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <button
            onClick={resetCanvas}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Canvas
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sliders className="text-blue-500" />
            Wave Components
          </h3>
          {waveComponents.map((comp, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => handleToggleWave(index)}
                  className={`px-3 py-1 rounded ${
                    comp.enabled
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Wave {index + 1}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={comp.amplitude}
                  onChange={(e) =>
                    handleAmplitudeChange(index, parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FourierFeatures;