"use client"
import { useState, useEffect } from "react";
import { Bird, Chameleon, Elephant, Owl, Peacock } from "lucide-react";

interface Animal {
  name: string;
  icon: React.ElementType;
  description: string;
  ability: string;
}

const animals: Animal[] = [
  {
    name: "Parrot",
    icon: Bird,
    description: "Mimics and slightly modifies existing text",
    ability: "Repeat a phrase with small changes",
  },
  {
    name: "Chameleon",
    icon: Chameleon,
    description: "Adapts to different writing styles",
    ability: "Transform text into various styles",
  },
  {
    name: "Elephant",
    icon: Elephant,
    description: "Retains vast amounts of information",
    ability: "Recall information from training data",
  },
  {
    name: "Owl",
    icon: Owl,
    description: "Comprehends complex language",
    ability: "Understand and answer questions",
  },
  {
    name: "Peacock",
    icon: Peacock,
    description: "Generates new, creative text",
    ability: "Create original content",
  },
];

/**
 * LanguageModelZoo: An interactive component teaching Deep Language Models
 * to 15-18 year old students through animal metaphors.
 */
const LanguageModelZoo: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [demoText, setDemoText] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedAnimal) {
      setIsAnimating(true);
      timer = setTimeout(() => {
        demonstrateAbility(selectedAnimal);
        setIsAnimating(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
      setIsAnimating(false);
    };
  }, [selectedAnimal]);

  const demonstrateAbility = (animal: Animal) => {
    switch (animal.name) {
      case "Parrot":
        setDemoText("Hello! Hello there! Hi there, friend!");
        break;
      case "Chameleon":
        setDemoText("Formal: Greetings. Casual: Hey! Poetic: Salutations, dear one.");
        break;
      case "Elephant":
        setDemoText("The capital of France is Paris. It was founded in 3rd century BC.");
        break;
      case "Owl":
        setDemoText("Q: What's the boiling point of water? A: 100°C or 212°F at sea level.");
        break;
      case "Peacock":
        setDemoText("Once upon a time in a digital realm, bits and bytes danced...");
        break;
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">The Language Model Zoo</h1>
      <p className="mb-4 text-center">Explore the abilities of Deep Language Models!</p>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {animals.map((animal) => (
          <button
            key={animal.name}
            onClick={() => setSelectedAnimal(animal)}
            className={`p-4 rounded-lg flex flex-col items-center transition-colors duration-300 ${
              selectedAnimal?.name === animal.name ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"
            }`}
            aria-pressed={selectedAnimal?.name === animal.name}
          >
            <animal.icon className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">{animal.name}</span>
          </button>
        ))}
      </div>

      {selectedAnimal && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{selectedAnimal.name}</h2>
          <p className="mb-2">{selectedAnimal.description}</p>
          <p className="font-medium mb-2">Ability: {selectedAnimal.ability}</p>
          <div className="h-20 flex items-center justify-center bg-gray-100 rounded">
            {isAnimating ? (
              <div className="animate-pulse">Demonstrating ability...</div>
            ) : (
              <p className="text-sm italic">{demoText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageModelZoo;