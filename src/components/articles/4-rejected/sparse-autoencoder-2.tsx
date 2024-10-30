"use client"
import { useState, useEffect } from "react";
import { Building2, Home, Warehouse, Trees, ShoppingBag, Trash2 } from "lucide-react";

interface ComponentProps {}

type BuildingType = "residential" | "commercial" | "industrial" | "park";

interface Building {
  type: BuildingType;
  id: string;
}

const BUILDING_ICONS: Record<BuildingType, JSX.Element> = {
  residential: <Home className="w-6 h-6 text-blue-500" />,
  commercial: <ShoppingBag className="w-6 h-6 text-green-500" />,
  industrial: <Warehouse className="w-6 h-6 text-yellow-500" />,
  park: <Trees className="w-6 h-6 text-green-700" />,
};

const GRID_SIZE = 5;
const MAX_BUILDINGS = 10;

/**
 * SparseCityBuilder: An interactive component to teach Sparse Autoencoder concepts
 * through city building with limited resources.
 */
const SparseCityBuilder: React.FC<ComponentProps> = () => {
  const [grid, setGrid] = useState<(Building | null)[]>(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [buildingCount, setBuildingCount] = useState<number>(0);

  useEffect(() => {
    const calculateScore = () => {
      const buildingTypes = new Set(grid.filter(Boolean).map((b) => b!.type));
      const newScore = (buildingTypes.size / 4) * 100;
      setScore(Math.round(newScore));
    };

    calculateScore();
    setBuildingCount(grid.filter(Boolean).length);
  }, [grid]);

  const handleCellClick = (index: number) => {
    if (!selectedBuilding) return;

    setGrid((prev) => {
      const newGrid = [...prev];
      if (newGrid[index]) {
        newGrid[index] = null;
      } else if (buildingCount < MAX_BUILDINGS) {
        newGrid[index] = { type: selectedBuilding, id: `${selectedBuilding}-${Date.now()}` };
      }
      return newGrid;
    });
  };

  const handleBuildingSelect = (type: BuildingType) => {
    setSelectedBuilding(type);
  };

  const handleReset = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(null));
    setSelectedBuilding(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sparse City Builder</h1>
      <p className="mb-4 text-center">
        Build a functional city with minimal buildings. Balance diversity and sparsity!
      </p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {Object.entries(BUILDING_ICONS).map(([type, icon]) => (
            <button
              key={type}
              onClick={() => handleBuildingSelect(type as BuildingType)}
              className={`p-2 rounded ${
                selectedBuilding === type ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`Select ${type} building`}
            >
              {icon}
            </button>
          ))}
        </div>
        <button
          onClick={handleReset}
          className="p-2 bg-red-500 text-white rounded"
          aria-label="Reset city"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {grid.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded"
            aria-label={cell ? `${cell.type} building` : "Empty cell"}
          >
            {cell && BUILDING_ICONS[cell.type]}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">Sparsity: {MAX_BUILDINGS - buildingCount}/{MAX_BUILDINGS}</p>
          <progress
            value={MAX_BUILDINGS - buildingCount}
            max={MAX_BUILDINGS}
            className="w-full"
          />
        </div>
        <div>
          <p className="font-bold">Functionality: {score}%</p>
          <progress value={score} max={100} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default SparseCityBuilder;