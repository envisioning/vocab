"use client"
import { useState, useEffect } from "react";
import { Gauge, AlertTriangle, Sun, Cloud, CloudRain } from "lucide-react";

interface ComponentProps {}

type WeatherType = "sunny" | "cloudy" | "rainy";

const WEATHER_ICONS: Record<WeatherType, JSX.Element> = {
  sunny: <Sun className="w-8 h-8 text-yellow-400" />,
  cloudy: <Cloud className="w-8 h-8 text-gray-400" />,
  rainy: <CloudRain className="w-8 h-8 text-blue-400" />,
};

const WEATHER_PROBABILITIES: Record<WeatherType, number> = {
  sunny: 0.6,
  cloudy: 0.3,
  rainy: 0.1,
};

/**
 * SurpriseOMeter: A component to teach the concept of Surprise in AI
 * through a weather forecasting metaphor.
 */
const SurpriseOMeter: React.FC<ComponentProps> = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherType>("sunny");
  const [surpriseLevel, setSurpriseLevel] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [dayCount, setDayCount] = useState(0);

  const generateWeather = (): WeatherType => {
    const random = Math.random();
    if (random < WEATHER_PROBABILITIES.sunny) return "sunny";
    if (random < WEATHER_PROBABILITIES.sunny + WEATHER_PROBABILITIES.cloudy) return "cloudy";
    return "rainy";
  };

  const calculateSurprise = (weather: WeatherType): number => {
    return Math.round((1 - WEATHER_PROBABILITIES[weather]) * 100);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        const newWeather = generateWeather();
        setCurrentWeather(newWeather);
        setSurpriseLevel(calculateSurprise(newWeather));
        setDayCount((prev) => prev + 1);
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentWeather("sunny");
    setSurpriseLevel(0);
    setDayCount(0);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Weather Surprise-O-Meter</h2>
      <div className="flex items-center justify-center mb-4">
        {WEATHER_ICONS[currentWeather]}
        <span className="ml-2 text-lg">{`Day ${dayCount}`}</span>
      </div>
      <div className="relative w-48 h-48 mb-4">
        <Gauge
          className="w-full h-full text-blue-500"
          style={{ transform: `rotate(${(surpriseLevel / 100) * 180 - 90}deg)` }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
          {surpriseLevel}%
        </div>
      </div>
      {surpriseLevel > 80 && (
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Unexpected weather detected!</span>
        </div>
      )}
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleToggle}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <p className="mt-4 text-sm text-center">
        Watch as the AI forecaster learns to predict weather patterns. High surprise levels indicate unexpected events!
      </p>
    </div>
  );
};

export default SurpriseOMeter;