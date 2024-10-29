"use client"
import { useState, useEffect } from "react";
import { Brain, Library, Timer, ArrowRight, Lock, Unlock, RefreshCw, CheckCircle2 } from "lucide-react";

interface GateState {
  isOpen: boolean;
  efficiency: number;
}

interface MemoryCell {
  id: number;
  content: string;
  isProcessed: boolean;
}

interface ComponentProps {}

/**
 * XLSTMVisualizer: Interactive component teaching xLSTM concepts
 * through a library management system metaphor
 */
const XLSTMVisualizer: React.FC<ComponentProps> = () => {
  const [memoryCells, setMemoryCells] = useState<MemoryCell[]>([]);
  const [forgetGate, setForgetGate] = useState<GateState>({ isOpen: false, efficiency: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const DEMO_DATA: string[] = [
    "Machine Learning Book",
    "Python Programming",
    "Neural Networks",
    "Deep Learning",
    "Data Science"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setMemoryCells(prev => {
          if (prev.length >= DEMO_DATA.length) return prev;
          return [...prev, {
            id: prev.length,
            content: DEMO_DATA[prev.length],
            isProcessed: false
          }];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleGateToggle = () => {
    setForgetGate(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      efficiency: prev.efficiency + (prev.isOpen ? -10 : 10)
    }));
  };

  const processMemory = (cellId: number) => {
    setMemoryCells(prev =>
      prev.map(cell =>
        cell.id === cellId ? { ...cell, isProcessed: true } : cell
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center mb-6 space-x-4">
        <Library className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold">xLSTM Library Assistant</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <Brain className="w-6 h-6 text-blue-500" />
          <div className="flex-1 mx-4">
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-2 bg-blue-500 rounded transition-all duration-300"
                style={{ width: `${forgetGate.efficiency}%` }}
              />
            </div>
          </div>
          <button
            onClick={handleGateToggle}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            aria-label="Toggle memory gate"
          >
            {forgetGate.isOpen ? 
              <Unlock className="w-6 h-6 text-green-500" /> :
              <Lock className="w-6 h-6 text-gray-500" />
            }
          </button>
        </div>

        <div className="space-y-2">
          {memoryCells.map(cell => (
            <div
              key={cell.id}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                cell.isProcessed ? 'bg-green-100' : 'bg-white'
              }`}
            >
              <Timer className="w-5 h-5 text-gray-500 mr-3" />
              <span className="flex-1">{cell.content}</span>
              {!cell.isProcessed && forgetGate.isOpen && (
                <button
                  onClick={() => processMemory(cell.id)}
                  className="p-2 rounded-full hover:bg-blue-100"
                  aria-label="Process memory cell"
                >
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </button>
              )}
              {cell.isProcessed && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsProcessing(!isProcessing)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label={isProcessing ? "Pause processing" : "Start processing"}
        >
          {isProcessing ? "Pause" : "Start"} Processing
        </button>
        <button
          onClick={() => {
            setMemoryCells([]);
            setForgetGate({ isOpen: false, efficiency: 0 });
            setIsProcessing(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
          aria-label="Reset simulation"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default XLSTMVisualizer;