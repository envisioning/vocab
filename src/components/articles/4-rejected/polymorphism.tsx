"use client"
import { useState, useEffect } from "react";
import { Tv, Radio, Disc, Power, Volume2, Zap } from "lucide-react";

interface Device {
    id: string;
    name: string;
    icon: JSX.Element;
    powerState: boolean;
    animation: string;
}

interface ComponentProps {}

const DEVICES: Device[] = [
    {
        id: "tv",
        name: "Television",
        icon: <Tv className="w-12 h-12" />,
        powerState: false,
        animation: "opacity-transition"
    },
    {
        id: "sound",
        name: "Sound System",
        icon: <Volume2 className="w-12 h-12" />,
        powerState: false,
        animation: "scale-bounce"
    },
    {
        id: "dvd",
        name: "DVD Player",
        icon: <Disc className="w-12 h-12" />,
        powerState: false,
        animation: "rotate-spin"
    }
];

export default function PolymorphismLab({}: ComponentProps) {
    const [devices, setDevices] = useState<Device[]>(DEVICES);
    const [selectedDevice, setSelectedDevice] = useState<Device>(devices[0]);
    const [prediction, setPrediction] = useState<boolean>(false);

    const handlePower = () => {
        setDevices(prevDevices =>
            prevDevices.map(device =>
                device.id === selectedDevice.id
                    ? { ...device, powerState: !device.powerState }
                    : device
            )
        );
    };

    const handleDeviceSelect = (device: Device) => {
        setSelectedDevice(device);
        setPrediction(false);
    };

    useEffect(() => {
        const cleanup = () => {
            setDevices(DEVICES);
            setPrediction(false);
        };
        return cleanup;
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Universal Remote Laboratory</h1>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    {devices.map(device => (
                        <button
                            key={device.id}
                            onClick={() => handleDeviceSelect(device)}
                            className={`p-4 rounded-lg transition-all duration-300 ${
                                selectedDevice.id === device.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                            aria-pressed={selectedDevice.id === device.id}
                        >
                            <div className="flex flex-col items-center gap-2">
                                {device.icon}
                                <span>{device.name}</span>
                                <div
                                    className={`transition-all duration-300 ${
                                        device.powerState ? device.animation : ""
                                    }`}
                                >
                                    <Zap
                                        className={`w-6 h-6 ${
                                            device.powerState ? "text-green-500" : "text-gray-400"
                                        }`}
                                    />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="bg-gray-200 p-8 rounded-lg">
                        <button
                            onClick={handlePower}
                            className="p-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300"
                            aria-label="Power button"
                        >
                            <Power className="w-8 h-8 text-white" />
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setPrediction(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                            disabled={prediction}
                        >
                            Make Prediction
                        </button>
                        {prediction && (
                            <p className="mt-2 text-gray-600">
                                Press power to see how {selectedDevice.name} responds!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}