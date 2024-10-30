"use client"
import { useState, useEffect } from "react";
import { Trees, Users, Vote, Check, X, RefreshCw } from "lucide-react";

interface BaggingForestProps {}

type PredictionType = "A" | "B";
type TreeState = {
  id: number;
  prediction: PredictionType;
  confidence: number;
  dataPoints: number;
};

const INITIAL_TREES: TreeState[] = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  prediction: Math.random() > 0.5 ? "A" : "B",
  confidence: Math.random() * 0.5 + 0.5,
  dataPoints: Math.floor(Math.random() * 10) + 5,
}));

/**
 * BaggingForest: Interactive component teaching bagging through forest metaphor
 * Demonstrates ensemble learning with student council election example
 */
const BaggingForest: React.FC<BaggingForestProps> = () => {
  const [trees, setTrees] = useState<TreeState[]>(INITIAL_TREES);
  const [draggedPoints, setDraggedPoints] = useState<number>(0);
  const [phase, setPhase] = useState<"plant" | "predict" | "result">("plant");
  const [finalPrediction, setFinalPrediction] = useState<PredictionType | null>(null);

  useEffect(() => {
    if (phase === "predict") {
      const timer = setTimeout(() => {
        const totalA = trees.filter(t => t.prediction === "A").length;
        setFinalPrediction(totalA > trees.length / 2 ? "A" : "B");
        setPhase("result");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, trees]);

  const handleDragPoints = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedPoints(prev => Math.min(prev + 1, 20));
    if (draggedPoints >= 19) {
      setPhase("predict");
    }
  };

  const handleReset = () => {
    setTrees(INITIAL_TREES);
    setDraggedPoints(0);
    setPhase("plant");
    setFinalPrediction(null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen" role="main">
      <h1 className="text-2xl font-bold mb-6">Student Council Election Bagging</h1>
      
      <div className="relative w-full max-w-3xl h-96 bg-gray-100 rounded-lg p-4">
        <div className="flex justify-around mb-8">
          {trees.map((tree) => (
            <div
              key={tree.id}
              className={`flex flex-col items-center transition-all duration-300 ${
                phase === "predict" ? "scale-110" : ""
              }`}
              role="tree"
            >
              <Trees
                className={`w-12 h-12 ${
                  phase === "predict"
                    ? tree.prediction === "A"
                      ? "text-blue-500"
                      : "text-green-500"
                    : "text-gray-600"
                }`}
              />
              <span className="mt-2">Group {tree.id + 1}</span>
              {phase !== "plant" && (
                <Vote className={`w-6 h-6 mt-2 ${
                  tree.prediction === "A" ? "text-blue-500" : "text-green-500"
                }`} />
              )}
            </div>
          ))}
        </div>

        {phase === "plant" && (
          <div
            className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragPoints}
            role="region"
            aria-label="Drop zone for data points"
          >
            <Users
              className="w-8 h-8 text-gray-400"
              onDragStart={(e) => {
                e.dataTransfer.setData("text", "voter");
                e.currentTarget.setAttribute("draggable", "true");
              }}
            />
            <span className="ml-2">Drag voters here ({draggedPoints}/20)</span>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-col items-center mt-8">
            <div className="text-xl font-bold mb-4">
              Final Prediction: Candidate {finalPrediction}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
              aria-label="Reset simulation"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaggingForest;