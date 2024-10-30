"use client"
import { useState, useEffect } from "react";
import { Building, Road, Brain, Zap, CheckCircle, XCircle } from "lucide-react";

interface ComponentProps {}

type CityCell = {
  type: "input" | "hidden" | "output" | "empty";
  connections: number[];
};

type City = CityCell[][];

const GRID_SIZE = 5;
const GENERATION_TIME = 3000;

/**
 * NeuroCity Builder: An interactive component to teach Neuroevolution
 * through a city-building metaphor.
 */
const NeuroCityBuilder: React.FC<ComponentProps> = () => {
  const [city, setCity] = useState<City>(() => initializeCity());
  const [generation, setGeneration] = useState<number>(0);
  const [fitness, setFitness] = useState<number>(0);
  const [evolving, setEvolving] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (evolving) {
      intervalId = setInterval(() => {
        evolveCity();
        setGeneration((prev) => prev + 1);
      }, GENERATION_TIME);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [evolving]);

  const initializeCity = (): City => {
    const newCity: City = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE).fill({ type: "empty", connections: [] })
      );
    return newCity;
  };

  const evolveCity = () => {
    setCity((prevCity) => {
      const newCity = JSON.parse(JSON.stringify(prevCity));
      // Simulate evolution (mutation and crossover)
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (Math.random() < 0.2) {
            newCity[i][j].type = ["input", "hidden", "output", "empty"][
              Math.floor(Math.random() * 4)
            ] as "input" | "hidden" | "output" | "empty";
          }
          if (Math.random() < 0.3) {
            newCity[i][j].connections = Array(4)
              .fill(0)
              .map(() => Math.floor(Math.random() * 3));
          }
        }
      }
      return newCity;
    });
    setFitness(Math.floor(Math.random() * 100));
  };

  const handleCellClick = (row: number, col: number) => {
    if (evolving) return;
    setCity((prevCity) => {
      const newCity = JSON.parse(JSON.stringify(prevCity));
      const currentType = newCity[row][col].type;
      const types: ("input" | "hidden" | "output" | "empty")[] = [
        "input",
        "hidden",
        "output",
        "empty",
      ];
      const nextIndex = (types.indexOf(currentType) + 1) % types.length;
      newCity[row][col].type = types[nextIndex];
      return newCity;
    });
  };

  const renderCell = (cell: CityCell, row: number, col: number) => {
    const cellColor =
      cell.type === "input"
        ? "bg-blue-500"
        : cell.type === "hidden"
        ? "bg-gray-500"
        : cell.type === "output"
        ? "bg-green-500"
        : "bg-gray-200";

    return (
      <div
        key={`${row}-${col}`}
        className={`w-12 h-12 ${cellColor} border border-gray-400 flex items-center justify-center cursor-pointer`}
        onClick={() => handleCellClick(row, col)}
        role="button"
        tabIndex={0}
        aria-label={`City cell ${row}-${col}, type: ${cell.type}`}
      >
        {cell.type === "input" && <Building className="text-white" />}
        {cell.type === "hidden" && <Brain className="text-white" />}
        {cell.type === "output" && <Zap className="text-white" />}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">NeuroCity Builder</h2>
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded ${
            evolving ? "bg-red-500" : "bg-blue-500"
          } text-white`}
          onClick={() => setEvolving(!evolving)}
        >
          {evolving ? "Stop Evolution" : "Start Evolution"}
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1 mb-4">
        {city.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>Generation: {generation}</div>
        <div>Fitness: {fitness}</div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">City Performance:</h3>
        <div className="flex items-center">
          <div className="mr-2">Efficiency:</div>
          {fitness > 70 ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuroCityBuilder;