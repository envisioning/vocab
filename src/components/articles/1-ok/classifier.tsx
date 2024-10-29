"use client"
import { useState, useEffect } from "react";
import { Bird, Fish, Cat, Dog, Brain, Book, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Animal {
    id: number;
    type: 'bird' | 'fish' | 'cat' | 'dog';
    features: {
        size: number;
        legs: number;
        hasWings: boolean;
        hasFins: boolean;
    };
}

interface ClassifierZooProps {}

const ANIMALS: Animal[] = [
    { id: 1, type: 'bird', features: { size: 1, legs: 2, hasWings: true, hasFins: false } },
    { id: 2, type: 'fish', features: { size: 2, legs: 0, hasWings: false, hasFins: true } },
    { id: 3, type: 'cat', features: { size: 3, legs: 4, hasWings: false, hasFins: false } },
    { id: 4, type: 'dog', features: { size: 4, legs: 4, hasWings: false, hasFins: false } }
];

/**
 * ClassifierZoo: An interactive component teaching classification concepts
 * through a zoo metaphor for 15-18 year old students.
 */
export default function ClassifierZoo({}: ClassifierZooProps) {
    const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
    const [score, setScore] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [isTraining, setIsTraining] = useState<boolean>(true);

    useEffect(() => {
        if (isTraining) {
            const interval = setInterval(() => {
                const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
                setCurrentAnimal(randomAnimal);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isTraining]);

    const handleClassification = (selectedType: Animal['type']) => {
        if (!currentAnimal) return;

        const isCorrect = selectedType === currentAnimal.type;
        setScore(prev => isCorrect ? prev + 1 : prev);
        setFeedback(isCorrect ? "Correct! Great classification!" : "Not quite right. Try again!");
        
        setTimeout(() => setFeedback(""), 2000);
    };

    const getAnimalIcon = (type: Animal['type']) => {
        switch (type) {
            case 'bird': return <Bird className="w-12 h-12 text-blue-500" />;
            case 'fish': return <Fish className="w-12 h-12 text-blue-500" />;
            case 'cat': return <Cat className="w-12 h-12 text-blue-500" />;
            case 'dog': return <Dog className="w-12 h-12 text-blue-500" />;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="w-8 h-8 text-blue-500" />
                    Classifier Zoo
                </h1>
                <div className="flex items-center gap-2">
                    <Book className="w-6 h-6 text-gray-600" />
                    <span>Score: {score}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Current Animal</h2>
                    {currentAnimal && (
                        <div className="flex flex-col items-center">
                            {getAnimalIcon(currentAnimal.type)}
                            <ul className="mt-4 space-y-2">
                                <li>Size: {currentAnimal.features.size}</li>
                                <li>Legs: {currentAnimal.features.legs}</li>
                                <li>Wings: {currentAnimal.features.hasWings ? "Yes" : "No"}</li>
                                <li>Fins: {currentAnimal.features.hasFins ? "Yes" : "No"}</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Classify This Animal</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['bird', 'fish', 'cat', 'dog'].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleClassification(type as Animal['type'])}
                                className="p-4 bg-gray-100 rounded-lg hover:bg-blue-100 
                                         transition duration-300 flex flex-col items-center gap-2"
                                aria-label={`Classify as ${type}`}
                            >
                                {getAnimalIcon(type as Animal['type'])}
                                <span className="capitalize">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${
                    feedback.includes("Correct") ? "bg-green-100" : "bg-red-100"
                }`}>
                    {feedback.includes("Correct") ? 
                        <CheckCircle2 className="w-6 h-6 text-green-500" /> :
                        <XCircle className="w-6 h-6 text-red-500" />
                    }
                    <span>{feedback}</span>
                </div>
            )}
        </div>
    );
}