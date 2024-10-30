"use client"
import { useState, useEffect } from "react";
import { Beaker, Coffee, Zap, Droplet, Flame } from "lucide-react";

interface ComponentProps {}

type Flavor = {
  name: string;
  value: number;
  icon: React.ReactNode;
};

type TasteProfile = {
  id: number;
  flavors: Flavor[];
};

const INITIAL_FLAVORS: Flavor[] = [
  { name: "Sweet", value: 0, icon: <Coffee className="w-6 h-6" /> },
  { name: "Sour", value: 0, icon: <Zap className="w-6 h-6" /> },
  { name: "Salty", value: 0, icon: <Droplet className="w-6 h-6" /> },
  { name: "Bitter", value: 0, icon: <Flame className="w-6 h-6" /> },
];

/**
 * InteractiveFlavorLab: A component to teach Mixture Map concept through flavor mixing.
 */
const InteractiveFlavorLab: React.FC<ComponentProps> = () => {
  const [flavors, setFlavors] = useState<Flavor[]>(INITIAL_FLAVORS);
  const [tasteProfiles, setTasteProfiles] = useState<TasteProfile[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  useEffect(() => {
    if (isDemo) {
      const demoInterval = setInterval(() => {
        setFlavors((prevFlavors) =>
          prevFlavors.map((flavor) => ({
            ...flavor,
            value: Math.random() * 100,
          }))
        );
      }, 2000);

      return () => clearInterval(demoInterval);
    }
  }, [isDemo]);

  useEffect(() => {
    if (!isDemo && tasteProfiles.length < 5) {
      const newProfile: TasteProfile = {
        id: Date.now(),
        flavors: [...flavors],
      };
      setTasteProfiles((prev) => [...prev, newProfile]);
    }
  }, [flavors, isDemo, tasteProfiles.length]);

  const handleSliderChange = (index: number, value: number) => {
    setFlavors((prevFlavors) =>
      prevFlavors.map((flavor, i) =>
        i === index ? { ...flavor, value } : flavor
      )
    );
  };

  const handleResetClick = () => {
    setFlavors(INITIAL_FLAVORS);
    setTasteProfiles([]);
  };

  const handleDemoToggle = () => {
    setIsDemo((prev) => !prev);
    if (isDemo) {
      handleResetClick();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Interactive Flavor Lab
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Flavor Mixer</h2>
          {flavors.map((flavor, index) => (
            <div key={flavor.name} className="mb-4">
              <label
                htmlFor={`slider-${flavor.name}`}
                className="flex items-center gap-2 mb-2"
              >
                {flavor.icon}
                <span>{flavor.name}</span>
              </label>
              <input
                type="range"
                id={`slider-${flavor.name}`}
                min="0"
                max="100"
                value={flavor.value}
                onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                className="w-full"
                disabled={isDemo}
              />
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleResetClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            >
              Reset
            </button>
            <button
              onClick={handleDemoToggle}
              className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 ${
                isDemo
                  ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
              }`}
            >
              {isDemo ? "Stop Demo" : "Start Demo"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Flavor Map</h2>
          <div className="bg-white p-4 rounded-lg shadow-inner h-64 overflow-y-auto">
            {tasteProfiles.map((profile) => (
              <div
                key={profile.id}
                className="mb-4 p-2 bg-gray-100 rounded flex items-center gap-2"
              >
                <Beaker className="w-6 h-6 text-blue-500" />
                {profile.flavors.map((flavor) => (
                  <div
                    key={flavor.name}
                    className="flex items-center gap-1"
                    title={`${flavor.name}: ${flavor.value.toFixed(1)}%`}
                  >
                    {flavor.icon}
                    <span className="text-sm">{flavor.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        Experiment with different flavor combinations to see how they create unique taste profiles!
      </p>
    </div>
  );
};

export default InteractiveFlavorLab;