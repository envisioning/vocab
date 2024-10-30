"use client"
import { useState, useEffect } from "react";
import { Camera, Cpu, Gauge, Zap, SkipForward, Eye } from "lucide-react";

interface Frame {
  id: number;
  content: string;
  similarity: number;
}

interface FrameDetectiveProps {}

const FRAME_CONTENTS = [
  "Person standing",
  "Person standing",
  "Person walking",
  "Person walking",
  "Person running",
  "Person running",
  "Person jumping",
  "Person standing",
];

const FrameDetective: React.FC<FrameDetectiveProps> = () => {
  const [threshold, setThreshold] = useState<number>(50);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let frameInterval: NodeJS.Timer;
    let currentIndex = 0;

    if (isRunning) {
      frameInterval = setInterval(() => {
        const newFrame: Frame = {
          id: Date.now(),
          content: FRAME_CONTENTS[currentIndex % FRAME_CONTENTS.length],
          similarity: Math.random() * 100,
        };

        setFrames(prev => {
          const updatedFrames = [...prev, newFrame].slice(-5);
          const shouldProcess = newFrame.similarity > threshold;
          
          if (shouldProcess) {
            setProcessedCount(p => p + 1);
          } else {
            setSkippedCount(s => s + 1);
          }
          
          return updatedFrames;
        });

        currentIndex++;
      }, 1000);
    }

    return () => clearInterval(frameInterval);
  }, [isRunning, threshold]);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThreshold(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Camera className="text-blue-500" />
          Frame Detective
        </h1>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={isRunning ? "Pause simulation" : "Start simulation"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye />
            Security Feed
          </h2>
          <div className="space-y-2">
            {frames.map(frame => (
              <div
                key={frame.id}
                className={`p-3 rounded ${
                  frame.similarity > threshold
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-100 border-gray-300"
                } border`}
              >
                <div className="flex justify-between items-center">
                  <span>{frame.content}</span>
                  {frame.similarity <= threshold && (
                    <SkipForward className="text-gray-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu />
            Processing Metrics
          </h2>
          
          <div className="mb-4">
            <label className="block mb-2 flex items-center gap-2">
              <Gauge size={20} />
              Similarity Threshold: {threshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={threshold}
              onChange={handleThresholdChange}
              className="w-full"
              aria-label="Adjust similarity threshold"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Processed Frames:</span>
              <span className="text-green-500">{processedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Skipped Frames:</span>
              <span className="text-gray-500">{skippedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Efficiency Gain:</span>
              <span className="text-blue-500 flex items-center gap-1">
                {skippedCount > 0
                  ? Math.round((skippedCount / (processedCount + skippedCount)) * 100)
                  : 0}
                %
                <Zap size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameDetective;