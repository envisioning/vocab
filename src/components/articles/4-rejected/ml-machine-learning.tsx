"use client"
import { useState, useEffect } from "react";
import { Dog, Heart, Pizza, Circle, Book, Music, Brain, ArrowRight } from "lucide-react";

interface PetPreference {
  food: number;
  play: number;
  study: number;
}

interface TrainingData {
  activity: keyof PetPreference;
  response: number;
  timestamp: number;
}

interface ComponentProps {}

const ACTIVITIES = {
  food: [Pizza, "Feed"],
  play: [Circle, "Play"],
  study: [Book, "Study"],
} as const;

const LearningPetComponent: React.FC<ComponentProps> = () => {
  const [preferences, setPreferences] = useState<PetPreference>({
    food: 0,
    play: 0,
    study: 0,
  });
  const [mood, setMood] = useState<number>(50);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    const moodDecayInterval = setInterval(() => {
      setMood((prev) => Math.max(0, prev - 2));
    }, 3000);

    return () => clearInterval(moodDecayInterval);
  }, []);

  useEffect(() => {
    if (trainingData.length > 0) {
      const latestActivity = trainingData[trainingData.length - 1].activity;
      const activityData = trainingData.filter(
        (data) => data.activity === latestActivity
      );
      
      const avgResponse = activityData.reduce((sum, data) => sum + data.response, 0) / activityData.length;
      
      setPreferences((prev) => ({
        ...prev,
        [latestActivity]: avgResponse,
      }));

      generateInsight(latestActivity, avgResponse);
    }
  }, [trainingData]);

  const generateInsight = (activity: keyof PetPreference, value: number) => {
    const insights = [
      `I'm learning that ${activity} makes me ${value > 70 ? 'very happy!' : 'somewhat happy.'}`,
      `Interesting! My response to ${activity} is getting more predictable.`,
      `I notice a pattern in how I react to ${activity}!`,
    ];
    setInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const handleActivity = (activity: keyof PetPreference) => {
    const response = calculateResponse(activity);
    setMood((prev) => Math.min(100, prev + response));
    
    setTrainingData((prev) => [
      ...prev,
      { activity, response, timestamp: Date.now() },
    ]);
  };

  const calculateResponse = (activity: keyof PetPreference): number => {
    const baseResponse = 20 + Math.random() * 30;
    const learningFactor = Math.min(trainingData.length / 10, 1);
    return Math.round(baseResponse * (1 - learningFactor) + preferences[activity] * learningFactor);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Dog className="w-16 h-16 text-blue-500" />
        <Brain className="w-8 h-8 text-green-500 ml-2" />
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 rounded-full h-4 transition-all duration-300"
              style={{ width: `${mood}%` }}
              role="progressbar"
              aria-valuenow={mood}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {(Object.entries(ACTIVITIES) as [keyof PetPreference, [any, string]][]).map(
          ([key, [Icon, label]]) => (
            <button
              key={key}
              onClick={() => handleActivity(key)}
              className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-300"
              aria-label={`Interact with pet through ${label}`}
            >
              <Icon className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm">{label}</span>
            </button>
          )
        )}
      </div>

      {insight && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <ArrowRight className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-sm text-blue-700">{insight}</p>
        </div>
      )}
    </div>
  );
};

export default LearningPetComponent;