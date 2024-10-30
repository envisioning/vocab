"use client"
import { useState, useEffect } from "react";
import { MapPin, Zap, RefreshCw, Compass } from "lucide-react";

interface Word {
  text: string;
  x: number;
  y: number;
}

interface ComponentProps {}

const WORDS: Word[] = [
  { text: "King", x: 80, y: 20 },
  { text: "Queen", x: 80, y: 80 },
  { text: "Man", x: 20, y: 20 },
  { text: "Woman", x: 20, y: 80 },
  { text: "Prince", x: 60, y: 40 },
  { text: "Princess", x: 60, y: 60 },
];

const OPERATIONS = [
  { text: "King - Man + Woman", result: "Queen" },
  { text: "Prince - Man + Woman", result: "Princess" },
];

/**
 * WordVectorExplorer: An interactive component to teach word vectors.
 * It visualizes words as points in 2D space and demonstrates vector operations.
 */
const WordVectorExplorer: React.FC<ComponentProps> = () => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [operation, setOperation] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setInterval(() => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setSelectedWord(randomWord);
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnimating]);

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setIsAnimating(false);
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value);
    const selectedOperation = OPERATIONS.find(op => op.text === e.target.value);
    setResult(selectedOperation ? selectedOperation.result : "");
  };

  const resetAnimation = () => {
    setSelectedWord(null);
    setOperation("");
    setResult("");
    setIsAnimating(true);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Word Vector Explorer</h2>
      <div className="relative h-80 bg-white border-2 border-gray-300 rounded-lg mb-4">
        {WORDS.map((word, index) => (
          <button
            key={index}
            className={`absolute p-2 rounded-full transition-all duration-300 ${
              selectedWord === word ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            style={{ left: `${word.x}%`, top: `${word.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => handleWordClick(word)}
            aria-label={`Select word ${word.text}`}
          >
            {word.text}
          </button>
        ))}
        {selectedWord && (
          <div
            className="absolute bg-green-500 text-white p-2 rounded-full transition-all duration-300"
            style={{ left: `${selectedWord.x}%`, top: `${selectedWord.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <MapPin size={24} />
          </div>
        )}
      </div>
      <div className="flex items-center mb-4">
        <Compass className="text-gray-600 mr-2" />
        <select
          className="bg-white border border-gray-300 rounded-md p-2 flex-grow"
          value={operation}
          onChange={handleOperationChange}
          aria-label="Select vector operation"
        >
          <option value="">Select an operation</option>
          {OPERATIONS.map((op, index) => (
            <option key={index} value={op.text}>
              {op.text}
            </option>
          ))}
        </select>
      </div>
      {result && (
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800 font-semibold flex items-center">
            <Zap className="mr-2" /> Result: {result}
          </p>
        </div>
      )}
      <button
        className="bg-gray-500 text-white p-2 rounded-md flex items-center justify-center w-full transition-colors duration-300 hover:bg-gray-600"
        onClick={resetAnimation}
        aria-label="Reset animation"
      >
        <RefreshCw className="mr-2" /> Reset
      </button>
    </div>
  );
};

export default WordVectorExplorer;