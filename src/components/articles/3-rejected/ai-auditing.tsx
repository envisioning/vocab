"use client"
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, XCircle, Activity, Database, Shield, Brain, UserCheck } from "lucide-react";

interface AuditMetric {
    name: string;
    value: number;
    status: "good" | "warning" | "critical";
}

interface AuditScenario {
    id: number;
    title: string;
    metrics: AuditMetric[];
    issues: string[];
}

const SCENARIOS: AuditScenario[] = [
    {
        id: 1,
        title: "Restaurant Review AI",
        metrics: [
            { name: "Bias Level", value: 75, status: "warning" },
            { name: "Data Quality", value: 90, status: "good" },
            { name: "Ethics Score", value: 45, status: "critical" },
            { name: "Performance", value: 85, status: "good" }
        ],
        issues: ["Bias against non-English reviews", "Limited cultural context"]
    }
];

/**
 * AI Audit Laboratory Component
 * Interactive educational component teaching AI auditing concepts
 */
const AIAuditLab = () => {
    const [activeScenario, setActiveScenario] = useState<AuditScenario>(SCENARIOS[0]);
    const [identifiedIssues, setIdentifiedIssues] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedMetrics = activeScenario.metrics.map(metric => ({
                ...metric,
                value: Math.max(0, Math.min(100, metric.value + (Math.random() * 10 - 5)))
            }));
            setActiveScenario(prev => ({ ...prev, metrics: updatedMetrics }));
        }, 2000);

        return () => clearInterval(interval);
    }, [activeScenario]);

    const handleIssueIdentification = (issue: string) => {
        if (!identifiedIssues.includes(issue)) {
            setIdentifiedIssues(prev => [...prev, issue]);
            setScore(prev => prev + 10);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "good": return <CheckCircle2 className="text-green-500" />;
            case "warning": return <AlertCircle className="text-yellow-500" />;
            case "critical": return <XCircle className="text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg" role="main">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Brain className="text-blue-500" />
                AI Audit Laboratory
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="text-blue-500" />
                        System Metrics
                    </h2>
                    {activeScenario.metrics.map((metric, index) => (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <span>{metric.name}</span>
                                {getStatusIcon(metric.status)}
                            </div>
                            <div className="h-2 bg-gray-200 rounded">
                                <div 
                                    className={`h-full rounded transition-all duration-500 ${
                                        metric.status === "good" ? "bg-green-500" :
                                        metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${metric.value}%` }}
                                    role="progressbar"
                                    aria-valuenow={metric.value}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="text-blue-500" />
                        Audit Findings
                    </h2>
                    <div className="space-y-2">
                        {activeScenario.issues.map((issue, index) => (
                            <button
                                key={index}
                                onClick={() => handleIssueIdentification(issue)}
                                className={`w-full text-left p-2 rounded transition-colors duration-300 ${
                                    identifiedIssues.includes(issue)
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                disabled={identifiedIssues.includes(issue)}
                            >
                                {issue}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserCheck className="text-blue-500" />
                    <span className="font-semibold">Audit Score: {score}</span>
                </div>
                <Database className="text-blue-500" />
            </div>
        </div>
    );
};

export default AIAuditLab;