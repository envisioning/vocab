"use client"
import { useState, useEffect } from "react";
import { Plane, Sun, Umbrella, DollarSign, Clock, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";

interface TravelPackage {
  id: number;
  destination: string;
  price: number;
  duration: number;
  weather: string;
  activities: string[];
  risks: string[];
}

interface DSSComponentProps {}

const TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 1,
    destination: "Beach Resort",
    price: 2000,
    duration: 7,
    weather: "Sunny",
    activities: ["Swimming", "Snorkeling", "Beach Volleyball"],
    risks: ["Hurricane Season", "High Tourism Period"]
  },
  {
    id: 2,
    destination: "Mountain Retreat",
    price: 1500,
    duration: 5,
    weather: "Cool",
    activities: ["Hiking", "Camping", "Photography"],
    risks: ["Altitude Sickness", "Unpredictable Weather"]
  },
  {
    id: 3,
    destination: "City Explorer",
    price: 2500,
    duration: 10,
    weather: "Varied",
    activities: ["Museums", "Shopping", "Dining"],
    risks: ["High Costs", "Peak Season Crowds"]
  }
];

const TravelDSS: React.FC<DSSComponentProps> = () => {
  const [budget, setBudget] = useState<number>(2000);
  const [duration, setDuration] = useState<number>(7);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showDecision, setShowDecision] = useState<boolean>(false);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(Number(e.target.value));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(Number(e.target.value));
  };

  const handlePackageSelect = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setShowDecision(false);
  };

  const handleMakeDecision = () => {
    setShowDecision(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Travel Decision Support System</h1>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <DollarSign className="text-blue-500" />
          <label className="flex-1">
            Budget: ${budget}
            <input
              type="range"
              min="1000"
              max="3000"
              value={budget}
              onChange={handleBudgetChange}
              className="w-full"
              aria-label="Budget slider"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <Clock className="text-blue-500" />
          <label className="flex-1">
            Duration: {duration} days
            <input
              type="range"
              min="3"
              max="14"
              value={duration}
              onChange={handleDurationChange}
              className="w-full"
              aria-label="Duration slider"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {TRAVEL_PACKAGES.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => handlePackageSelect(pkg)}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              selectedPackage?.id === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h3 className="font-bold mb-2">{pkg.destination}</h3>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" />
              <span>${pkg.price}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span>{pkg.duration} days</span>
            </div>
            {pkg.price > budget && (
              <div className="text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Over budget</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedPackage && (
        <div className="mb-6">
          <button
            onClick={handleMakeDecision}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Analyze Decision
          </button>
        </div>
      )}

      {showDecision && selectedPackage && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="font-bold mb-4">Decision Support Analysis</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="text-green-500" />
              <span>Matches your duration preference</span>
            </div>
            {selectedPackage.price > budget && (
              <div className="flex items-center gap-2">
                <ThumbsDown className="text-red-500" />
                <span>Exceeds your budget by ${selectedPackage.price - budget}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDSS;