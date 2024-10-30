"use client"
import { useState, useEffect } from "react";
import { Cookie, Settings, RefreshCw, Check, X } from "lucide-react";

interface Cookie {
    id: number;
    size: number;
    roundness: number;
}

interface ComponentProps {}

const CookieFactory: React.FC<ComponentProps> = () => {
    const [cookies, setCookies] = useState<Cookie[]>([]);
    const [sizeThreshold, setSizeThreshold] = useState<number>(50);
    const [roundnessThreshold, setRoundnessThreshold] = useState<number>(50);
    const [accepted, setAccepted] = useState<number>(0);
    const [rejected, setRejected] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isRunning) {
            intervalId = setInterval(() => {
                const newCookie: Cookie = {
                    id: Date.now(),
                    size: Math.random() * 100,
                    roundness: Math.random() * 100,
                };

                setCookies(prev => [...prev, newCookie]);

                if (newCookie.size >= sizeThreshold && newCookie.roundness >= roundnessThreshold) {
                    setAccepted(prev => prev + 1);
                } else {
                    setRejected(prev => prev + 1);
                }

                setCookies(prev => prev.slice(-5));
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning, sizeThreshold, roundnessThreshold]);

    const handleReset = () => {
        setCookies([]);
        setAccepted(0);
        setRejected(0);
    };

    const getEfficiencyRate = () => {
        const total = accepted + rejected;
        return total ? Math.round((accepted / total) * 100) : 0;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Cookie Quality Control</h1>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
                    aria-label={isRunning ? "Pause production" : "Start production"}
                >
                    <RefreshCw className={`w-6 h-6 ${isRunning ? "animate-spin" : ""}`} />
                </button>
            </div>

            <div className="mb-6 space-y-4">
                <div>
                    <label className="flex items-center mb-2">
                        <Settings className="w-4 h-4 mr-2" />
                        Size Threshold: {sizeThreshold}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sizeThreshold}
                        onChange={(e) => setSizeThreshold(Number(e.target.value))}
                        className="w-full"
                        aria-label="Size threshold"
                    />
                </div>
                <div>
                    <label className="flex items-center mb-2">
                        <Settings className="w-4 h-4 mr-2" />
                        Roundness Threshold: {roundnessThreshold}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={roundnessThreshold}
                        onChange={(e) => setRoundnessThreshold(Number(e.target.value))}
                        className="w-full"
                        aria-label="Roundness threshold"
                    />
                </div>
            </div>

            <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 flex items-center">
                    {cookies.map((cookie, index) => (
                        <div
                            key={cookie.id}
                            className="absolute transition-all duration-500"
                            style={{ left: `${index * 20}%` }}
                        >
                            <Cookie 
                                className={`w-8 h-8 ${
                                    cookie.size >= sizeThreshold && cookie.roundness >= roundnessThreshold
                                        ? "text-green-500"
                                        : "text-red-500"
                                }`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-green-100 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-green-700">{accepted}</span>
                    </div>
                    <span className="text-sm text-green-600">Accepted</span>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-red-700">{rejected}</span>
                    </div>
                    <span className="text-sm text-red-600">Rejected</span>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                    <div className="font-bold text-blue-700">{getEfficiencyRate()}%</div>
                    <span className="text-sm text-blue-600">Efficiency</span>
                </div>
            </div>

            <button
                onClick={handleReset}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300"
                aria-label="Reset statistics"
            >
                Reset
            </button>
        </div>
    );
};

export default CookieFactory;