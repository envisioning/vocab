"use client"
import { useState, useEffect } from "react";
import { Dog, Sun, Cloud, Rain, Heart, Fish, Bone, Moon } from "lucide-react";

interface PredictoPetProps {}

type Mood = 'happy' | 'hungry' | 'sleepy';
type Activity = 'feed' | 'play' | 'sleep';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';

interface PetData {
  mood: Mood;
  lastActivity: Activity;
  timeOfDay: TimeOfDay;
}

const INITIAL_ACCURACY = 50;
const TIME_INTERVALS = ['morning', 'afternoon', 'evening'];

/**
 * PredictoPet: An educational component teaching predictive analytics
 * through an interactive virtual pet simulation
 */
export default function PredictoPet({}: PredictoPetProps) {
  const [petMood, setPetMood] = useState<Mood>('happy');
  const [predictionAccuracy, setPredictionAccuracy] = useState<number>(INITIAL_ACCURACY);
  const [historicalData, setHistoricalData] = useState<PetData[]>([]);
  const [prediction, setPrediction] = useState<Activity>('feed');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(current => {
        const currentIndex = TIME_INTERVALS.indexOf(current);
        return TIME_INTERVALS[(currentIndex + 1) % 3] as TimeOfDay;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (historicalData.length > 0) {
      const similarSituations = historicalData.filter(
        data => data.timeOfDay === timeOfDay && data.mood === petMood
      );
      
      if (similarSituations.length > 0) {
        const mostCommonActivity = getMostCommonActivity(similarSituations);
        setPrediction(mostCommonActivity);
      }
    }
  }, [timeOfDay, petMood, historicalData]);

  const getMostCommonActivity = (data: PetData[]): Activity => {
    const activities = data.map(d => d.lastActivity);
    return activities.sort((a, b) =>
      activities.filter(v => v === a).length - activities.filter(v => v === b).length
    )[0];
  };

  const handleActivity = (activity: Activity) => {
    const newData: PetData = {
      mood: petMood,
      lastActivity: activity,
      timeOfDay: timeOfDay
    };

    setHistoricalData(prev => [...prev, newData]);
    
    if (activity === prediction) {
      setPredictionAccuracy(prev => Math.min(100, prev + 5));
    } else {
      setPredictionAccuracy(prev => Math.max(0, prev - 5));
    }

    updatePetMood(activity);
  };

  const updatePetMood = (activity: Activity) => {
    const moodMap: Record<Activity, Mood> = {
      feed: 'happy',
      play: 'hungry',
      sleep: 'sleepy'
    };
    setPetMood(moodMap[activity]);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg" role="main">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">PredictoPet</div>
        <div className="flex items-center gap-2">
          {timeOfDay === 'morning' && <Sun className="text-yellow-500" />}
          {timeOfDay === 'afternoon' && <Cloud className="text-blue-500" />}
          {timeOfDay === 'evening' && <Moon className="text-gray-500" />}
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Dog 
          className={`w-24 h-24 ${
            petMood === 'happy' ? 'text-green-500' :
            petMood === 'hungry' ? 'text-orange-500' : 'text-blue-500'
          }`}
          role="img"
          aria-label={`Pet is feeling ${petMood}`}
        />
      </div>

      <div className="mb-6">
        <div className="text-center mb-2">Prediction Accuracy</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-500 rounded-full h-4 transition-all duration-300"
            style={{ width: `${predictionAccuracy}%` }}
            role="progressbar"
            aria-valuenow={predictionAccuracy}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleActivity('feed')}
          className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
          aria-label="Feed pet"
        >
          <Fish className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleActivity('play')}
          className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
          aria-label="Play with pet"
        >
          <Bone className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleActivity('sleep')}
          className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
          aria-label="Let pet sleep"
        >
          <Moon className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Predicted next activity: {prediction}
      </div>
    </div>
  );
}