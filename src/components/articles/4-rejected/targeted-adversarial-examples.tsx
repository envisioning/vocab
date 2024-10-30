"use client"
import { useState, useEffect } from "react";
import { Image, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

interface ComponentProps {}

type ObjectType = {
  id: number;
  name: string;
  isAdversarial: boolean;
  targetMisclassification: string;
};

const OBJECTS: ObjectType[] = [
  { id: 1, name: "Cat", isAdversarial: false, targetMisclassification: "" },
  { id: 2, name: "Dog", isAdversarial: false, targetMisclassification: "" },
  { id: 3, name: "Bird", isAdversarial: true, targetMisclassification: "Plane" },
  { id: 4, name: "Car", isAdversarial: false, targetMisclassification: "" },
  { id: 5, name: "Tree", isAdversarial: true, targetMisclassification: "Broccoli" },
  { id: 6, name: "House", isAdversarial: false, targetMisclassification: "" },
];

/**
 * ShapeshifterChallenge: An interactive component teaching targeted adversarial examples.
 * Students classify objects, some of which are designed to trick the AI into specific misclassifications.
 */
const ShapeshifterChallenge: React.FC<ComponentProps> = () => {
  const [currentObject, setCurrentObject] = useState<ObjectType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameOver) {
        const nextObject = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
        setCurrentObject(nextObject);
        setShowExplanation(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentObject, gameOver]);

  const handleClassification = (classification: string) => {
    if (!currentObject) return;

    if (
      (currentObject.isAdversarial && classification === currentObject.targetMisclassification) ||
      (!currentObject.isAdversarial && classification === currentObject.name)
    ) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setScore((prevScore) => prevScore - 1);
    }

    setShowExplanation(true);

    if (score >= 10) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setCurrentObject(null);
    setShowExplanation(false);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="mb-4">Final Score: {score}</p>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">The Shapeshifter Challenge</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <Image className="w-16 h-16 text-gray-600" />
          <p className="ml-4 text-xl">{currentObject?.name || "Loading..."}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {OBJECTS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleClassification(obj.name)}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {obj.name}
            </button>
          ))}
        </div>
        {showExplanation && currentObject && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            {currentObject.isAdversarial ? (
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="mr-2" />
                <p>This was a shapeshifter designed to be misclassified as {currentObject.targetMisclassification}!</p>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                <p>Correct! This was a normal {currentObject.name}.</p>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl">Score: {score}</p>
          <button
            onClick={() => setShowExplanation(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Show explanation"
          >
            <HelpCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShapeshifterChallenge;