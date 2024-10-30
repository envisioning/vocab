"use client"
import { useState, useEffect } from "react";
import { Search, Zap, Shield, Scale, CheckCircle, XCircle } from "lucide-react";

interface ComponentProps {}

type InspectionTool = {
  id: string;
  name: string;
  icon: JSX.Element;
};

type AuditResult = {
  toolId: string;
  issue: string;
  suggestion: string;
};

/**
 * AIAuditDashboard: An interactive component for teaching AI Auditing concepts.
 * It simulates the process of auditing an AI system using drag-and-drop tools.
 */
const AIAuditDashboard: React.FC<ComponentProps> = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dropZone, setDropZone] = useState<string | null>(null);
  const [isAutoDemoRunning, setIsAutoDemoRunning] = useState(true);

  const inspectionTools: InspectionTool[] = [
    { id: "bias", name: "Bias Detector", icon: <Search className="w-6 h-6" /> },
    { id: "transparency", name: "Transparency Scanner", icon: <Zap className="w-6 h-6" /> },
    { id: "ethics", name: "Ethical Compass", icon: <Shield className="w-6 h-6" /> },
    { id: "fairness", name: "Fairness Meter", icon: <Scale className="w-6 h-6" /> },
  ];

  const auditAreas = ["input", "process", "output"];

  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    setActiveToolId(toolId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropZone(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: string) => {
    e.preventDefault();
    setDropZone(zone);
  };

  const handleDrop = (e: React.DragEvent, zone: string) => {
    e.preventDefault();
    if (activeToolId) {
      const newResult: AuditResult = {
        toolId: activeToolId,
        issue: `${zone} issue detected`,
        suggestion: `Improve ${zone} handling`,
      };
      setResults((prev) => [...prev, newResult]);
    }
    setActiveToolId(null);
    setDropZone(null);
  };

  const resetAudit = () => {
    setResults([]);
    setIsAutoDemoRunning(false);
  };

  useEffect(() => {
    if (isAutoDemoRunning) {
      const demoInterval = setInterval(() => {
        const randomTool = inspectionTools[Math.floor(Math.random() * inspectionTools.length)];
        const randomZone = auditAreas[Math.floor(Math.random() * auditAreas.length)];
        const newResult: AuditResult = {
          toolId: randomTool.id,
          issue: `${randomZone} issue detected`,
          suggestion: `Improve ${randomZone} handling`,
        };
        setResults((prev) => [...prev, newResult]);
      }, 3000);

      return () => clearInterval(demoInterval);
    }
  }, [isAutoDemoRunning]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">AI Audit Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        {inspectionTools.map((tool) => (
          <div
            key={tool.id}
            draggable
            onDragStart={(e) => handleDragStart(e, tool.id)}
            onDragEnd={handleDragEnd}
            className="flex items-center p-2 bg-white rounded cursor-move"
          >
            {tool.icon}
            <span className="ml-2">{tool.name}</span>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mb-4">
        {auditAreas.map((area) => (
          <div
            key={area}
            onDragOver={(e) => handleDragOver(e, area)}
            onDrop={(e) => handleDrop(e, area)}
            className={`flex-1 h-32 border-2 rounded ${
              dropZone === area ? "border-blue-500" : "border-gray-300"
            } ${isDragging ? "bg-blue-100" : "bg-white"}`}
          >
            <h2 className="text-center font-semibold">{area.charAt(0).toUpperCase() + area.slice(1)}</h2>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Audit Results</h2>
        {results.map((result, index) => (
          <div key={index} className="bg-white p-2 rounded mb-2">
            <p>
              <strong>{inspectionTools.find((t) => t.id === result.toolId)?.name}:</strong> {result.issue}
            </p>
            <p className="text-sm text-gray-600">Suggestion: {result.suggestion}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={resetAudit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Reset Audit
        </button>
        <div className="flex items-center">
          <span className="mr-2">Certification:</span>
          {results.length >= 3 ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAuditDashboard;