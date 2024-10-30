"use client"
import { useState, useEffect } from "react";
import { Shield, Package, X, Check, AlertCircle, Brain } from "lucide-react";

interface SecurityItem {
  id: string;
  name: string;
  features: number[];
  position: { x: number; y: number };
  isDragging: boolean;
}

interface LayerNode {
  id: string;
  activation: number;
  connections: string[];
}

interface ComponentProps {}

const INITIAL_ITEMS: SecurityItem[] = [
  {
    id: "item1",
    name: "Water Bottle",
    features: [0.8, 0.2, 0.1],
    position: { x: 50, y: 300 },
    isDragging: false,
  },
  {
    id: "item2",
    name: "Backpack",
    features: [0.6, 0.7, 0.4],
    position: { x: 50, y: 400 },
    isDragging: false,
  }
];

const MLPFestivalSecurity: React.FC<ComponentProps> = () => {
  const [items, setItems] = useState<SecurityItem[]>(INITIAL_ITEMS);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [layerActivations, setLayerActivations] = useState<LayerNode[][]>([]);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initializeLayers = () => {
      const layer1 = Array(3).fill(null).map((_, i) => ({
        id: `l1n${i}`,
        activation: 0,
        connections: [`l2n0`, `l2n1`],
      }));
      const layer2 = Array(2).fill(null).map((_, i) => ({
        id: `l2n${i}`,
        activation: 0,
        connections: [`output`],
      }));
      const outputLayer = [{
        id: 'output',
        activation: 0,
        connections: [],
      }];
      
      setLayerActivations([layer1, layer2, outputLayer]);
    };

    initializeLayers();
    return () => {
      setLayerActivations([]);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setActiveItem(itemId);
    setDragOffset({
      x: e.clientX - item.position.x,
      y: e.clientY - item.position.y,
    });

    const updatedItems = items.map(i => ({
      ...i,
      isDragging: i.id === itemId,
    }));
    setItems(updatedItems);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeItem) return;

    const updatedItems = items.map(item => {
      if (item.id === activeItem) {
        return {
          ...item,
          position: {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          },
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleMouseUp = () => {
    if (!activeItem) return;

    const item = items.find(i => i.id === activeItem);
    if (!item) return;

    if (item.position.x > 300) {
      simulateNetwork(item);
    }

    setActiveItem(null);
    const updatedItems = items.map(i => ({
      ...i,
      isDragging: false,
    }));
    setItems(updatedItems);
  };

  const simulateNetwork = (item: SecurityItem) => {
    const newLayers = layerActivations.map(layer =>
      layer.map(node => ({
        ...node,
        activation: Math.random(),
      }))
    );
    setLayerActivations(newLayers);
    setPrediction(item.features[0] > 0.7);
  };

  return (
    <div 
      className="relative w-full h-[600px] bg-gray-100 p-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 left-4 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`absolute cursor-grab active:cursor-grabbing bg-white p-4 rounded-lg shadow-md
              ${item.isDragging ? 'z-50 shadow-lg' : 'z-10'}`}
            style={{
              transform: `translate(${item.position.x}px, ${item.position.y}px)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            role="button"
            tabIndex={0}
            aria-label={`Drag ${item.name}`}
          >
            <Package className="w-6 h-6 text-blue-500" />
            <span className="ml-2">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4">
        {prediction !== null && (
          <div className={`p-4 rounded-lg ${prediction ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {prediction ? <Check /> : <X />}
            <span className="ml-2">{prediction ? 'Allowed' : 'Denied'}</span>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center h-full">
        {layerActivations.map((layer, layerIndex) => (
          <div key={layerIndex} className="flex flex-col gap-4 mx-8">
            {layer.map((node) => (
              <div
                key={node.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${node.activation > 0.5 ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MLPFestivalSecurity;