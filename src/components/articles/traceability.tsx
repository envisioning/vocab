"use client"
import { useState, useEffect } from "react";
import { FileSearch, History, Database, GitBranch, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface TraceabilityNode {
    id: string;
    type: 'data' | 'model' | 'decision';
    title: string;
    description: string;
    timestamp: string;
}

interface ComponentProps {}

const TRACE_NODES: TraceabilityNode[] = [
    {
        id: "1",
        type: "data",
        title: "Initial Dataset",
        description: "Raw customer feedback data collected",
        timestamp: "2024-01-01"
    },
    {
        id: "2",
        type: "model",
        title: "Model v1",
        description: "Sentiment analysis model trained",
        timestamp: "2024-01-02"
    },
    {
        id: "3",
        type: "decision",
        title: "Algorithm Choice",
        description: "Selected BERT for better accuracy",
        timestamp: "2024-01-03"
    }
];

/**
 * Interactive AI Traceability Learning Component
 * Teaches students about tracking AI system evolution through investigation
 */
export default function TraceabilityBoard({}: ComponentProps) {
    const [activeNode, setActiveNode] = useState<string>("");
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [isInvestigating, setIsInvestigating] = useState(false);

    useEffect(() => {
        if (isInvestigating) {
            const timer = setInterval(() => {
                const remaining = TRACE_NODES.filter(node => !completedSteps.has(node.id));
                if (remaining.length > 0) {
                    setCompletedSteps(prev => new Set([...prev, remaining[0].id]));
                }
            }, 2000);

            return () => clearInterval(timer);
        }
    }, [isInvestigating, completedSteps]);

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'data': return <Database className="w-6 h-6" />;
            case 'model': return <GitBranch className="w-6 h-6" />;
            case 'decision': return <History className="w-6 h-6" />;
            default: return <AlertCircle className="w-6 h-6" />;
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">AI Project Timeline</h2>
                <button
                    onClick={() => setIsInvestigating(!isInvestigating)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    aria-label="Start Investigation"
                >
                    <FileSearch className="w-5 h-5 inline mr-2" />
                    {isInvestigating ? "Stop" : "Investigate"}
                </button>
            </div>

            <div className="space-y-4">
                {TRACE_NODES.map((node) => (
                    <div
                        key={node.id}
                        className={`p-4 border rounded-lg transition duration-300 ${
                            completedSteps.has(node.id) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveNode(node.id)}
                        onKeyPress={(e) => e.key === 'Enter' && setActiveNode(node.id)}
                    >
                        <div className="flex items-center gap-4">
                            {getNodeIcon(node.type)}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{node.title}</h3>
                                <p className="text-sm text-gray-600">{node.description}</p>
                            </div>
                            {completedSteps.has(node.id) && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}