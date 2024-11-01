"use client"
import { useState, useEffect } from "react";
import { SplitSquareHorizontal, Type, Hash, ChevronRight, Info, Sparkles, Bot } from "lucide-react";

interface TokenProps {}

type TokenItem = {
  id: number;
  text: string;
  isHighlighted: boolean;
  tokenCount: number;
};

const SAMPLE_SENTENCES = [
  "Hello world!",
  "I love AI and ML",
  "Neural networks are fascinating",
];

const TokenVisualizer: React.FC<TokenProps> = () => {
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const words = SAMPLE_SENTENCES[currentSentence].split(" ").map((word, index) => ({
      id: index,
      text: word,
      isHighlighted: false,
      tokenCount: Math.ceil(word.length / 2),
    }));
    setTokens(words);

    let currentIndex = 0;
    const animation = setInterval(() => {
      if (currentIndex >= words.length) {
        setIsAnimating(false);
        clearInterval(animation);
        return;
      }

      setTokens(current =>
        current.map((token, idx) => ({
          ...token,
          isHighlighted: idx === currentIndex,
        }))
      );
      currentIndex++;
    }, 1000);

    return () => clearInterval(animation);
  }, [currentSentence]);

  const handleNext = () => {
    setCurrentSentence((prev) => (prev + 1) % SAMPLE_SENTENCES.length);
    setIsAnimating(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-500 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Understanding Tokens in AI
            </h2>
          </div>

          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-help"
                 onMouseEnter={() => setShowTooltip(true)}
                 onMouseLeave={() => setShowTooltip(false)}>
              <Info className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">How AI sees text</span>
            </div>
            
            {showTooltip && (
              <div className="absolute z-10 w-64 p-4 mt-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-blue-100 dark:border-blue-900">
                Tokens are like the atoms of text that AI models understand. Each token represents a small piece of text, which could be a word, part of a word, or even a single character!
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className={`
                    transform transition-all duration-500 flex flex-col items-center
                    ${token.isHighlighted ? 'scale-110 z-10' : 'scale-100'}
                  `}
                >
                  <div className={`
                    p-4 rounded-lg flex items-center space-x-2 shadow-lg
                    ${token.isHighlighted 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                  `}>
                    <SplitSquareHorizontal className="w-4 h-4" />
                    <span className="font-mono font-medium">{token.text}</span>
                    <Sparkles className="w-4 h-4 opacity-50" />
                  </div>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    ~{token.tokenCount} tokens
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Next Example</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-center text-gray-600 dark:text-gray-400 max-w-md">
            <p className="text-sm">
              Just like breaking a chocolate bar into bite-sized pieces, AI breaks text into smaller, manageable tokens! 🍫✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenVisualizer;