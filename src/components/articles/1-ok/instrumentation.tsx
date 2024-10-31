"use client"
import { useState, useEffect } from 'react'
import {
    Activity,
    Brain,
    CircleDot,
    Gauge,
    LineChart,
    AlertCircle,
    CheckCircle2,
    Zap
} from 'lucide-react'

interface MetricType {
    name: string
    value: number
    status: 'normal' | 'warning' | 'critical'
    icon: React.ReactNode
}

const AIInstrumentationMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricType[]>([
        {
            name: 'Model Accuracy',
            value: 95,
            status: 'normal',
            icon: <Brain className="w-6 h-6" />
        },
        {
            name: 'Response Time',
            value: 150,
            status: 'normal',
            icon: <Zap className="w-6 h-6" />
        },
        {
            name: 'Memory Usage',
            value: 65,
            status: 'warning',
            icon: <CircleDot className="w-6 h-6" />
        },
        {
            name: 'Error Rate',
            value: 2,
            status: 'normal',
            icon: <AlertCircle className="w-6 h-6" />
        }
    ])

    const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null)
    const [isMonitoring, setIsMonitoring] = useState(false)

    useEffect(() => {
        if (!isMonitoring) return

        const interval = setInterval(() => {
            setMetrics(prevMetrics =>
                prevMetrics.map(metric => ({
                    ...metric,
                    value: simulateMetricChange(metric.value, metric.name),
                    status: getMetricStatus(simulateMetricChange(metric.value, metric.name), metric.name)
                }))
            )
        }, 2000)

        return () => clearInterval(interval)
    }, [isMonitoring])

    const simulateMetricChange = (currentValue: number, metricName: string): number => {
        const random = Math.random() * 10 - 5
        let newValue = currentValue + random

        switch (metricName) {
            case 'Model Accuracy':
                return Math.min(Math.max(newValue, 80), 100)
            case 'Response Time':
                return Math.min(Math.max(newValue, 100), 300)
            case 'Memory Usage':
                return Math.min(Math.max(newValue, 40), 100)
            case 'Error Rate':
                return Math.min(Math.max(newValue, 0), 10)
            default:
                return newValue
        }
    }

    const getMetricStatus = (value: number, metricName: string): 'normal' | 'warning' | 'critical' => {
        switch (metricName) {
            case 'Model Accuracy':
                return value < 85 ? 'critical' : value < 90 ? 'warning' : 'normal'
            case 'Response Time':
                return value > 250 ? 'critical' : value > 200 ? 'warning' : 'normal'
            case 'Memory Usage':
                return value > 80 ? 'critical' : value > 60 ? 'warning' : 'normal'
            case 'Error Rate':
                return value > 5 ? 'critical' : value > 3 ? 'warning' : 'normal'
            default:
                return 'normal'
        }
    }

    const getStatusColor = (status: 'normal' | 'warning' | 'critical'): string => {
        switch (status) {
            case 'normal':
                return 'bg-green-500'
            case 'warning':
                return 'bg-yellow-500'
            case 'critical':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="w-8 h-8 text-blue-500" />
                    AI Health Monitor
                </h2>
                <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedMetric(metric)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedMetric?.name === metric.name ? 'ring-2 ring-blue-500' : ''
                            } bg-gray-50`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-gray-600">{metric.icon}</div>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(metric.status)}`} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">{metric.name}</div>
                        <div className="text-2xl font-bold">
                            {metric.value.toFixed(1)}
                            {metric.name === 'Model Accuracy' && '%'}
                            {metric.name === 'Response Time' && 'ms'}
                            {metric.name === 'Memory Usage' && '%'}
                            {metric.name === 'Error Rate' && '%'}
                        </div>
                    </div>
                ))}
            </div>

            {selectedMetric && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-blue-500" />
                        Detailed Analysis: {selectedMetric.name}
                    </h3>
                    <div className="flex items-center gap-4">
                        <LineChart className="w-6 h-6 text-gray-600" />
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getStatusColor(selectedMetric.status)} transition-all duration-500`}
                                style={{ width: `${selectedMetric.value}%` }}
                            />
                        </div>
                        {selectedMetric.status === 'normal' && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        )}
                        {selectedMetric.status === 'warning' && (
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                        )}
                        {selectedMetric.status === 'critical' && (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AIInstrumentationMonitor