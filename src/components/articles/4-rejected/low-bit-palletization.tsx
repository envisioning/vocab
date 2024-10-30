"use client"
import { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Scale, Save, Image as ImageIcon } from "lucide-react";

interface ColorSimplifierProps {}

type BitDepth = 32 | 16 | 8 | 4 | 2 | 1;
type Challenge = {
  task: string;
  optimalBit: BitDepth;
  hint: string;
};

const SAMPLE_IMAGE = "/landscape.jpg";
const BIT_DEPTHS: BitDepth[] = [32, 16, 8, 4, 2, 1];
const CHALLENGES: Challenge[] = [
  { task: "Text Recognition", optimalBit: 2, hint: "Text needs clear edges, not colors" },
  { task: "Face Detection", optimalBit: 8, hint: "Faces need some detail, but not full color" },
  { task: "Shape Detection", optimalBit: 1, hint: "Shapes only need edges" }
];

/**
 * ColorSimplifier Studio - Interactive component teaching low-bit palletization
 */
export default function ColorSimplifier({}: ColorSimplifierProps) {
  const [bitDepth, setBitDepth] = useState<BitDepth>(32);
  const [zoom, setZoom] = useState<number>(1);
  const [currentChallenge, setCurrentChallenge] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        applyBitDepthEffect(ctx, bitDepth);
      }
    };

    img.src = SAMPLE_IMAGE;

    return () => {
      img.onload = null;
    };
  }, [bitDepth]);

  const applyBitDepthEffect = (ctx: CanvasRenderingContext2D, bits: BitDepth) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const colors = Math.pow(2, bits);
    const factor = 256 / colors;

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.floor(imageData.data[i] / factor) * factor;
      imageData.data[i + 1] = Math.floor(imageData.data[i + 1] / factor) * factor;
      imageData.data[i + 2] = Math.floor(imageData.data[i + 2] / factor) * factor;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleZoom = (increase: boolean) => {
    setZoom(prev => Math.max(1, Math.min(4, increase ? prev + 0.5 : prev - 0.5)));
  };

  const checkAnswer = (selectedBit: BitDepth) => {
    if (selectedBit === CHALLENGES[currentChallenge].optimalBit) {
      setScore(prev => prev + 1);
      setCurrentChallenge(prev => (prev + 1) % CHALLENGES.length);
    }
    setShowHint(true);
  };

  const memoryUsage = Math.round((bitDepth / 32) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Color Simplifier Studio</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <canvas
            id="preview-canvas"
            width="400"
            height="300"
            className="border rounded-lg transform"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        <div className="w-64 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Bit Depth Control</h2>
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={bitDepth}
              onChange={e => setBitDepth(Number(e.target.value) as BitDepth)}
              className="w-full"
            />
            <div className="text-sm text-gray-600">Current: {bitDepth}-bit</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Memory Usage</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${memoryUsage}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">{memoryUsage}% of original</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleZoom(true)}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              className="p-2 rounded bg-gray-200 hover:bg-gray-300"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-2">Challenge: {CHALLENGES[currentChallenge].task}</h2>
        <div className="flex gap-2 flex-wrap">
          {BIT_DEPTHS.map(depth => (
            <button
              key={depth}
              onClick={() => checkAnswer(depth)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-500 hover:text-white"
            >
              {depth}-bit
            </button>
          ))}
        </div>
        {showHint && (
          <p className="text-sm text-gray-600 mt-2">{CHALLENGES[currentChallenge].hint}</p>
        )}
        <div className="mt-2">Score: {score}/{CHALLENGES.length}</div>
      </div>
    </div>
  );
}