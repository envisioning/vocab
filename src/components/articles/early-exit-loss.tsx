"use client"
import { useState, useEffect } from "react";
import { Train, Box, ArrowRight, Gauge, Award, Clock } from "lucide-react";

interface Station {
    id: number;
    name: string;
    threshold: number;
    accuracy: number;
}

interface Packet {
    id: number;
    confidence: number;
    position: number;
    exited: boolean;
}

interface ComponentProps {}

const INITIAL_STATIONS: Station[] = [
    { id: 1, name: "Basic", threshold: 0.7, accuracy: 0.8 },
    { id: 2, name: "Advanced", threshold: 0.8, accuracy: 0.9 },
    { id: 3, name: "Expert", threshold: 0.9, accuracy: 0.95 }
];

const EarlyExitLearning: React.FC<ComponentProps> = () => {
    const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
    const [packets, setPackets] = useState<Packet[]>([]);
    const [isRunning, setIsRunning] = useState<boolean>(true);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setPackets(prev => {
                    const newPackets = [...prev];
                    
                    // Add new packet
                    if (newPackets.length < 5) {
                        newPackets.push({
                            id: Date.now(),
                            confidence: Math.random(),
                            position: 0,
                            exited: false
                        });
                    }

                    // Move packets
                    return newPackets.map(packet => {
                        if (packet.exited) return packet;
                        const currentStation = stations[packet.position];
                        
                        if (packet.confidence >= currentStation.threshold) {
                            return { ...packet, exited: true };
                        }
                        
                        return {
                            ...packet,
                            position: Math.min(packet.position + 1, stations.length - 1)
                        };
                    });
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, stations]);

    const handleThresholdChange = (stationId: number, value: number) => {
        setStations(prev =>
            prev.map(station =>
                station.id === stationId
                    ? { ...station, threshold: value }
                    : station
            )
        );
    };

    const calculateEfficiency = (): number => {
        const exitedPackets = packets.filter(p => p.exited);
        if (exitedPackets.length === 0) return 0;
        
        const averagePosition = exitedPackets.reduce((acc, p) => acc + p.position, 0) / exitedPackets.length;
        return 100 * (1 - averagePosition / stations.length);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Early Exit Learning Station</h1>
            
            <div className="flex space-x-4 mb-8">
                {stations.map((station, index) => (
                    <div key={station.id} className="flex-1 p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center mb-2">
                            <Train className="w-6 h-6 text-blue-500 mr-2" />
                            <span className="font-semibold">{station.name}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={station.threshold}
                            onChange={(e) => handleThresholdChange(station.id, parseFloat(e.target.value))}
                            className="w-full"
                            aria-label={`${station.name} confidence threshold`}
                        />
                        <div className="text-sm text-gray-600">
                            Threshold: {station.threshold.toFixed(1)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative h-32 bg-gray-100 rounded-lg mb-6">
                {packets.map(packet => (
                    <div
                        key={packet.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-500
                            ${packet.exited ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{
                            left: `${(packet.position / (stations.length - 1)) * 100}%`,
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%'
                        }}
                        aria-label={`Data packet ${packet.id}`}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Gauge className="w-6 h-6 text-blue-500" />
                    <span>Efficiency: {calculateEfficiency().toFixed(1)}%</span>
                </div>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
            </div>
        </div>
    );
};

export default EarlyExitLearning;