"use client"
import { useState, useEffect } from "react";
import { Users, Music, Book, Dumbbell, Heart, Coffee, Brain, AlertCircle } from "lucide-react";

interface Guest {
  id: number;
  name: string;
  interests: string[];
  age: number;
  profession: string;
  personality: string;
}

interface Cluster {
  id: number;
  guests: Guest[];
  position: { x: number; y: number };
}

const INITIAL_GUESTS: Guest[] = [
  { id: 1, name: "Alex", interests: ["sports", "music"], age: 25, profession: "teacher", personality: "extrovert" },
  { id: 2, name: "Beth", interests: ["books", "art"], age: 28, profession: "artist", personality: "introvert" },
  // Add more guests...
];

const CRITERIA = ["interests", "age", "profession", "personality"];

export default function ClusteringVisualizer() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCriterion, setSelectedCriterion] = useState<string>("interests");
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const initialClusters = automaticClustering(guests, selectedCriterion);
    setClusters(initialClusters);
    
    return () => {
      setClusters([]);
      setSatisfaction(0);
    };
  }, [selectedCriterion]);

  const handleDragStart = (guest: Guest) => {
    setIsDragging(true);
    setDraggedGuest(guest);
  };

  const handleDragEnd = (e: React.DragEvent, clusterId: number) => {
    if (!draggedGuest) return;
    
    const updatedClusters = clusters.map(cluster => {
      if (cluster.id === clusterId) {
        return { ...cluster, guests: [...cluster.guests, draggedGuest] };
      }
      return cluster;
    });
    
    setClusters(updatedClusters);
    calculateSatisfaction(updatedClusters);
    setIsDragging(false);
    setDraggedGuest(null);
  };

  const calculateSatisfaction = (currentClusters: Cluster[]) => {
    // Simplified satisfaction calculation
    const score = Math.random() * 100; // Replace with actual metric
    setSatisfaction(Math.round(score));
  };

  const automaticClustering = (guestList: Guest[], criterion: string): Cluster[] => {
    // Simplified clustering logic
    return [
      { id: 1, guests: guestList.slice(0, 3), position: { x: 100, y: 100 } },
      { id: 2, guests: guestList.slice(3, 6), position: { x: 300, y: 100 } },
    ];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" role="main">
      <h1 className="text-2xl font-bold mb-6">Party Guest Clustering</h1>
      
      <div className="flex gap-4 mb-6">
        {CRITERIA.map(criterion => (
          <button
            key={criterion}
            onClick={() => setSelectedCriterion(criterion)}
            className={`px-4 py-2 rounded ${
              selectedCriterion === criterion ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-pressed={selectedCriterion === criterion}
          >
            {criterion}
          </button>
        ))}
      </div>

      <div className="relative h-[500px] border rounded-lg bg-white p-4">
        {clusters.map(cluster => (
          <div
            key={cluster.id}
            className="absolute w-40 h-40 border-2 rounded-full flex items-center justify-center"
            style={{ left: cluster.position.x, top: cluster.position.y }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDragEnd(e, cluster.id)}
          >
            {cluster.guests.map(guest => (
              <div
                key={guest.id}
                draggable
                onDragStart={() => handleDragStart(guest)}
                className="p-2 bg-blue-100 rounded-full m-1 cursor-move"
              >
                <Users className="w-6 h-6" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Clustering Satisfaction</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 rounded-full h-4 transition-all duration-300"
            style={{ width: `${satisfaction}%` }}
            role="progressbar"
            aria-valuenow={satisfaction}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}