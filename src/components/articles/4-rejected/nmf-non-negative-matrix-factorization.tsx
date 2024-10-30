"use client"
import { useState, useEffect } from "react";
import { Palette, Image, Sliders, RefreshCw, Eye } from "lucide-react";

interface ComponentProps {}

type ColorType = { r: number; g: number; b: number };
type ImageDataType = ColorType[][];

const INITIAL_COMPONENTS = 3;
const MAX_COMPONENTS = 5;
const SAMPLE_IMAGES = [
  { name: "Sunset", data: [] },
  { name: "Forest", data: [] },
  { name: "City", data: [] },
];

/**
 * NMFColorMixer: An interactive component to demonstrate Non-Negative Matrix Factorization
 * using color decomposition and reconstruction of images.
 */
const NMFColorMixer: React.FC<ComponentProps> = () => {
  const [selectedImage, setSelectedImage] = useState<ImageDataType>([]);
  const [components, setComponents] = useState<number>(INITIAL_COMPONENTS);
  const [baseColors, setBaseColors] = useState<ColorType[]>([]);
  const [reconstructedImage, setReconstructedImage] = useState<ImageDataType>([]);
  const [showDifference, setShowDifference] = useState<boolean>(false);

  useEffect(() => {
    // Simulating image loading and NMF process
    const loadImage = async () => {
      // In a real implementation, we'd load and process the actual image data here
      const mockImageData: ImageDataType = Array(10)
        .fill(null)
        .map(() =>
          Array(10)
            .fill(null)
            .map(() => ({ r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 }))
        );
      setSelectedImage(mockImageData);
    };

    loadImage();
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (selectedImage.length > 0) {
      performNMF();
    }
  }, [selectedImage, components]);

  const performNMF = () => {
    // Simulating NMF process
    const mockBaseColors: ColorType[] = Array(components)
      .fill(null)
      .map(() => ({ r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 }));
    setBaseColors(mockBaseColors);

    // Simulating image reconstruction
    const mockReconstructedImage: ImageDataType = selectedImage.map((row) =>
      row.map(() => {
        const randomBaseColor = mockBaseColors[Math.floor(Math.random() * mockBaseColors.length)];
        return { ...randomBaseColor };
      })
    );
    setReconstructedImage(mockReconstructedImage);
  };

  const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComponents(Number(e.target.value));
  };

  const toggleDifferenceView = () => {
    setShowDifference(!showDifference);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">NMF Color Mixer</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2">Original Image</h3>
          <div className="bg-white p-2 rounded">
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
              <Image className="text-gray-500" size={48} />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2">Reconstructed Image</h3>
          <div className="bg-white p-2 rounded">
            <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
              <Image className="text-gray-500" size={48} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="components" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Base Colors: {components}
        </label>
        <input
          type="range"
          id="components"
          min="1"
          max={MAX_COMPONENTS}
          value={components}
          onChange={handleComponentChange}
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Base Colors</h3>
        <div className="flex gap-2">
          {baseColors.map((color, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={toggleDifferenceView}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <Eye size={18} />
          {showDifference ? "Hide" : "Show"} Difference
        </button>
        <button
          onClick={performNMF}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          <RefreshCw size={18} />
          Recalculate
        </button>
      </div>
    </div>
  );
};

export default NMFColorMixer;