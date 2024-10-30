"use client"
import { useState, useEffect } from "react";
import { Brain, ChefHat, Languages, PawPrint, Eye, ThumbsUp, AlertCircle } from "lucide-react";

interface Animal {
    id: number;
    features: string[];
    category: string;
}

interface FewShotZooProps {}

const KNOWN_ANIMALS: Animal[] = [
    { id: 1, features: ["four legs", "tail", "fur"], category: "mammal" },
    { id: 2, features: ["wings", "feathers", "beak"], category: "bird" },
    { id: 3, features: ["scales", "fins", "gills"], category: "fish" },
];

const NEW_ANIMALS: Animal[] = [
    { id: 4, features: ["four legs", "scales", "tail"], category: "reptile" },
    { id: 5, features: ["eight legs", "exoskeleton"], category: "arthropod" },
];

const FewShotZoo: React.FC<FewShotZooProps> = () => {
    const [currentStage, setCurrentStage] = useState<number>(0);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string>("");
    const [isAnimating, setIsAnimating] = useState<boolean>(true);

    useEffect(() => {
        const timer = setInterval(() => {
            if (isAnimating) {
                setCurrentStage((prev) => (prev + 1) % 3);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [isAnimating]);

    const handleFeatureSelect = (feature: string) => {
        setSelectedFeatures((prev) => 
            prev.includes(feature) 
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const checkClassification = () => {
        const matchScore = selectedFeatures.filter(f => 
            NEW_ANIMALS[currentStage % NEW_ANIMALS.length].features.includes(f)
        ).length;
        
        setFeedback(matchScore >= 2 ? "Great pattern recognition!" : "Try observing more features");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Brain className="text-blue-500" />
                    Few Shot Learning Zoo
                </h1>
                <div className="flex gap-4">
                    <ChefHat className="text-gray-600" aria-label="Expert knowledge" />
                    <Languages className="text-gray-600" aria-label="Pattern recognition" />
                    <PawPrint className="text-gray-600" aria-label="Animal classification" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Known Patterns</h2>
                    <div className="space-y-3">
                        {KNOWN_ANIMALS.map((animal) => (
                            <div key={animal.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <Eye className="text-blue-500" />
                                <span>{animal.features.join(", ")}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">New Pattern Challenge</h2>
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded">
                            {NEW_ANIMALS[currentStage % NEW_ANIMALS.length].features.map((feature, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleFeatureSelect(feature)}
                                    className={`m-1 p-2 rounded ${
                                        selectedFeatures.includes(feature)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {feature}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={checkClassification}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Check Pattern
                        </button>
                        
                        {feedback && (
                            <div className="flex items-center gap-2 mt-2">
                                {feedback.includes("Great") ? (
                                    <ThumbsUp className="text-green-500" />
                                ) : (
                                    <AlertCircle className="text-blue-500" />
                                )}
                                <span>{feedback}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FewShotZoo;