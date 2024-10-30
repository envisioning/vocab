"use client"
import { useState, useEffect } from "react";
import { Gauge, AlertTriangle, Activity, Cpu, Database, Thermometer, Clock, Battery } from "lucide-react";

interface Metric {
    name: string;
    value: number;
    threshold: number;
    unit: string;
    icon: JSX.Element;
}

interface Scenario {
    id: number;
    title: string;
    metrics: Metric[];
    challenge: string;
    solution: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        title: "Training Load Spike",
        metrics: [
            { name: "CPU Usage", value: 95, threshold: 80, unit: "%", icon: <Cpu className="w-6 h-6" /> },
            { name: "Memory", value: 85, threshold: 90, unit: "%", icon: <Database className="w-6 h-6" /> },
            { name: "Temperature", value: 78, threshold: 85, unit: "°C", icon: <Thermometer className="w-6 h-6" /> },
            { name: "Response Time", value: 250, threshold: 200, unit: "ms", icon: <Clock className="w-6 h-6" /> }
        ],
        challenge: "High CPU usage detected during model training. What actions should you take?",
        solution: "Reduce batch size or learning rate to decrease computational load"
    }
];

const AISystemMonitor = () => {
    const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
    const [userResponse, setUserResponse] = useState<string>("");
    const [showSolution, setShowSolution] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        const metricsInterval = setInterval(() => {
            setCurrentScenario(prev => ({
                ...prev,
                metrics: prev.metrics.map(metric => ({
                    ...metric,
                    value: Math.min(100, metric.value + (Math.random() * 10 - 5))
                }))
            }));
        }, 2000);

        return () => clearInterval(metricsInterval);
    }, []);

    const handleMetricAdjust = (index: number, change: number) => {
        setCurrentScenario(prev => ({
            ...prev,
            metrics: prev.metrics.map((metric, i) => 
                i === index ? {...metric, value: Math.max(0, Math.min(100, metric.value + change))} : metric
            )
        }));
    };

    const checkStatus = (value: number, threshold: number): string => {
        if (value >= threshold) return "text-red-500";
        if (value >= threshold * 0.8) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">AI System Health Monitor</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                {currentScenario.metrics.map((metric, index) => (
                    <div key={metric.name} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            {metric.icon}
                            <span className="font-semibold">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Gauge className={`w-8 h-8 ${checkStatus(metric.value, metric.threshold)}`} />
                            <span className={`text-xl ${checkStatus(metric.value, metric.threshold)}`}>
                                {metric.value.toFixed(1)}{metric.unit}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleMetricAdjust(index, -5)}
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                aria-label={`Decrease ${metric.name}`}
                            >
                                -
                            </button>
                            <button
                                onClick={() => handleMetricAdjust(index, 5)}
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                                aria-label={`Increase ${metric.name}`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Current Challenge
                </h3>
                <p className="mt-2">{currentScenario.challenge}</p>
                <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Enter your solution..."
                    rows={3}
                />
                <button
                    onClick={() => setShowSolution(true)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                    Check Solution
                </button>
                {showSolution && (
                    <div className="mt-2 p-2 bg-green-100 rounded">
                        <p className="font-semibold">Suggested Solution:</p>
                        <p>{currentScenario.solution}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AISystemMonitor;