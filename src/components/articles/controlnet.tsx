"use client"
import { useState, useEffect } from "react";
import { Puppet, Settings2, Image as ImageIcon, Wand2 } from "lucide-react";

interface Point {
  x: number;
  y: number;
  id: string;
}

interface ComponentProps {}

interface ControlState {
  points: Point[];
  mode: "edge" | "pose" | "sketch";
  isAnimating: boolean;
}

const INITIAL_POINTS: Point[] = [
  { x: 30, y: 30, id: "head" },
  { x: 50, y: 60, id: "torso" },
  { x: 30, y: 80, id: "leftLeg" },
  { x: 70, y: 80, id: "rightLeg" },
];

const MODES = [
  { id: "edge", label: "Edge Detection", icon: Settings2 },
  { id: "pose", label: "Pose Estimation", icon: Puppet },
  { id: "sketch", label: "Sketch Control", icon: Wand2 },
];

const PuppetMasterStudio: React.FC<ComponentProps> = () => {
  const [controlState, setControlState] = useState<ControlState>({
    points: INITIAL_POINTS,
    mode: "pose",
    isAnimating: true,
  });

  const [dragPoint, setDragPoint] = useState<string | null>(null);

  useEffect(() => {
    if (controlState.isAnimating) {
      const interval = setInterval(() => {
        setControlState((prev) => ({
          ...prev,
          points: prev.points.map((point) => ({
            ...point,
            y: point.y + Math.sin(Date.now() / 1000) * 0.5,
          })),
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [controlState.isAnimating]);

  const handleMouseDown = (id: string) => {
    setDragPoint(id);
    setControlState((prev) => ({ ...prev, isAnimating: false }));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragPoint) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - svgRect.left) / svgRect.width) * 100;
    const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;

    setControlState((prev) => ({
      ...prev,
      points: prev.points.map((point) =>
        point.id === dragPoint ? { ...point, x, y } : point
      ),
    }));
  };

  const handleMouseUp = () => {
    setDragPoint(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between mb-4">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setControlState((prev) => ({ ...prev, mode: id as ControlState["mode"] }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300
              ${controlState.mode === id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            aria-pressed={controlState.mode === id}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="relative aspect-video bg-white rounded-lg overflow-hidden">
        <svg
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {controlState.points.map((point) => (
            <g key={point.id}>
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="5"
                className="fill-blue-500 cursor-move"
                onMouseDown={() => handleMouseDown(point.id)}
                role="button"
                aria-label={`Control point ${point.id}`}
              />
              <line
                x1="50%"
                y1="50%"
                x2={`${point.x}%`}
                y2={`${point.y}%`}
                className="stroke-gray-400 stroke-2"
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => setControlState((prev) => ({ ...prev, isAnimating: !prev.isAnimating }))}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            aria-label={controlState.isAnimating ? "Stop animation" : "Start animation"}
          >
            {controlState.isAnimating ? "Stop" : "Animate"}
          </button>
          <button
            onClick={() => setControlState((prev) => ({ ...prev, points: INITIAL_POINTS }))}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuppetMasterStudio;