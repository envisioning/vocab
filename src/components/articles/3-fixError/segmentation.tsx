"use client"
import { useState, useEffect } from "react";
import { Layers, ScanLine, Users, Image, PuzzlePiece, Camera, Check, X } from "lucide-react";

interface Segment {
  id: number;
  name: string;
  color: string;
  isSelected: boolean;
}

export default function SegmentationLearning() {
  const [activeMetaphor, setActiveMetaphor] = useState<number>(0);
  const [segments, setSegments] = useState<Segment[]>([
    { id: 1, name: "Athletes", color: "bg-blue-200", isSelected: false },
    { id: 2, name: "Artists", color: "bg-green-200", isSelected: false },
    { id: 3, name: "Academics", color: "bg-yellow-200", isSelected: false },
  ]);

  const metaphors = [
    {
      title: "Cafeteria Groups",
      icon: <Users className="w-6 h-6" />,
      description: "Like students naturally grouping in a cafeteria"
    },
    {
      title: "Puzzle Pieces",
      icon: <PuzzlePiece className="w-6 h-6" />,
      description: "Similar to sorting puzzle pieces by color and pattern"
    },
    {
      title: "Photo Moments",
      icon: <Camera className="w-6 h-6" />,
      description: "Like a photographer capturing different aspects of an event"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetaphor((prev) => (prev + 1) % metaphors.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSegmentClick = (id: number) => {
    setSegments(segments.map(seg => 
      seg.id === id ? { ...seg, isSelected: !seg.isSelected } : seg
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Understanding Segmentation</h1>
        <p className="text-gray-600">Discover how AI breaks down complex information into meaningful parts</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {metaphors.map((metaphor, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all duration-300 ${
              activeMetaphor === index ? 'bg-blue-100 scale-105' : 'bg-gray-50'
            }`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveMetaphor(index)}
            onKeyDown={(e) => e.key === 'Enter' && setActiveMetaphor(index)}
          >
            <div className="flex items-center space-x-3">
              {metaphor.icon}
              <h3 className="font-semibold">{metaphor.title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">{metaphor.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Interactive Segmentation</h2>
          <Layers className="w-6 h-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {segments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => handleSegmentClick(segment.id)}
              className={`p-4 rounded-lg ${segment.color} transition-all duration-300 
                ${segment.isSelected ? 'ring-2 ring-blue-500' : ''}`}
              aria-pressed={segment.isSelected}
            >
              <div className="flex justify-between items-center">
                <span>{segment.name}</span>
                {segment.isSelected ? 
                  <Check className="w-5 h-5 text-blue-500" /> : 
                  <X className="w-5 h-5 text-gray-400" />
                }
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ScanLine className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Try it yourself:</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Click on segments to group similar items together. Notice how segmentation helps organize complex information.
          </p>
        </div>
      </div>
    </div>
  );
}