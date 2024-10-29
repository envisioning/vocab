"use client"
import { useState, useEffect } from "react";
import { Code2, Eye, Paintbrush, Play, RefreshCw, Search, Settings, Zap } from "lucide-react";

interface CodeMirrorStudioProps {}

type CodeState = {
  original: string;
  runtime: string;
  properties: string[];
  methods: string[];
}

const INITIAL_CODE = `class Artist {
  style = "abstract";
  paint() {
    return "🎨";
  }
}`;

const CodeMirrorStudio: React.FC<CodeMirrorStudioProps> = () => {
  const [codeState, setCodeState] = useState<CodeState>({
    original: INITIAL_CODE,
    runtime: INITIAL_CODE,
    properties: ["style"],
    methods: ["paint"]
  });

  const [activeTab, setActiveTab] = useState<"inspect" | "modify" | "analyze">("inspect");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const sequence = [
        () => highlightInspection(),
        () => showModification(),
        () => demonstrateAnalysis()
      ];
      let currentStep = 0;
      
      const interval = setInterval(() => {
        sequence[currentStep]();
        currentStep = (currentStep + 1) % sequence.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const highlightInspection = () => {
    setActiveTab("inspect");
    setCodeState(prev => ({
      ...prev,
      properties: ["style"],
      methods: ["paint"]
    }));
  };

  const showModification = () => {
    setActiveTab("modify");
    setCodeState(prev => ({
      ...prev,
      runtime: prev.original.replace("abstract", "impressionist")
    }));
  };

  const demonstrateAnalysis = () => {
    setActiveTab("analyze");
    setCodeState(prev => ({
      ...prev,
      methods: ["paint", "analyzeStyle"]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Code2 className="text-blue-500" />
          Code Mirror Studio
        </h2>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white"
          aria-label={isAnimating ? "Pause animation" : "Start animation"}
        >
          {isAnimating ? <RefreshCw className="animate-spin" /> : <Play />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="flex items-center gap-2 mb-2">
            <Paintbrush className="text-blue-500" />
            Original Code
          </h3>
          <pre className="bg-gray-100 p-4 rounded">{codeState.original}</pre>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("inspect")}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                activeTab === "inspect" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <Eye size={16} /> Inspect
            </button>
            <button
              onClick={() => setActiveTab("modify")}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                activeTab === "modify" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <Settings size={16} /> Modify
            </button>
            <button
              onClick={() => setActiveTab("analyze")}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                activeTab === "analyze" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <Search size={16} /> Analyze
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h4 className="flex items-center gap-2 mb-2">
              <Zap className="text-blue-500" />
              Runtime View
            </h4>
            <pre>{codeState.runtime}</pre>
            <div className="mt-4">
              <p>Properties: {codeState.properties.join(", ")}</p>
              <p>Methods: {codeState.methods.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeMirrorStudio;