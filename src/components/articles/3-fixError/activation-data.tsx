"use client"
import { useState, useEffect } from "react";
import { Waveform, Sliders, Music, RefreshCw, Volume2, Volume1, VolumeX } from "lucide-react";

interface Station {
  id: number;
  level: number;
  name: string;
}

interface Wave {
  amplitude: number;
  frequency: number;
}

const INITIAL_STATIONS: Station[] = [
  { id: 1, level: 50, name: "Bass" },
  { id: 2, level: 50, name: "Mids" },
  { id: 3, level: 50, name: "Treble" },
];

const INITIAL_WAVE: Wave = {
  amplitude: 50,
  frequency: 1,
};

export default function ActivationDataMixer() {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [wave, setWave] = useState<Wave>(INITIAL_WAVE);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setWave(prev => ({
        ...prev,
        amplitude: Math.sin(Date.now() / 1000) * 25 + 50,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleSliderChange = (id: number, value: number) => {
    setStations(prev =>
      prev.map(station =>
        station.id === id ? { ...station, level: value } : station
      )
    );
  };

  const getTransformedWave = (stationIndex: number): number => {
    const baseAmplitude = wave.amplitude;
    return stations
      .slice(0, stationIndex + 1)
      .reduce((acc, station) => (acc * station.level) / 50, baseAmplitude);
  };

  const getVolumeIcon = (level: number) => {
    if (level < 33) return <VolumeX className="w-6 h-6 text-gray-600" />;
    if (level < 66) return <Volume1 className="w-6 h-6 text-gray-600" />;
    return <Volume2 className="w-6 h-6 text-gray-600" />;
  };

  const reset = () => {
    setStations(INITIAL_STATIONS);
    setWave(INITIAL_WAVE);
    setIsAnimating(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sound Mixer Studio</h2>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          aria-label="Reset mixer"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="space-y-8">
        {stations.map((station, index) => (
          <div
            key={station.id}
            className="bg-white p-4 rounded-lg shadow"
            role="group"
            aria-label={`Mixing station ${station.name}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">{station.name}</span>
              </div>
              {getVolumeIcon(station.level)}
            </div>

            <div className="relative h-16 mb-4">
              <Waveform
                className="w-full h-full text-blue-500 opacity-20"
                style={{
                  transform: `scale(${getTransformedWave(index) / 50}, 1)`,
                }}
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={station.level}
              onChange={(e) => handleSliderChange(station.id, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label={`Adjust ${station.name} level`}
            />

            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>0%</span>
              <span>{station.level}%</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}