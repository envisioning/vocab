"use client"
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Car, Users, Building } from "lucide-react";

interface ComponentProps {}

type WeatherType = "sunny" | "cloudy" | "rainy";
type TrafficLevel = "low" | "medium" | "high";
type PopulationTrend = "decreasing" | "stable" | "increasing";
type BusinessStatus = "thriving" | "stable" | "struggling";

interface CityState {
  weather: WeatherType;
  traffic: TrafficLevel;
  population: PopulationTrend;
  business: BusinessStatus;
}

const INITIAL_STATE: CityState = {
  weather: "sunny",
  traffic: "medium",
  population: "stable",
  business: "stable",
};

const WEATHER_ICONS: Record<WeatherType, JSX.Element> = {
  sunny: <Sun className="text-yellow-400" />,
  cloudy: <Cloud className="text-gray-400" />,
  rainy: <CloudRain className="text-blue-400" />,
};

/**
 * StochasticCitySimulator: An interactive component that demonstrates
 * stochastic processes through a simplified city simulation.
 */
const StochasticCitySimulator: React.FC<ComponentProps> = () => {
  const [cityState, setCityState] = useState<CityState>(INITIAL_STATE);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSimulating) {
      intervalId = setInterval(() => {
        setCityState((prevState) => ({
          weather: getRandomWeather(),
          traffic: getRandomTraffic(),
          population: getRandomPopulationTrend(),
          business: getRandomBusinessStatus(),
        }));
      }, 2000);

      const quizTimeout = setTimeout(() => setShowQuiz(true), 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(quizTimeout);
      };
    }

    return () => {};
  }, [isSimulating]);

  const getRandomWeather = (): WeatherType => {
    const weathers: WeatherType[] = ["sunny", "cloudy", "rainy"];
    return weathers[Math.floor(Math.random() * weathers.length)];
  };

  const getRandomTraffic = (): TrafficLevel => {
    const traffics: TrafficLevel[] = ["low", "medium", "high"];
    return traffics[Math.floor(Math.random() * traffics.length)];
  };

  const getRandomPopulationTrend = (): PopulationTrend => {
    const trends: PopulationTrend[] = ["decreasing", "stable", "increasing"];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getRandomBusinessStatus = (): BusinessStatus => {
    const statuses: BusinessStatus[] = ["thriving", "stable", "struggling"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleSimulationToggle = () => {
    setIsSimulating((prev) => !prev);
    setShowQuiz(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Stochastic City Simulator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded-md shadow">
          <h3 className="font-semibold mb-2">Weather</h3>
          <div className="flex items-center">
            {WEATHER_ICONS[cityState.weather]}
            <span className="ml-2 capitalize">{cityState.weather}</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-md shadow">
          <h3 className="font-semibold mb-2">Traffic</h3>
          <div className="flex items-center">
            <Car className={`text-${cityState.traffic === "high" ? "red" : cityState.traffic === "medium" ? "yellow" : "green"}-500`} />
            <span className="ml-2 capitalize">{cityState.traffic}</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-md shadow">
          <h3 className="font-semibold mb-2">Population</h3>
          <div className="flex items-center">
            <Users className={`text-${cityState.population === "increasing" ? "green" : cityState.population === "stable" ? "blue" : "red"}-500`} />
            <span className="ml-2 capitalize">{cityState.population}</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-md shadow">
          <h3 className="font-semibold mb-2">Business</h3>
          <div className="flex items-center">
            <Building className={`text-${cityState.business === "thriving" ? "green" : cityState.business === "stable" ? "blue" : "red"}-500`} />
            <span className="ml-2 Capitalize">{cityState.business}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleSimulationToggle}
        className={`px-4 py-2 rounded-md ${
          isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white transition-colors duration-300`}
      >
        {isSimulating ? "Stop Simulation" : "Start Simulation"}
      </button>
      {showQuiz && (
        <div className="mt-4 bg-blue-100 p-3 rounded-md">
          <p className="font-semibold">Quick Quiz:</p>
          <p>Which of these city elements demonstrates a stochastic process?</p>
          <div className="mt-2">
            <button className="bg-white px-3 py-1 rounded-md mr-2 hover:bg-blue-200 transition-colors duration-300">Weather</button>
            <button className="bg-white px-3 py-1 rounded-md mr-2 hover:bg-blue-200 transition-colors duration-300">Traffic</button>
            <button className="bg-white px-3 py-1 rounded-md mr-2 hover:bg-blue-200 transition-colors duration-300">Population</button>
            <button className="bg-white px-3 py-1 rounded-md hover:bg-blue-200 transition-colors duration-300">All of the above</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StochasticCitySimulator;