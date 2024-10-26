import React, { useState, useEffect } from "react";
import {
  BrainCog,
  Mic,
  MessageSquare,
  Camera,
  Speaker,
  MonitorSmartphone,
  Video,
  Table2,
  Activity,
  FileImage,
  FileText,
  Binary,
  Boxes,
  ListMusic,
  Hash,
} from "lucide-react";

const XRXVisualization = () => {
  // Fisher-Yates shuffle algorithm
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const allInputs = [
    { icon: MessageSquare, label: "Text Prompt" },
    { icon: Camera, label: "Image Input" },
    { icon: Mic, label: "Speech" },
    { icon: Table2, label: "Tabular Data" },
    { icon: Video, label: "Video Input" },
    { icon: Binary, label: "Time Series" },
    { icon: FileText, label: "Document" },
    { icon: Activity, label: "Sensor Data" },
    { icon: Hash, label: "Structured Data" },
    { icon: ListMusic, label: "Audio Input" },
  ];

  const allOutputs = [
    { icon: MessageSquare, label: "Generated Text" },
    { icon: FileImage, label: "Generated Image" },
    { icon: Boxes, label: "Object Detection" },
    { icon: Table2, label: "Classifications" },
    { icon: Video, label: "Generated Video" },
    { icon: Speaker, label: "Generated Speech" },
    { icon: Binary, label: "Predictions" },
    { icon: FileText, label: "Summary" },
    { icon: Activity, label: "Time Forecast" },
    { icon: MonitorSmartphone, label: "3D Model" },
  ];

  // Initialize with 5 random items, but only once
  const [currentInputs] = useState(() => shuffle(allInputs).slice(0, 5));
  const [currentOutputs] = useState(() => shuffle(allOutputs).slice(0, 5));

  const [activeInput, setActiveInput] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOutput, setActiveOutput] = useState(null);

  useEffect(() => {
    const cycle = () => {
      const nextInput = Math.floor(Math.random() * 5);
      const nextOutput = Math.floor(Math.random() * 5);

      setActiveInput(nextInput);
      setIsProcessing(true);

      setTimeout(() => {
        setActiveOutput(nextOutput);
        setIsProcessing(false);

        setTimeout(() => {
          setActiveOutput(null);
        }, 2000);
      }, 1000);
    };

    const interval = setInterval(cycle, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-8 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">xRx Framework</h2>

      <div className="flex items-center justify-between w-full">
        {/* Input Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Input (x)
          </div>
          <div className="grid grid-cols-1 gap-6">
            {currentInputs.map((input, index) => {
              const Icon = input.icon;
              return (
                <div
                  key={`${input.label}-${index}`}
                  className={`transition-all duration-300 transform ${
                    index === activeInput
                      ? "scale-125 text-blue-600"
                      : "scale-100 text-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={28} />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {input.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reasoning Section */}
        <div className="flex flex-col items-center mx-12">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Reasoning (R)
          </div>
          <div
            className={`transition-all duration-500 transform ${
              isProcessing
                ? "scale-125 text-purple-600 rotate-180"
                : "scale-100 text-gray-600"
            }`}
          >
            <BrainCog size={72} />
          </div>
          <div className="mt-4 text-sm text-center text-gray-500">
            {isProcessing ? "Processing..." : "Ready"}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Output (x)
          </div>
          <div className="grid grid-cols-1 gap-6">
            {currentOutputs.map((output, index) => {
              const Icon = output.icon;
              return (
                <div
                  key={`${output.label}-${index}`}
                  className={`transition-all duration-300 transform ${
                    index === activeOutput
                      ? "scale-125 text-green-600"
                      : "scale-100 text-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={28} />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {output.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-8 text-center text-gray-600 max-w-2xl">
        The xRx framework processes various AI tasks by taking different types
        of inputs (text, images, audio, etc.), applying advanced reasoning, and
        producing appropriate outputs like predictions, generations, or
        transformations.
      </p>
    </div>
  );
};

export default XRXVisualization;
