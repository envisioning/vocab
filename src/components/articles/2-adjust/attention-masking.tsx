"use client"
import { useState, useEffect } from "react";
import { Users, Theater, AlertCircle, Award, RefreshCcw } from "lucide-react";

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
  maskPattern: boolean[][];
}

const SCENARIOS: ScenarioType[] = [
  {
    id: 1,
    name: "Regular Show",
    description: "All seats available - Bidirectional attention",
    maskPattern: Array(5).fill(Array(6).fill(false))
  },
  {
    id: 2,
    name: "Preview Night",
    description: "Forward-only seating - Unidirectional attention",
    maskPattern: Array(5).fill().map((_, i) => Array(6).fill().map((_, j) => j < i))
  },
  {
    id: 3,
    name: "Private Event",
    description: "Special seating pattern",
    maskPattern: Array(5).fill().map((_, i) => Array(6).fill().map((_, j) => (i + j) % 2 === 0))
  }
];

export default function AttentionTheater() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [draggingPerson, setDraggingPerson] = useState<boolean>(false);

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
    return () => setSeats([]);
  }, [currentScenario]);

  const handleDragStart = () => {
    setDraggingPerson(true);
  };

  const handleSeatClick = (seatId: number) => {
    if (!draggingPerson) return;

    setSeats(prev => {
      const newSeats = [...prev];
      const seat = newSeats.find(s => s.id === seatId);
      if (seat && !seat.isMasked && !seat.isOccupied) {
        seat.isOccupied = true;
        setScore(prev => prev + 1);
      } else if (seat && seat.isMasked) {
        setScore(prev => Math.max(0, prev - 1));
      }
      return newSeats;
    });
    setDraggingPerson(false);
  };

  const resetTheater = () => {
    setSeats(prev => prev.map(seat => ({ ...seat, isOccupied: false })));
    setScore(0);
    setDraggingPerson(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">The Attention Theater</h1>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Award className="text-blue-500" />
            Score: {score}
          </span>
          <button
            onClick={resetTheater}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
            aria-label="Reset theater"
          >
            <RefreshCcw className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-6 gap-2 bg-gray-800 p-4 rounded-lg">
            {seats.map(seat => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat.id)}
                className={`
                  w-12 h-12 rounded-lg transition-colors duration-300
                  ${seat.isMasked ? 'bg-gray-600 cursor-not-allowed' : 
                    seat.isOccupied ? 'bg-blue-500' : 'bg-green-500 hover:bg-blue-400'}
                `}
                aria-label={`Seat ${seat.row}-${seat.col}`}
                disabled={seat.isMasked || seat.isOccupied}
              />
            ))}
          </div>
        </div>

        <div className="w-64 space-y-4">
          <div
            className="p-4 bg-blue-100 rounded-lg cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={handleDragStart}
            aria-label="Draggable moviegoer"
          >
            <Users className="text-blue-500" />
          </div>

          <div className="space-y-2">
            {SCENARIOS.map((scenario, index) => (
              <button
                key={scenario.id}
                onClick={() => setCurrentScenario(index)}
                className={`w-full p-3 text-left rounded-lg transition-colors duration-300
                  ${currentScenario === index ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <div className="font-semibold">{scenario.name}</div>
                <div className="text-sm">{scenario.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}