"use client"
import { useState, useEffect } from "react";
import { Headphones, FileText, EyeOff, Eye, RefreshCcw } from "lucide-react";

interface ComponentProps {}

type MaskingStrategy = "random" | "positional" | "custom";

/**
 * SequenceMaskingPlayground: An interactive component to teach sequence masking concepts.
 */
const SequenceMaskingPlayground: React.FC<ComponentProps> = () => {
  const [text, setText] = useState<string>("The quick brown fox jumps over the lazy dog");
  const [maskedText, setMaskedText] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<MaskingStrategy>("random");
  const [explanation, setExplanation] = useState<string>("");

  useEffect(() => {
    applyMasking();
    return () => {
      // Cleanup if needed
    };
  }, [text, strategy]);

  const applyMasking = () => {
    const words = text.split(" ");
    let masked: string[];

    switch (strategy) {
      case "random":
        masked = words.map(word => Math.random() > 0.5 ? "[MASK]" : word);
        setExplanation("Random masking: Some words are randomly masked.");
        break;
      case "positional":
        masked = words.map((word, index) => (index + 1) % 3 === 0 ? "[MASK]" : word);
        setExplanation("Positional masking: Every third word is masked.");
        break;
      case "custom":
        masked = words;
        setExplanation("Custom masking: Click on words to mask/unmask them.");
        break;
      default:
        masked = words;
    }
    setMaskedText(masked);
  };

  const toggleMask = (index: number) => {
    if (strategy !== "custom") return;
    const newMaskedText = [...maskedText];
    newMaskedText[index] = newMaskedText[index] === "[MASK]" ? text.split(" ")[index] : "[MASK]";
    setMaskedText(newMaskedText);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sequence Masking Playground</h1>

      <div className="mb-4">
        <label className="block mb-2">Select Masking Strategy:</label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as MaskingStrategy)}
          className="w-full p-2 border rounded"
        >
          <option value="random">Random Masking</option>
          <option value="positional">Positional Masking</option>
          <option value="custom">Custom Masking</option>
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Original Text:</h2>
        <p className="bg-white p-2 rounded">{text}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Masked Text:</h2>
        <div className="bg-white p-2 rounded">
          {maskedText.map((word, index) => (
            <span
              key={index}
              onClick={() => toggleMask(index)}
              className={`inline-block mr-1 mb-1 p-1 rounded ${
                word === "[MASK]" ? "bg-blue-200 cursor-pointer" : ""
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
        <p className="bg-white p-2 rounded">{explanation}</p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={applyMasking}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <RefreshCcw className="inline-block mr-2" />
          Reapply Masking
        </button>

        <div className="flex space-x-4">
          <Headphones className="text-gray-600" />
          <FileText className="text-gray-600" />
          <EyeOff className="text-gray-600" />
          <Eye className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default SequenceMaskingPlayground;