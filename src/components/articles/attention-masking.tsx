"use client"
import { useState, useEffect } from "react";
import { 
  Users, Theater, Brain, Sparkles, RefreshCcw, 
  Info, ArrowRight, Lightbulb, AlertCircle
} from "lucide-react";

interface Seat {
  id: number;
  isOccupied: boolean;
  isMasked: boolean;
  row: number;
  col: number;
}

interface ScenarioType {
  id: number;
  name: string;
  description: string;
  hint: string;
  maskPattern: boolean[][];
  icon: React.ReactNode;
  showWords?: boolean;
  exampleType: 'causal' | 'self' | 'sparse' | 'none';
}

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLUMNS = ['1', '2', '3', '4', '5', '6'];

const EXAMPLE_SENTENCES = {
  causal: ['The', 'cat', 'sits', 'on', 'the', 'mat'],
  self: ['Red', 'and', 'blue', 'are', 'both', 'colors'],
  sparse: ['The', 'quick', 'brown', 'fox', 'jumps', 'fast'],
  none: ['', '', '', '', '', '']
};

const SCENARIOS: ScenarioType[] = [
  {
    id: 1,
    name: "Self-Attention",
    description: "Every word can attend to all other words",
    hint: "Example: 'Red and blue are both colors' - each word can connect to any other word",
    maskPattern: Array(5).fill(false).map(() => Array(6).fill(false)),
    icon: <Brain className="w-5 h-5" />,
    showWords: true,
    exampleType: 'self'
  },
  {
    id: 2,
    name: "Causal Attention",
    description: "Each word can only see itself and previous words",
    hint: "Example: 'The cat sits on the mat' - each word uses previous context",
    maskPattern: Array(5).fill(false).map((_, i) => Array(6).fill(false).map((_, j) => j < i)),
    icon: <ArrowRight className="w-5 h-5" />,
    showWords: true,
    exampleType: 'causal'
  },
  {
    id: 3,
    name: "Sparse Attention",
    description: "Selective connection patterns",
    hint: "Example: 'The quick brown fox jumps fast' - words connect in a checkerboard pattern",
    maskPattern: Array(5).fill(false).map((_, i) => Array(6).fill(false).map((_, j) => (i + j) % 2 === 0)),
    icon: <Sparkles className="w-5 h-5" />,
    showWords: true,
    exampleType: 'sparse'
  }
];

const getTooltipText = (seat: Seat, scenario: ScenarioType) => {
  const words = EXAMPLE_SENTENCES[scenario.exampleType];
  if (!words) {
    return 'Available';
  }
  
  const rowWord = words[seat.row];
  const colWord = words[seat.col];
  
  if (scenario.id === 1) {
    if (seat.isOccupied) {
      return 'Attention placed here';
    }
    if (seat.row === seat.col) {
      return `Word attending to itself: "${rowWord}"`;
    }
    return `From "${rowWord}" attending to "${colWord}" (bi-directional)`;
  }
  
  if (scenario.id === 2) {
    if (seat.isMasked) {
      return `"${rowWord}" cannot look ahead to "${colWord}"`;
    }
    if (seat.isOccupied) {
      return 'Attention placed here';
    }
    return `From "${rowWord}" using "${colWord}" as context`;
  }

  if (scenario.id === 3) {
    if (seat.isMasked) {
      return `"${rowWord}" cannot attend to "${colWord}" in this pattern`;
    }
    if (seat.isOccupied) {
      return 'Attention placed here';
    }
    return `"${rowWord}" can selectively attend to "${colWord}"`;
  }
  
  return seat.isMasked ? 
    'Masked (Unavailable)' : 
    seat.isOccupied ? 
      'Occupied' : 
      'Available';
};

export default function AttentionTheater() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  useEffect(() => {
    const initializeSeats = () => {
      const newSeats: Seat[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 6; col++) {
          newSeats.push({
            id: row * 6 + col,
            isOccupied: false,
            isMasked: SCENARIOS[currentScenario].maskPattern[row][col],
            row,
            col
          });
        }
      }
      setSeats(newSeats);
    };

    initializeSeats();
    return () => {
      setSeats([]);
      setShowTooltip(null);
    };
  }, [currentScenario]);

  const handleSeatClick = (seatId: number) => {
    const targetSeat = seats.find(s => s.id === seatId);
    if (!targetSeat || targetSeat.isMasked || targetSeat.isOccupied) {
      if (targetSeat?.isMasked) {
        setScore(prev => Math.max(0, prev - 1));
      }
      return;
    }

    setSeats(prev => prev.map(s => 
      s.id === seatId ? { ...s, isOccupied: true } : s
    ));
    setScore(prev => prev + 1);
  };

  const resetTheater = () => {
    setSeats(prev => prev.map(seat => ({ ...seat, isOccupied: false })));
    setScore(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Theater className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              Attention Theater
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Learn about attention masking in neural networks
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
            <Lightbulb className="text-blue-500" />
            <span className="text-blue-700 font-semibold">{score}</span>
          </div>
          <button
            onClick={resetTheater}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-300"
            aria-label="Reset theater"
          >
            <RefreshCcw className="text-blue-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-6 gap-2 mb-2 pl-8">
            {COLUMNS.map(col => (
              <div key={col} className="text-center text-xs font-medium text-gray-700 px-1">
                {col}
              </div>
            ))}
          </div>
          
          <div className="flex">
            <div className="flex flex-col justify-around pr-4">
              {ROWS.map(row => (
                <div key={row} className="text-xs font-medium text-gray-700 text-center">
                  {row}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-6 gap-2 bg-gray-800 p-4 rounded-xl">
              {seats.map(seat => (
                <div
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id)}
                  className="relative"
                  onMouseEnter={() => setShowTooltip(seat.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <div
                    className={`
                      relative w-full pt-[100%] rounded-lg transition-all duration-300 cursor-pointer
                      ${seat.isMasked ? 'bg-gray-600' : 
                        seat.isOccupied ? 'bg-blue-500 animate-pulse' : 'bg-green-500 hover:bg-blue-400'}
                    `}
                    aria-label={`Seat ${ROWS[seat.row]}-${COLUMNS[seat.col]}`}
                  >
                    {SCENARIOS[currentScenario].showWords && (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center text-xs font-medium space-y-1
                        ${seat.isMasked ? 'text-gray-400' : 'text-white'}`}>
                        <span>{EXAMPLE_SENTENCES[SCENARIOS[currentScenario].exampleType][seat.col]}</span>
                        {seat.isOccupied && (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                    )}
                    {!SCENARIOS[currentScenario].showWords && seat.isOccupied && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {showTooltip === seat.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                      {getTooltipText(seat, SCENARIOS[currentScenario])}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="p-4 bg-blue-100 rounded-lg flex items-center gap-3">
            <Info className="text-blue-500" />
            <span className="text-blue-700">Click to place attention</span>
          </div>

          <div className="space-y-3">
            {SCENARIOS.map((scenario, index) => (
              <button
                key={scenario.id}
                onClick={() => setCurrentScenario(index)}
                className={`w-full p-4 rounded-lg transition-all duration-300
                  ${currentScenario === index 
                    ? 'bg-blue-500 text-white shadow-lg scale-102' 
                    : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  {scenario.icon}
                  <div className="text-left">
                    <div className="font-semibold">{scenario.name}</div>
                    <div className="text-sm opacity-90">{scenario.description}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs flex items-start gap-2 opacity-80">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-left">{scenario.hint}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}