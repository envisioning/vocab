import React, { useState } from "react";
import { AlertTriangle, BookOpen, ThumbsUp, Skull } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DoomEstimator = () => {
  const [probability, setProbability] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newProb = Math.min(100, Math.max(0, Math.round((x / width) * 100)));
    setProbability(newProb);
    setDragStartX(x);
  };

  const handleMouseMove = (e) => {
    if (dragStartX !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newProb = Math.min(100, Math.max(0, Math.round((x / width) * 100)));
      setProbability(newProb);
    }
  };

  const handleMouseUp = () => {
    setDragStartX(null);
  };

  const getInterpretation = (prob) => {
    if (prob < 20)
      return {
        text: "Optimistic View",
        description:
          "You believe AI systems can be developed safely with proper precautions",
        icon: ThumbsUp,
        color: "text-green-500",
      };
    if (prob < 50)
      return {
        text: "Concerned View",
        description:
          "You see significant risks but believe they can be mitigated",
        icon: BookOpen,
        color: "text-yellow-500",
      };
    if (prob < 80)
      return {
        text: "Alarmed View",
        description:
          "You believe existential risk from AI is more likely than not",
        icon: AlertTriangle,
        color: "text-orange-500",
      };
    return {
      text: "Doomer View",
      description: "You believe catastrophic outcomes are highly probable",
      icon: Skull,
      color: "text-red-500",
    };
  };

  const interpretation = getInterpretation(probability);
  const Icon = interpretation.icon;

  return (
    <Card className="w-full max-w-2xl p-6 bg-slate-50">
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">What's your p(doom)?</h2>
            <div className="text-2xl font-bold">{probability}%</div>
          </div>

          {/* Interactive Probability Slider */}
          <div
            className="relative h-12 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Draggable Handle */}
            <div
              className="absolute top-0 w-4 h-12 bg-white border-2 border-slate-300 rounded cursor-grab active:cursor-grabbing"
              style={{
                left: `calc(${probability}% - 0.5rem)`,
                transition: dragStartX !== null ? "none" : "left 0.2s ease-out",
              }}
            />
          </div>

          {/* Current Interpretation */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg ${
              probability > 50 ? "bg-red-50" : "bg-slate-100"
            }`}
          >
            <Icon className={`w-8 h-8 ${interpretation.color}`} />
            <div>
              <h3 className={`font-bold ${interpretation.color}`}>
                {interpretation.text}
              </h3>
              <p className="text-sm text-slate-600">
                {interpretation.description}
              </p>
            </div>
          </div>

          {/* Reference Points */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-100 rounded">
              <div className="font-semibold">Yudkowsky's Estimate</div>
              <div className="text-slate-600">&gt;99% probability of doom</div>
            </div>
            <div className="p-3 bg-slate-100 rounded">
              <div className="font-semibold">More Optimistic Views</div>
              <div className="text-slate-600">~5-30% probability range</div>
            </div>
          </div>

          {/* Explanation Toggle */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full p-2 text-sm text-left hover:bg-slate-100 rounded transition-colors"
          >
            {showExplanation ? "← Hide Details" : "ℹ️ What is p(doom)?"}
          </button>

          {/* Extended Explanation */}
          {showExplanation && (
            <div className="p-4 bg-slate-100 rounded text-sm space-y-3">
              <p>
                p(doom) refers to the estimated probability of an existential
                catastrophe due to advanced artificial intelligence. This
                concept is central to AI safety discussions and risk assessment.
              </p>
              <p>Factors that influence this probability include:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>AI alignment challenges</li>
                <li>Speed of capability gains</li>
                <li>Robustness of safety measures</li>
                <li>Coordination among developers</li>
                <li>Technical difficulty of control</li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                Note: These estimates are highly uncertain and subject to
                ongoing debate in the AI safety community.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoomEstimator;
