"use client"
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Clock, Users, DollarSign, MapPin, ChefHat, TrendingUp, Award } from 'lucide-react';

interface FoodTruckState {
  weather: 'sunny' | 'cloudy' | 'rainy';
  timeOfDay: 'morning' | 'lunch' | 'evening';
  crowdSize: 'low' | 'medium' | 'high';
}

interface Action {
  menu: string;
  price: number;
  location: string;
  staff: number;
}

interface PolicyProps {}

const INITIAL_STATE: FoodTruckState = {
  weather: 'sunny',
  timeOfDay: 'morning',
  crowdSize: 'low'
};

const WEATHER_CYCLE = ['sunny', 'cloudy', 'rainy'];
const TIME_CYCLE = ['morning', 'lunch', 'evening'];
const CROWD_CYCLE = ['low', 'medium', 'high'];

export default function PolicyLearningSimulator({}: PolicyProps) {
  const [state, setState] = useState<FoodTruckState>(INITIAL_STATE);
  const [reward, setReward] = useState<number>(0);
  const [currentPolicy, setCurrentPolicy] = useState<Action>({
    menu: 'breakfast',
    price: 10,
    location: 'downtown',
    staff: 2
  });
  const [isLearning, setIsLearning] = useState<boolean>(true);

  useEffect(() => {
    if (!isLearning) return;
    
    const intervalId = setInterval(() => {
      setState(prev => ({
        weather: WEATHER_CYCLE[(WEATHER_CYCLE.indexOf(prev.weather) + 1) % 3] as FoodTruckState['weather'],
        timeOfDay: TIME_CYCLE[(TIME_CYCLE.indexOf(prev.timeOfDay) + 1) % 3] as FoodTruckState['timeOfDay'],
        crowdSize: CROWD_CYCLE[(CROWD_CYCLE.indexOf(prev.crowdSize) + 1) % 3] as FoodTruckState['crowdSize']
      }));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isLearning]);

  const calculateReward = (state: FoodTruckState, action: Action): number => {
    let reward = 0;
    
    if (state.weather === 'rainy' && action.location === 'indoor') reward += 10;
    if (state.timeOfDay === 'lunch' && action.staff >= 3) reward += 15;
    if (state.crowdSize === 'high' && action.menu === 'fast') reward += 20;

    return reward;
  };

  const handleActionChange = (actionKey: keyof Action, value: string | number) => {
    setCurrentPolicy(prev => ({
      ...prev,
      [actionKey]: value
    }));
    
    const newReward = calculateReward(state, {...currentPolicy, [actionKey]: value});
    setReward(newReward);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Food Truck Policy Simulator</h2>
        <button
          onClick={() => setIsLearning(!isLearning)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label={isLearning ? "Pause simulation" : "Start simulation"}
        >
          {isLearning ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Current State</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {state.weather === 'sunny' && <Sun className="text-yellow-500" />}
              {state.weather === 'cloudy' && <Cloud className="text-gray-500" />}
              {state.weather === 'rainy' && <CloudRain className="text-blue-500" />}
              <span className="capitalize">{state.weather}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-600" />
              <span className="capitalize">{state.timeOfDay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-gray-600" />
              <span className="capitalize">Crowd: {state.crowdSize}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Current Policy</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ChefHat className="text-gray-600" />
                Menu Type
              </span>
              <select
                value={currentPolicy.menu}
                onChange={(e) => handleActionChange('menu', e.target.value)}
                className="border rounded p-1"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="fast">Fast Food</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="text-gray-600" />
                Price Level
              </span>
              <input
                type="range"
                min="5"
                max="20"
                value={currentPolicy.price}
                onChange={(e) => handleActionChange('price', Number(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Reward</h3>
          <div className="flex items-center gap-2">
            <Award className={`${reward > 30 ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-xl font-bold">{reward}</span>
          </div>
        </div>
        <div className="mt-4">
          <TrendingUp className={`${reward > 30 ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
      </div>
    </div>
  );
}