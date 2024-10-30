"use client"
import { useState, useEffect } from "react";
import { Building, Home, Search, Sliders } from "lucide-react";

interface ComponentProps {}

interface BuildingType {
  id: number;
  height: number;
  color: string;
  shape: "square" | "circle" | "triangle";
  district: "residential" | "commercial" | "industrial";
}

const BUILDINGS: BuildingType[] = [
  { id: 1, height: 3, color: "red", shape: "square", district: "residential" },
  { id: 2, height: 5, color: "blue", shape: "circle", district: "commercial" },
  { id: 3, height: 4, color: "green", shape: "triangle", district: "industrial" },
  { id: 4, height: 2, color: "yellow", shape: "square", district: "residential" },
  { id: 5, height: 6, color: "purple", shape: "circle", district: "commercial" },
];

const COLORS = ["red", "blue", "green", "yellow", "purple"];
const SHAPES = ["square", "circle", "triangle"];
const DISTRICTS = ["residential", "commercial", "industrial"];

/**
 * VectorVille Explorer: An interactive component to teach Vector Database concepts
 */
const VectorVilleExplorer: React.FC<ComponentProps> = () => {
  const [buildings, setBuildings] = useState<BuildingType[]>(BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [similarBuildings, setSimilarBuildings] = useState<BuildingType[]>([]);
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [attributeWeights, setAttributeWeights] = useState({
    height: 1,
    color: 1,
    shape: 1,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];
      setSelectedBuilding(randomBuilding);
    }, 5000);

    return () => clearInterval(timer);
  }, [buildings]);

  useEffect(() => {
    if (selectedBuilding) {
      findSimilarBuildings(selectedBuilding);
    }
  }, [selectedBuilding, attributeWeights]);

  const findSimilarBuildings = (target: BuildingType) => {
    const similar = buildings
      .filter((b) => b.id !== target.id)
      .map((b) => ({
        building: b,
        similarity: calculateSimilarity(target, b),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 2)
      .map((item) => item.building);

    setSimilarBuildings(similar);
  };

  const calculateSimilarity = (a: BuildingType, b: BuildingType) => {
    const heightSim = 1 - Math.abs(a.height - b.height) / 6;
    const colorSim = a.color === b.color ? 1 : 0;
    const shapeSim = a.shape === b.shape ? 1 : 0;

    return (
      attributeWeights.height * heightSim +
      attributeWeights.color * colorSim +
      attributeWeights.shape * shapeSim
    );
  };

  const handleDistrictFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDistrict(e.target.value);
  };

  const handleAttributeWeight = (attribute: string, value: number) => {
    setAttributeWeights((prev) => ({ ...prev, [attribute]: value }));
  };

  const filteredBuildings = buildings.filter(
    (b) => filterDistrict === "all" || b.district === filterDistrict
  );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">VectorVille Explorer</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className={`w-20 h-20 flex items-end justify-center rounded-md cursor-pointer transition-all duration-300 ${
              selectedBuilding?.id === building.id ? "ring-4 ring-blue-500" : ""
            } ${
              similarBuildings.some((b) => b.id === building.id)
                ? "ring-2 ring-green-500"
                : ""
            }`}
            style={{
              backgroundColor: building.color,
              height: `${building.height * 20}px`,
            }}
            onClick={() => setSelectedBuilding(building)}
            role="button"
            aria-label={`Building ${building.id}`}
            tabIndex={0}
          >
            {building.shape === "square" && <Building className="mb-2" />}
            {building.shape === "circle" && <Home className="mb-2" />}
            {building.shape === "triangle" && (
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-transparent border-b-current mb-2" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
          onChange={handleDistrictFilter}
          value={filterDistrict}
        >
          <option value="all">All Districts</option>
          {DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Sliders className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={attributeWeights.height}
            onChange={(e) => handleAttributeWeight("height", parseFloat(e.target.value))}
            className="w-24"
          />
          <span>Height</span>
        </div>
        <div className="flex items-center gap-2">
          <Sliders className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={attributeWeights.color}
            onChange={(e) => handleAttributeWeight("color", parseFloat(e.target.value))}
            className="w-24"
          />
          <span>Color</span>
        </div>
        <div className="flex items-center gap-2">
          <Sliders className="text-gray-600" />
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={attributeWeights.shape}
            onChange={(e) => handleAttributeWeight("shape", parseFloat(e.target.value))}
            className="w-24"
          />
          <span>Shape</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Vector Database Insights</h2>
        <p className="mb-2">
          Each building represents a data point in our vector database. The attributes (height,
          color, shape) form a vector for similarity search.
        </p>
        <p className="mb-2">
          <Search className="inline mr-2" />
          Click on a building to find similar ones based on attribute weights.
        </p>
      </div>
    </div>
  );
};

export default VectorVilleExplorer;