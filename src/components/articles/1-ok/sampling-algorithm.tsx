"use client"
import { useState, useEffect } from "react";
import { Pizza, ShoppingBag, Users, Check, X, RefreshCw, ChevronRight } from "lucide-react";

interface SamplingItem {
  id: number;
  type: 'food' | 'clothing' | 'electronics';
  price: number;
  rating: number;
}

interface Stats {
  avgPrice: number;
  avgRating: number;
}

const POPULATION_SIZE = 100;
const INITIAL_SAMPLE_SIZE = 10;

const generatePopulation = (): SamplingItem[] => {
  return Array.from({ length: POPULATION_SIZE }, (_, i) => ({
    id: i,
    type: ['food', 'clothing', 'electronics'][Math.floor(Math.random() * 3)] as 'food' | 'clothing' | 'electronics',
    price: Math.floor(Math.random() * 100) + 1,
    rating: Math.floor(Math.random() * 5) + 1
  }));
};

const calculateStats = (items: SamplingItem[]): Stats => ({
  avgPrice: Number((items.reduce((acc, item) => acc + item.price, 0) / items.length).toFixed(2)),
  avgRating: Number((items.reduce((acc, item) => acc + item.rating, 0) / items.length).toFixed(2))
});

const SamplingVisualizer = () => {
  const [population, setPopulation] = useState<SamplingItem[]>([]);
  const [sample, setSample] = useState<SamplingItem[]>([]);
  const [sampleSize, setSampleSize] = useState<number>(INITIAL_SAMPLE_SIZE);
  const [popStats, setPopStats] = useState<Stats>({ avgPrice: 0, avgRating: 0 });
  const [sampleStats, setSampleStats] = useState<Stats>({ avgPrice: 0, avgRating: 0 });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const newPopulation = generatePopulation();
    setPopulation(newPopulation);
    setPopStats(calculateStats(newPopulation));
    return () => {
      setPopulation([]);
      setSample([]);
    };
  }, []);

  const takeSample = () => {
    const shuffled = [...population].sort(() => 0.5 - Math.random());
    const newSample = shuffled.slice(0, sampleSize);
    setSample(newSample);
    setSampleStats(calculateStats(newSample));
    setIsCorrect(null);
  };

  const checkAccuracy = () => {
    const priceAccuracy = Math.abs(popStats.avgPrice - sampleStats.avgPrice) < 10;
    const ratingAccuracy = Math.abs(popStats.avgRating - sampleStats.avgRating) < 0.5;
    setIsCorrect(priceAccuracy && ratingAccuracy);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'food': return <Pizza className="w-4 h-4" />;
      case 'clothing': return <ShoppingBag className="w-4 h-4" />;
      case 'electronics': return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Sampling Laboratory</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            Sample Size:
            <input
              type="range"
              min="5"
              max="50"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-32"
              aria-label="Adjust sample size"
            />
            <span>{sampleSize}</span>
          </label>
          <button
            onClick={takeSample}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            aria-label="Take new sample"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Take Sample
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Population Stats</h3>
            <p>Average Price: ${popStats.avgPrice}</p>
            <p>Average Rating: {popStats.avgRating}⭐</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Sample Stats</h3>
            <p>Average Price: ${sampleStats.avgPrice}</p>
            <p>Average Rating: {sampleStats.avgRating}⭐</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={checkAccuracy}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            aria-label="Check sample accuracy"
          >
            <ChevronRight className="w-4 h-4 inline mr-2" />
            Check Accuracy
          </button>
          {isCorrect !== null && (
            <span className="ml-4">
              {isCorrect ? (
                <Check className="w-6 h-6 text-green-500 inline" />
              ) : (
                <X className="w-6 h-6 text-red-500 inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SamplingVisualizer;