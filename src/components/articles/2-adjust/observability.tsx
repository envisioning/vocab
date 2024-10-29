"use client"
import { useState, useEffect } from "react";
import { Activity, AlertTriangle, Fish, Heart, Thermometer, Droplets, Timer, Zap, BarChart } from "lucide-react";

interface MetricType {
  id: string;
  name: string;
  value: number;
  icon: JSX.Element;
  unit: string;
}

interface SystemState {
  metrics: MetricType[];
  health: 'normal' | 'warning' | 'critical';
  timestamp: number;
}

const INITIAL_METRICS: MetricType[] = [
  { id: 'temp', name: 'Temperature', value: 25, icon: <Thermometer className="w-6 h-6" />, unit: '°C' },
  { id: 'activity', name: 'Activity Level', value: 85, icon: <Activity className="w-6 h-6" />, unit: '%' },
  { id: 'oxygen', name: 'Oxygen Level', value: 95, icon: <Droplets className="w-6 h-6" />, unit: '%' },
  { id: 'response', name: 'Response Time', value: 200, icon: <Timer className="w-6 h-6" />, unit: 'ms' },
  { id: 'performance', name: 'Performance', value: 90, icon: <Zap className="w-6 h-6" />, unit: '%' }
];

export default function ObservabilityDemo() {
  const [systemState, setSystemState] = useState<SystemState>({
    metrics: INITIAL_METRICS,
    health: 'normal',
    timestamp: Date.now()
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setSystemState(prev => ({
        metrics: prev.metrics.map(metric => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10))
        })),
        health: calculateHealth(prev.metrics),
        timestamp: Date.now()
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const calculateHealth = (metrics: MetricType[]): 'normal' | 'warning' | 'critical' => {
    const avgValue = metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length;
    if (avgValue > 85) return 'normal';
    if (avgValue > 70) return 'warning';
    return 'critical';
  };

  const getHealthColor = (health: string): string => {
    switch (health) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Fish className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">System Health Monitor</h2>
        </div>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-4 py-2 rounded-lg ${isSimulating ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          aria-label={isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        >
          {isSimulating ? 'Stop' : 'Start'} Monitoring
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {systemState.metrics.map(metric => (
          <div
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`p-4 rounded-lg ${
              selectedMetric === metric.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white'
            } cursor-pointer transition-all duration-300 hover:shadow-md`}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="font-medium">{metric.name}</span>
              </div>
              <span className="text-lg font-bold">
                {metric.value.toFixed(1)}{metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
        <div className="flex items-center gap-2">
          <Heart className={`w-6 h-6 ${getHealthColor(systemState.health)}`} />
          <span className="font-medium">System Health:</span>
          <span className={`font-bold ${getHealthColor(systemState.health)}`}>
            {systemState.health.toUpperCase()}
          </span>
        </div>
        {systemState.health !== 'normal' && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <span className="text-sm">Attention required</span>
          </div>
        )}
      </div>
    </div>
  );
}