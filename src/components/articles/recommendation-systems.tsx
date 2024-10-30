"use client"
import { useState, useEffect } from "react";
import { Star, IceCream, Brain, Heart, ThumbsUp, Info } from "lucide-react";

interface IceCreamFlavor {
  id: number;
  name: string;
  attributes: {
    sweetness: number;
    creaminess: number;
    fruitContent: number;
  };
  rating: number | null;
}

interface Recommendation {
  flavorId: number;
  reason: string;
  type: "content" | "collaborative" | "hybrid";
}

const INITIAL_FLAVORS: IceCreamFlavor[] = [
  { id: 1, name: "Vanilla", attributes: { sweetness: 6, creaminess: 9, fruitContent: 0 }, rating: null },
  { id: 2, name: "Chocolate", attributes: { sweetness: 7, creaminess: 8, fruitContent: 0 }, rating: null },
  { id: 3, name: "Strawberry", attributes: { sweetness: 8, creaminess: 6, fruitContent: 9 }, rating: null },
  { id: 4, name: "Mint Chip", attributes: { sweetness: 5, creaminess: 7, fruitContent: 0 }, rating: null },
  { id: 5, name: "Mango", attributes: { sweetness: 9, creaminess: 5, fruitContent: 10 }, rating: null },
];

const RecommendationSystem = () => {
  const [flavors, setFlavors] = useState<IceCreamFlavor[]>(INITIAL_FLAVORS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stage, setStage] = useState<number>(0);
  const [selectedFlavor, setSelectedFlavor] = useState<IceCreamFlavor | null>(null);

  useEffect(() => {
    if (flavors.filter(f => f.rating !== null).length >= 3) {
      generateRecommendations();
    }
    return () => {
      setRecommendations([]);
    };
  }, [flavors]);

  const generateRecommendations = () => {
    const ratedFlavors = flavors.filter(f => f.rating !== null);
    const unratedFlavors = flavors.filter(f => f.rating === null);
    
    const contentBased = unratedFlavors.map(flavor => ({
      flavorId: flavor.id,
      reason: "Based on ingredient similarity",
      type: "content" as const
    }));

    const collaborative = unratedFlavors.map(flavor => ({
      flavorId: flavor.id,
      reason: "Other users who liked your choices also enjoyed this",
      type: "collaborative" as const
    }));

    setRecommendations([...contentBased, ...collaborative]);
  };

  const handleRating = (flavorId: number, rating: number) => {
    setFlavors(prev => 
      prev.map(f => f.id === flavorId ? { ...f, rating } : f)
    );
  };

  const renderFlavor = (flavor: IceCreamFlavor) => (
    <div 
      key={flavor.id}
      className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      role="button"
      tabIndex={0}
      onClick={() => setSelectedFlavor(flavor)}
      onKeyPress={(e) => e.key === 'Enter' && setSelectedFlavor(flavor)}
    >
      <IceCream className="w-8 h-8 text-blue-500" />
      <h3 className="text-lg font-semibold mt-2">{flavor.name}</h3>
      {flavor.rating !== null && (
        <div className="flex mt-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-5 h-5 ${flavor.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-4">Ice Cream Taste Adventure</h2>
          <div className="grid grid-cols-2 gap-4">
            {flavors.map(renderFlavor)}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          {recommendations.map((rec, index) => (
            <div key={index} className="mb-4 p-3 bg-white rounded-md shadow">
              <div className="flex items-center">
                {rec.type === "content" ? <Brain className="w-5 h-5 mr-2" /> : <Heart className="w-5 h-5 mr-2" />}
                <span>{flavors.find(f => f.id === rec.flavorId)?.name}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedFlavor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{selectedFlavor.name}</h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRating(selectedFlavor.id, rating)}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors duration-300"
                >
                  <ThumbsUp className={`w-6 h-6 ${selectedFlavor.rating === rating ? 'text-blue-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedFlavor(null)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationSystem;