"use client"
import { useState, useEffect } from "react";
import { Image, Zap, Eye, List, RefreshCw } from "lucide-react";

interface ComponentProps {}

type SegmentedObject = {
  id: number;
  name: string;
  color: string;
};

/**
 * SAMExplorer: An interactive component to teach SAM (Segment Anything Model)
 * to 15-18 year old students.
 */
const SAMExplorer: React.FC<ComponentProps> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [segmentedObjects, setSegmentedObjects] = useState<SegmentedObject[]>([]);
  const [isSegmenting, setIsSegmenting] = useState<boolean>(false);

  useEffect(() => {
    // Simulating initial image load
    setSelectedImage("/sample-image.jpg");
    return () => {
      // Cleanup: reset state when component unmounts
      setSelectedImage(null);
      setSegmentedObjects([]);
    };
  }, []);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSegmenting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSegmenting(true);
    simulateSegmentation(x, y);
  };

  const simulateSegmentation = (x: number, y: number) => {
    // Simulating SAM's segmentation process
    setTimeout(() => {
      const newObject: SegmentedObject = {
        id: segmentedObjects.length + 1,
        name: `Object ${segmentedObjects.length + 1}`,
        color: getRandomColor(),
      };
      setSegmentedObjects((prev) => [...prev, newObject]);
      setIsSegmenting(false);
    }, 1000);
  };

  const getRandomColor = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetSegmentation = () => {
    setSegmentedObjects([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">SAM Explorer</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div
            className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden cursor-crosshair"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            aria-label="Click to segment image"
          >
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Sample image for segmentation"
                className="w-full h-full object-cover"
              />
            )}
            {segmentedObjects.map((obj) => (
              <div
                key={obj.id}
                className="absolute inset-0 border-4 rounded-md pointer-events-none"
                style={{ borderColor: obj.color }}
              />
            ))}
            {isSegmenting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Zap className="text-white animate-pulse" size={48} />
              </div>
            )}
          </div>
          <button
            onClick={resetSegmentation}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            aria-label="Reset segmentation"
          >
            <RefreshCw className="inline-block mr-2" size={16} /> Reset
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Segmented Objects</h2>
          <ul className="space-y-2">
            {segmentedObjects.map((obj) => (
              <li
                key={obj.id}
                className="flex items-center p-2 bg-white rounded shadow"
              >
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: obj.color }}
                />
                <span>{obj.name}</span>
              </li>
            ))}
          </ul>
          {segmentedObjects.length === 0 && (
            <p className="text-gray-500 italic">
              Click on the image to start segmenting objects.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">How SAM Works</h2>
        <p className="mb-2">
          SAM (Segment Anything Model) is like a superhuman art curator who can
          instantly identify and outline every object in an image.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <Image className="inline-block mr-2" size={16} /> Input: Any image
          </li>
          <li>
            <Eye className="inline-block mr-2" size={16} /> Detection: Identify
            objects
          </li>
          <li>
            <List className="inline-block mr-2" size={16} /> Segmentation:
            Precisely outline objects
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SAMExplorer;