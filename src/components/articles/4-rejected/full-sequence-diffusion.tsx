"use client"
import { useState, useEffect } from "react";
import { Shuffle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

interface ComponentProps {}

type PuzzlePiece = {
  id: number;
  opacity: number;
};

const INITIAL_PIECES: PuzzlePiece[] = Array.from({ length: 16 }, (_, i) => ({ id: i, opacity: 1 }));

/**
 * FullSequenceDiffusion: A component to visualize the concept of Full-Sequence Diffusion
 * using a puzzle metaphor.
 */
const FullSequenceDiffusion: React.FC<ComponentProps> = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(INITIAL_PIECES);
  const [isDiffusing, setIsDiffusing] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (isDiffusing) {
      const timer = setTimeout(() => {
        if (step < 10) {
          setPieces(prevPieces =>
            prevPieces.map(piece => ({
              ...piece,
              opacity: Math.max(0, piece.opacity - 0.1)
            }))
          );
          setStep(prevStep => prevStep + 1);
        } else {
          setIsDiffusing(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isDiffusing, step]);

  const handleDiffuse = () => {
    setIsDiffusing(true);
    setStep(0);
  };

  const handleReverse = () => {
    setPieces(INITIAL_PIECES);
    setStep(0);
    setIsDiffusing(false);
  };

  const handleStepForward = () => {
    if (step < 10) {
      setPieces(prevPieces =>
        prevPieces.map(piece => ({
          ...piece,
          opacity: Math.max(0, piece.opacity - 0.1)
        }))
      );
      setStep(prevStep => prevStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (step > 0) {
      setPieces(prevPieces =>
        prevPieces.map(piece => ({
          ...piece,
          opacity: Math.min(1, piece.opacity + 0.1)
        }))
      );
      setStep(prevStep => prevStep - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Full-Sequence Diffusion Visualizer</h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {pieces.map(piece => (
          <div
            key={piece.id}
            className="w-16 h-16 bg-blue-500 rounded-md transition-opacity duration-300"
            style={{ opacity: piece.opacity }}
          />
        ))}
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleDiffuse}
          disabled={isDiffusing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          aria-label="Start diffusion process"
        >
          <Shuffle className="w-5 h-5" />
        </button>
        <button
          onClick={handleStepBackward}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
          aria-label="Step backward"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleStepForward}
          disabled={step === 10}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
          aria-label="Step forward"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={handleReverse}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
          aria-label="Reset puzzle"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center max-w-md">
        This puzzle represents data undergoing Full-Sequence Diffusion. All pieces change simultaneously, mimicking how entire data sequences are processed at once.
      </p>
    </div>
  );
};

export default FullSequenceDiffusion;