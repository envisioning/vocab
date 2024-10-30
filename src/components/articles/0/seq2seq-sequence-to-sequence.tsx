"use client";
import { useState, useEffect } from "react";
import {
  Brain,
  ArrowRight,
  MessageCircle,
  Zap,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface Sequence {
  input: string[];
  context: string[];
  output: string[];
}

interface AnimationState {
  currentStep: number;
  isProcessing: boolean;
  isComplete: boolean;
}

const SEQUENCES: Sequence[] = [
  {
    input: ["Hello", "how", "are", "you"],
    context: ["greeting", "question", "state", "subject"],
    output: ["Hola", "cómo", "estás"],
  },
  {
    input: ["2", "cups", "flour"],
    context: ["quantity", "measure", "ingredient"],
    output: ["250", "grams", "harina"],
  },
  {
    input: ["The", "cat", "is", "sleeping"],
    context: ["article", "subject", "verb", "state"],
    output: ["Le", "chat", "dort"],
  },
  {
    input: ["Turn", "right", "at", "intersection"],
    context: ["action", "direction", "preposition", "location"],
    output: ["Gire", "a", "la", "derecha", "en", "la", "intersección"],
  },
  {
    input: ["Yesterday", "I", "bought", "a", "book"],
    context: ["time", "subject", "verb", "article", "object"],
    output: ["Gestern", "habe", "ich", "ein", "Buch", "gekauft"],
  },
];

export default function Seq2SeqVisualizer() {
  const [currentSequence, setCurrentSequence] = useState<number>(
    Math.floor(Math.random() * SEQUENCES.length)
  );
  const [animation, setAnimation] = useState<AnimationState>({
    currentStep: 0,
    isProcessing: false,
    isComplete: false,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying || animation.isComplete) return;

    const timer = setInterval(() => {
      setAnimation((prev) => {
        const nextStep = prev.currentStep + 1;
        const sequence = SEQUENCES[currentSequence];
        const maxSteps = sequence.input.length + sequence.output.length + 2;

        const isSequenceComplete = nextStep > maxSteps;

        if (isSequenceComplete) {
          // Get a random new sequence, but ensure it's different from the current one
          let nextSequence;
          do {
            nextSequence = Math.floor(Math.random() * SEQUENCES.length);
          } while (nextSequence === currentSequence && SEQUENCES.length > 1);

          setCurrentSequence(nextSequence);
          return {
            currentStep: 0,
            isProcessing: false,
            isComplete: false,
          };
        }

        return {
          currentStep: nextStep,
          isProcessing:
            nextStep >= sequence.input.length &&
            nextStep < maxSteps - sequence.output.length,
          isComplete: nextStep >= maxSteps,
        };
      });
    }, 500);

    return () => clearInterval(timer);
  }, [isPlaying, currentSequence, animation.isComplete]);

  const handleReset = () => {
    setAnimation({
      currentStep: 0,
      isProcessing: false,
      isComplete: false,
    });
    setCurrentSequence(Math.floor(Math.random() * SEQUENCES.length));
    setIsPlaying(true);
  };

  const sequence = SEQUENCES[currentSequence];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Sequence to Sequence Learning
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
            aria-label="Reset animation"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          className="bg-white p-4 rounded-lg shadow"
          role="region"
          aria-label="Encoder"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-blue-500" />
            <h3 className="font-semibold">Encoder</h3>
          </div>
          <div className="space-y-2">
            {sequence.input.map((word, idx) => (
              <div
                key={`input-${idx}`}
                className={`p-2 rounded transition-colors duration-300 ${
                  idx === animation.currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center"
          role="region"
          aria-label="Thought Vector"
        >
          <Brain
            className={`w-12 h-12 ${
              animation.isProcessing
                ? "text-green-500 animate-pulse"
                : "text-gray-400"
            }`}
          />
          <ArrowRight className="w-6 h-6 mt-4 text-gray-400" />
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow"
          role="region"
          aria-label="Decoder"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-blue-500" />
            <h3 className="font-semibold">Decoder</h3>
          </div>
          <div className="space-y-2">
            {sequence.output.map((word, idx) => (
              <div
                key={`output-${idx}`}
                className={`p-2 rounded transition-colors duration-300 ${
                  animation.currentStep >= sequence.input.length + 2 + idx
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
