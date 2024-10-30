"use client"
import { useState, useEffect } from "react";
import { MoveHorizontal, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ContextLensProps {}

type TextSegment = {
  id: number;
  text: string;
  question: string;
  answer: string;
};

const TEXT_SEGMENTS: TextSegment[] = [
  {
    id: 1,
    text: "The bank was steep and covered in moss. Sarah needed to bank the money she earned from her summer job. Near the bank, fish were swimming peacefully.",
    question: "What does 'bank' mean in the visible context?",
    answer: "The meaning changes based on context: riverbank, financial institution, and to deposit money"
  },
  {
    id: 2,
    text: "The light waves crashed against the rocks. The feather was so light it floated away. She had to light the candle in the dark room.",
    question: "How does the meaning of 'light' change?",
    answer: "It means: not heavy, illumination, and to ignite something"
  }
];

const ContextLens: React.FC<ContextLensProps> = () => {
  const [lensPosition, setLensPosition] = useState<number>(0);
  const [lensWidth, setLensWidth] = useState<number>(150);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLensPosition(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowRight') {
        setLensPosition(prev => Math.min(400, prev + 10));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const container = e.currentTarget.getBoundingClientRect();
      const newPosition = e.clientX - container.left;
      setLensPosition(Math.max(0, Math.min(400 - lensWidth, newPosition)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setLensPosition(0);
    setLensWidth(150);
    setShowQuestion(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Context Lens Explorer</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLensWidth(prev => Math.min(prev + 50, 300))}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            aria-label="Increase lens size"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setLensWidth(prev => Math.max(prev - 50, 100))}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            aria-label="Decrease lens size"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
            aria-label="Reset lens"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div
        className="relative h-32 bg-gray-200 rounded cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="slider"
        aria-label="Context lens position"
      >
        <div className="absolute inset-0 p-4 text-lg blur-sm">
          {TEXT_SEGMENTS[currentTextIndex].text}
        </div>
        <div
          className="absolute top-0 h-full bg-white shadow-lg transition-all duration-300"
          style={{
            left: `${lensPosition}px`,
            width: `${lensWidth}px`
          }}
        >
          <div className="p-4 text-lg">
            {TEXT_SEGMENTS[currentTextIndex].text}
          </div>
        </div>
        <MoveHorizontal className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" />
      </div>

      <button
        onClick={() => setShowQuestion(!showQuestion)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        {showQuestion ? "Hide Question" : "Show Question"}
      </button>

      {showQuestion && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-bold">{TEXT_SEGMENTS[currentTextIndex].question}</p>
          <p className="mt-2 text-gray-600">{TEXT_SEGMENTS[currentTextIndex].answer}</p>
        </div>
      )}
    </div>
  );
};

export default ContextLens;