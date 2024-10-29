"use client"
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Meh, MessageSquare, Brain, AlertCircle, Check } from "lucide-react";

interface SentimentProps {}

type Sentiment = "positive" | "negative" | "neutral";
type TextAnalysis = {
  text: string;
  sentiment: Sentiment;
  confidence: number;
  keywords: string[];
};

const SAMPLE_TEXTS: TextAnalysis[] = [
  {
    text: "I absolutely love this amazing course! The teacher is fantastic!",
    sentiment: "positive",
    confidence: 0.9,
    keywords: ["love", "amazing", "fantastic"]
  },
  {
    text: "This product is terrible and completely useless.",
    sentiment: "negative",
    confidence: 0.85,
    keywords: ["terrible", "useless"]
  }
];

const SentimentClassifier: React.FC<SentimentProps> = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null);
  const [prediction, setPrediction] = useState<Sentiment | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userInput) {
        analyzeSentiment(userInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [userInput]);

  const analyzeSentiment = (text: string) => {
    const words = text.toLowerCase().split(" ");
    const positiveWords = ["love", "amazing", "fantastic", "great", "good"];
    const negativeWords = ["terrible", "bad", "awful", "useless", "hate"];
    
    let score = 0;
    const keywords: string[] = [];

    words.forEach(word => {
      if (positiveWords.includes(word)) {
        score += 1;
        keywords.push(word);
      }
      if (negativeWords.includes(word)) {
        score -= 1;
        keywords.push(word);
      }
    });

    const sentiment: Sentiment = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
    const confidence = Math.min(Math.abs(score) / words.length, 1);

    setAnalysis({
      text,
      sentiment,
      confidence,
      keywords
    });
  };

  const handlePrediction = (sentiment: Sentiment) => {
    setPrediction(sentiment);
    setShowResult(true);
    if (analysis && sentiment === analysis.sentiment) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Sentiment Laboratory</h2>
        
        <div className="space-y-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text to analyze..."
            aria-label="Text for sentiment analysis"
            rows={3}
          />

          {userInput && !showResult && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePrediction("positive")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                aria-label="Predict positive sentiment"
              >
                <ThumbsUp size={20} />
                Positive
              </button>
              <button
                onClick={() => handlePrediction("neutral")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                aria-label="Predict neutral sentiment"
              >
                <Meh size={20} />
                Neutral
              </button>
              <button
                onClick={() => handlePrediction("negative")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                aria-label="Predict negative sentiment"
              >
                <ThumbsDown size={20} />
                Negative
              </button>
            </div>
          )}

          {analysis && showResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div className="flex items-center gap-2">
                  <Brain className="text-blue-500" />
                  <span>AI Classification:</span>
                  <span className="font-bold">{analysis.sentiment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Confidence:</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {prediction === analysis.sentiment && (
                <div className="flex items-center gap-2 text-green-500">
                  <Check /> Correct prediction! Score: {score}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentClassifier;