"use client"
import { useState, useEffect } from "react";
import { Brain, Book, Lightbulb, RotateCcw, ChevronRight } from "lucide-react";

interface ComponentProps {}

type Mode = "neural" | "symbolic" | "neurosymbolic";
type Sentence = { original: string; translated: string };

const SENTENCES: Sentence[] = [
  { original: "The cat sat on the mat.", translated: "Le chat s'est assis sur le tapis." },
  { original: "It's raining cats and dogs.", translated: "Il pleut des cordes." },
  { original: "Break a leg!", translated: "Merde!" },
];

/**
 * AILanguageSchool: A component to teach Neurosymbolic AI concepts through language translation.
 */
const AILanguageSchool: React.FC<ComponentProps> = () => {
  const [mode, setMode] = useState<Mode>("neural");
  const [currentSentence, setCurrentSentence] = useState<Sentence>(SENTENCES[0]);
  const [translation, setTranslation] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      timer = setTimeout(() => {
        setMode((prevMode) => {
          if (prevMode === "neural") return "symbolic";
          if (prevMode === "symbolic") return "neurosymbolic";
          return "neural";
        });
        setCurrentSentence(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, mode]);

  useEffect(() => {
    setTranslation("");
    const words = currentSentence.translated.split(" ");
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < words.length) {
        setTranslation((prev) => `${prev} ${words[index]}`);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [currentSentence, mode]);

  const handleReset = () => {
    setMode("neural");
    setCurrentSentence(SENTENCES[0]);
    setTranslation("");
    setIsAnimating(true);
  };

  const getIcon = () => {
    switch (mode) {
      case "neural":
        return <Brain className="w-8 h-8 text-blue-500" />;
      case "symbolic":
        return <Book className="w-8 h-8 text-blue-500" />;
      case "neurosymbolic":
        return <Lightbulb className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Language School</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getIcon()}
          <span className="ml-2 font-semibold">
            {mode === "neural" && "Neural Network Classroom"}
            {mode === "symbolic" && "Symbolic AI Grammar Lab"}
            {mode === "neurosymbolic" && "Neurosymbolic Integration Center"}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="bg-blue-500 text-white p-2 rounded-full"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      <div className="bg-white p-4 rounded-md mb-4">
        <p className="font-semibold mb-2">Original (English):</p>
        <p>{currentSentence.original}</p>
      </div>
      <div className="bg-white p-4 rounded-md mb-4">
        <p className="font-semibold mb-2">Translation (French):</p>
        <p>{translation}</p>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {isAnimating ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => setMode((prevMode) => {
            if (prevMode === "neural") return "symbolic";
            if (prevMode === "symbolic") return "neurosymbolic";
            return "neural";
          })}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Next Mode <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AILanguageSchool;