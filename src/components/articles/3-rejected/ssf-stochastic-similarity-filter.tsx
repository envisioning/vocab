"use client"
import { useState, useEffect } from "react";
import { Newspaper, Cpu, ToggleLeft, ToggleRight, Zap } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  similarity: number;
}

interface ComponentProps {}

/**
 * SSFNewsFeedSimulator: A component that teaches the concept of Stochastic Similarity Filter (SSF)
 * through an interactive news feed simulation.
 */
const SSFNewsFeedSimulator: React.FC<ComponentProps> = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [ssfEnabled, setSSFEnabled] = useState<boolean>(false);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.5);
  const [speed, setSpeed] = useState<number>(1);
  const [gpuUsage, setGpuUsage] = useState<number>(100);

  useEffect(() => {
    const generateArticles = () => {
      const newArticles: Article[] = [];
      for (let i = 0; i < 20; i++) {
        newArticles.push({
          id: i,
          title: `Article ${i + 1}`,
          content: `This is the content of article ${i + 1}`,
          similarity: Math.random(),
        });
      }
      setArticles(newArticles);
    };

    generateArticles();
    const interval = setInterval(generateArticles, 10000 / speed);

    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    if (ssfEnabled) {
      const processedArticles = articles.filter(
        (article) => article.similarity > similarityThreshold
      );
      setGpuUsage((processedArticles.length / articles.length) * 100);
    } else {
      setGpuUsage(100);
    }
  }, [articles, ssfEnabled, similarityThreshold]);

  const handleSSFToggle = () => {
    setSSFEnabled(!ssfEnabled);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimilarityThreshold(parseFloat(e.target.value));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  return (
    <div className="p-4 bg-gray-100 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SSF News Feed Simulator</h1>
      <div className="flex items-center mb-4">
        <span className="mr-2">SSF:</span>
        <button
          onClick={handleSSFToggle}
          className="focus:outline-none"
          aria-label={ssfEnabled ? "Disable SSF" : "Enable SSF"}
        >
          {ssfEnabled ? (
            <ToggleRight className="text-blue-500" />
          ) : (
            <ToggleLeft className="text-gray-500" />
          )}
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="similarity" className="block mb-2">
          Similarity Threshold: {similarityThreshold.toFixed(2)}
        </label>
        <input
          type="range"
          id="similarity"
          min="0"
          max="1"
          step="0.01"
          value={similarityThreshold}
          onChange={handleThresholdChange}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="speed" className="block mb-2">
          Speed: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          id="speed"
          min="0.1"
          max="2"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>
      <div className="mb-4 flex items-center">
        <Cpu className="mr-2" />
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${gpuUsage}%` }}
          ></div>
        </div>
        <span className="ml-2">{gpuUsage.toFixed(0)}%</span>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className={`p-4 rounded-lg transition-opacity duration-300 ${
              ssfEnabled && article.similarity <= similarityThreshold
                ? "opacity-30"
                : "opacity-100"
            }`}
          >
            <div className="flex items-center">
              <Newspaper className="mr-2" />
              <h2 className="text-lg font-semibold">{article.title}</h2>
            </div>
            <p className="mt-2">{article.content}</p>
            {ssfEnabled && article.similarity > similarityThreshold && (
              <Zap className="text-green-500 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SSFNewsFeedSimulator;