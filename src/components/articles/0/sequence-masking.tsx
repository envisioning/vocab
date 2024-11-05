"use client"
import { useState, useEffect } from "react";
import {
  RefreshCcw,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";

interface ComponentProps {}

type MaskingStrategy = "random" | "positional" | "custom";
type Theme = "light" | "dark";

/**
 * SequenceMaskingPlayground: An interactive component demonstrating sequence masking concepts
 * with responsive design, dark mode, and helpful tooltips.
 */
const SequenceMaskingPlayground: React.FC<ComponentProps> = () => {
  const [text, setText] = useState<string>("The quick brown fox jumps over the lazy dog");
  const [maskedText, setMaskedText] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<MaskingStrategy>("random");
  const [explanation, setExplanation] = useState<string>("");
  const [theme, setTheme] = useState<Theme>("light");
  const [showHelp, setShowHelp] = useState<boolean>(false);

  useEffect(() => {
    // Check system color scheme preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(darkModeQuery.matches ? "dark" : "light");

    const updateTheme = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    darkModeQuery.addEventListener("change", updateTheme);
    applyMasking();

    return () => {
      darkModeQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  useEffect(() => {
    applyMasking();
  }, [text, strategy]);

  const applyMasking = () => {
    const words = text.split(" ");
    let masked: string[];

    switch (strategy) {
      case "random":
        masked = words.map(word => Math.random() > 0.5 ? "[MASK]" : word);
        setExplanation("Random masking demonstrates how models learn to predict missing words from context, similar to how humans can fill in blanks in sentences.");
        break;
      case "positional":
        masked = words.map((word, index) => (index + 1) % 3 === 0 ? "[MASK]" : word);
        setExplanation("Positional masking helps models understand structural patterns in language by consistently masking words at specific positions.");
        break;
      case "custom":
        masked = words;
        setExplanation("Custom masking allows you to experiment with different masking patterns and see how context affects word prediction.");
        break;
      default:
        masked = words;
    }
    setMaskedText(masked);
  };

  const toggleMask = (index: number) => {
    if (strategy !== "custom") {
      return;
    }
    const newMaskedText = [...maskedText];
    newMaskedText[index] = newMaskedText[index] === "[MASK]" ? text.split(" ")[index] : "[MASK]";
    setMaskedText(newMaskedText);
  };

  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const cardBg = theme === "dark" ? "bg-gray-700" : "bg-white";
  const buttonBg = theme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const maskBg = theme === "dark" ? "bg-blue-700" : "bg-blue-200";

  return (
    <div className={`p-4 ${bgColor} ${textColor} rounded-lg max-w-2xl mx-auto transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Sequence Masking Playground</h1>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <label className="block">Select Masking Strategy:</label>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="ml-2 text-blue-500 hover:text-blue-600"
            aria-label="Show help"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        {showHelp && (
          <div className={`${cardBg} p-3 rounded-lg mb-2 text-sm`}>
            <p>Sequence masking is a technique used in AI where certain parts of input text are hidden to help models learn context and relationships between words.</p>
          </div>
        )}
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as MaskingStrategy)}
          className={`w-full p-2 border rounded ${cardBg} ${textColor}`}
        >
          <option value="random">Random Masking</option>
          <option value="positional">Positional Masking</option>
          <option value="custom">Custom Masking</option>
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Original Text:</h2>
        <p className={`${cardBg} p-2 rounded text-sm md:text-base`}>{text}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Masked Text:</h2>
        <div className={`${cardBg} p-2 rounded`}>
          {maskedText.map((word, index) => (
            <span
              key={index}
              onClick={() => toggleMask(index)}
              className={`inline-block mr-1 mb-1 p-1 rounded text-sm md:text-base ${
                word === "[MASK]" ? `${maskBg} cursor-pointer` : ""
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Explanation:</h2>
        <p className={`${cardBg} p-2 rounded text-sm md:text-base`}>{explanation}</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={applyMasking}
          className={`${buttonBg} text-white px-4 py-2 rounded hover:opacity-90 transition duration-300 flex items-center`}
        >
          <RefreshCcw className="inline-block mr-2" size={16} />
          Reapply Masking
        </button>
      </div>
    </div>
  );
};

export default SequenceMaskingPlayground;