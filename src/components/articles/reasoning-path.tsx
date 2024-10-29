"use client"
import { useState, useEffect } from "react";
import { Brain, Route, Map, Link2, Lightbulb, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

interface Evidence {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

const DetectiveAcademy = () => {
  const [evidence, setEvidence] = useState<Evidence[]>([
    { id: "e1", text: "Muddy footprints found", x: 100, y: 100 },
    { id: "e2", text: "Window broken from outside", x: 300, y: 100 },
    { id: "e3", text: "Jewelry box empty", x: 500, y: 100 },
    { id: "e4", text: "Neighbor saw suspicious person", x: 200, y: 300 },
    { id: "e5", text: "Alarm system disabled", x: 400, y: 300 }
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const cleanup = () => {
      setDragging(null);
      setConnecting(null);
    };

    document.addEventListener("mouseup", cleanup);
    return () => document.removeEventListener("mouseup", cleanup);
  }, []);

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    setDragging(id);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    setEvidence(prev => prev.map(item => 
      item.id === dragging 
        ? { ...item, x: e.clientX - 50, y: e.clientY - 25 }
        : item
    ));
  };

  const handleConnect = (id: string) => {
    if (!connecting) {
      setConnecting(id);
    } else if (connecting !== id) {
      setConnections(prev => [...prev, {
        from: connecting,
        to: id,
        strength: Math.random() * 100
      }]);
      setConnecting(null);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-amber-50 p-8 select-none"
      onMouseMove={handleDragMove}
      role="application"
      aria-label="Detective's Investigation Board"
    >
      <div className="flex items-center mb-6 gap-4">
        <Brain className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">PathFinder Detective Academy</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setConnections([])}
        >
          <Route className="w-4 h-4" />
          Reset Paths
        </button>
        
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() => setFeedback("Looking good! Try finding another path.")}
        >
          <Lightbulb className="w-4 h-4" />
          Check Logic
        </button>
      </div>

      {feedback && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {feedback}
        </div>
      )}

      <div className="relative" style={{height: "calc(100vh - 200px)"}}>
        {connections.map((conn, i) => {
          const from = evidence.find(e => e.id === conn.from);
          const to = evidence.find(e => e.id === conn.to);
          if (!from || !to) return null;

          return (
            <svg key={i} className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <line
                x1={from.x + 100}
                y1={from.y + 25}
                x2={to.x}
                y2={to.y + 25}
                stroke={`hsl(${conn.strength}, 70%, 50%)`}
                strokeWidth="2"
              />
            </svg>
          );
        })}

        {evidence.map(item => (
          <div
            key={item.id}
            className="absolute bg-white p-4 rounded-lg shadow-lg cursor-move flex items-center gap-3"
            style={{
              left: item.x,
              top: item.y,
              width: 200
            }}
            onMouseDown={(e) => handleDragStart(item.id, e)}
            role="button"
            tabIndex={0}
            aria-label={`Evidence: ${item.text}`}
          >
            <div 
              className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
              onClick={() => handleConnect(item.id)}
            >
              <Link2 className="w-4 h-4 text-blue-600" />
            </div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectiveAcademy;