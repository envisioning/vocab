"use client"
import { useState, useEffect } from "react";
import { Cpu, Smartphone, Laptop, Watch, Calculator, Gamepad2, ChevronRight, RefreshCcw, Info } from "lucide-react";

interface Device {
  icon: JSX.Element;
  name: string;
  description: string;
}

export default function UniversalityDemo() {
  const [selectedDevice, setSelectedDevice] = useState<number>(0);
  const [targetDevice, setTargetDevice] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const devices: Device[] = [
    { icon: <Cpu size={32} />, name: "Computer", description: "The ultimate universal machine, capable of simulating any computational process" },
    { icon: <Smartphone size={32} />, name: "Phone", description: "A portable computer that can run any mobile computation" },
    { icon: <Laptop size={32} />, name: "Laptop", description: "Combines portability with full computing capabilities" },
    { icon: <Watch size={32} />, name: "Smart Watch", description: "Miniaturized but still Turing-complete" },
    { icon: <Calculator size={32} />, name: "Calculator", description: "Simple but capable of universal computation with enough memory" },
    { icon: <Gamepad2 size={32} />, name: "Game Console", description: "Specialized computer that can simulate other systems" }
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isSimulating) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 30);
    }

    return () => clearInterval(progressInterval);
  }, [isSimulating]);

  const handleDeviceClick = (index: number) => {
    if (!isSimulating) {
      setSelectedDevice(index);
      setTargetDevice((index + 1) % devices.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Universal Computation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Any computational device can simulate any other, given enough time and resources.
          Select devices below to explore their universal nature.
        </p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full backdrop-blur-sm bg-opacity-90">
        <div className="flex justify-between items-center mb-16 relative">
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-8 rounded-2xl ${isSimulating ? "bg-blue-100 animate-pulse" : "bg-gray-100"} 
              transition-all duration-500 shadow-lg`}>
              {devices[selectedDevice].icon}
            </div>
            <span className="text-gray-700 font-medium text-lg">{devices[selectedDevice].name}</span>
          </div>

          <div className="flex-1 mx-12">
            <div className="relative pt-6">
              <div className="h-3 bg-gray-200 rounded-full shadow-inner">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
              <ChevronRight className={`absolute top-0 text-blue-500 transform -translate-y-1/2 
                ${isSimulating ? "animate-bounce" : ""}`}
                style={{ left: `${progress}%` }}
                size={28} />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className={`p-8 rounded-2xl ${isSimulating && progress === 100 ? "bg-green-100" : "bg-gray-100"}
              transition-all duration-500 shadow-lg`}>
              {devices[targetDevice].icon}
            </div>
            <span className="text-gray-700 font-medium text-lg">{devices[targetDevice].name}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {devices.map((device, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => handleDeviceClick(index)}
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
                className={`w-full p-6 rounded-xl transition-all duration-300 flex flex-col items-center space-y-3
                  transform hover:scale-105 ${
                    selectedDevice === index
                      ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                disabled={isSimulating}
              >
                {device.icon}
                <span className="text-sm font-medium">{device.name}</span>
                <Info size={16} className="opacity-50" />
              </button>
              {showTooltip === index && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3
                  bg-gray-800 text-white text-sm rounded-lg shadow-xl z-10">
                  {device.description}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                    border-8 border-transparent border-t-gray-800" />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => !isSimulating && setIsSimulating(true)}
          disabled={isSimulating}
          className={`w-full py-4 rounded-xl transition-all duration-500 flex items-center justify-center space-x-3
            transform hover:scale-102 ${
              isSimulating
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white shadow-lg"
            }`}
        >
          <RefreshCcw size={20} className={isSimulating ? "animate-spin" : ""} />
          <span className="font-medium">Simulate Universal Computation</span>
        </button>
      </div>
    </div>
  );
}