"use client"
import { useState, useEffect } from "react";
import { Eye, EyeOff, Book, FastForward, Rewind, Play, Pause } from "lucide-react";

interface MaskingLessonProps {}

type WordState = {
  word: string;
  revealed: boolean;
  predicted?: string;
};

const SAMPLE_SENTENCE = [
  "The",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "the",
  "lazy",
  "dog"
];

const PREDICTIONS = {
  "The": ["quick", "big", "small"],
  "quick": ["brown", "red", "blue"],
  "brown": ["fox", "dog", "cat"],
  "fox": ["jumps", "runs", "walks"],
  "jumps": ["over", "through", "under"],
  "over": ["the", "a", "that"],
  "the": ["lazy", "sleeping", "tired"],
  "lazy": ["dog", "cat", "wolf"],
};

/**
 * Interactive component teaching masking concepts through sequential word revelation
 */
const MaskingLesson: React.FC<MaskingLessonProps> = () => {
  const [words, setWords] = useState<WordState[]>(
    SAMPLE_SENTENCE.map(word => ({ word, revealed: false }))
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showPredictions, setShowPredictions] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && currentIndex < words.length) {
      timer = setTimeout(() => {
        setWords(prev => 
          prev.map((word, idx) => 
            idx === currentIndex ? { ...word, revealed: true } : word
          )
        );
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, words.length]);

  const handleReset = () => {
    setWords(SAMPLE_SENTENCE.map(word => ({ word, revealed: false })));
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const getPredictions = (currentWord: string): string[] => {
    return PREDICTIONS[currentWord as keyof typeof PREDICTIONS] || [];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Time-Locked Message Decoder
      </h2>

      <div className="flex flex-wrap gap-4 mb-8">
        {words.map((wordState, idx) => (
          <div
            key={idx}
            className={`relative p-4 border rounded-lg transition-all duration-300
              ${wordState.revealed ? 'bg-white' : 'bg-gray-200'}`}
            role="button"
            tabIndex={0}
            aria-label={`Word ${idx + 1}${wordState.revealed ? ': ' + wordState.word : ': hidden'}`}
          >
            {wordState.revealed ? (
              <span className="text-lg font-medium">{wordState.word}</span>
            ) : (
              <div className="flex items-center space-x-2">
                <EyeOff className="w-5 h-5 text-gray-500" />
                <span className="w-16 h-4 bg-gray-300 rounded"></span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPredictions && currentIndex > 0 && currentIndex < words.length && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Possible Next Words:</h3>
          <div className="flex gap-2">
            {getPredictions(words[currentIndex - 1].word).map((pred, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
              >
                {pred}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
          aria-label="Reset"
        >
          <Rewind className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowPredictions(!showPredictions)}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
          aria-label={showPredictions ? 'Hide predictions' : 'Show predictions'}
        >
          {showPredictions ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default MaskingLesson;