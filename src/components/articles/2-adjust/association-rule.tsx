"use client"
import { useState, useEffect } from "react";
import { ShoppingBasket, Pizza, Coffee, Cookie, Beer, Sandwich, ArrowRight, RefreshCw } from "lucide-react";

interface Item {
    id: string;
    name: string;
    icon: JSX.Element;
}

interface Association {
    if: string[];
    then: string;
    confidence: number;
    support: number;
}

const STORE_ITEMS: Item[] = [
    { id: "pizza", name: "Pizza", icon: <Pizza /> },
    { id: "coffee", name: "Coffee", icon: <Coffee /> },
    { id: "cookie", name: "Cookie", icon: <Cookie /> },
    { id: "beer", name: "Soda", icon: <Beer /> },
    { id: "sandwich", name: "Sandwich", icon: <Sandwich /> }
];

const ASSOCIATIONS: Association[] = [
    { if: ["pizza"], then: "soda", confidence: 85, support: 40 },
    { if: ["coffee"], then: "cookie", confidence: 75, support: 35 },
    { if: ["sandwich"], then: "soda", confidence: 65, support: 30 },
    { if: ["pizza", "sandwich"], then: "soda", confidence: 95, support: 45 }
];

export default function AssociationRuleLearner() {
    const [basket, setBasket] = useState<string[]>([]);
    const [predictions, setPredictions] = useState<Association[]>([]);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    useEffect(() => {
        const matchingRules = ASSOCIATIONS.filter(rule =>
            rule.if.every(item => basket.includes(item))
        );
        setPredictions(matchingRules);
    }, [basket]);

    const handleDragStart = (id: string) => {
        setDraggedItem(id);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedItem && !basket.includes(draggedItem)) {
            setBasket([...basket, draggedItem]);
        }
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const resetBasket = () => {
        setBasket([]);
        setPredictions([]);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                The Shopping Cart Detective
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Store Items</h2>
                    <div className="flex flex-wrap gap-4">
                        {STORE_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(item.id)}
                                className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg cursor-move hover:bg-blue-100 transition-colors duration-300"
                                role="button"
                                tabIndex={0}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="bg-white p-4 rounded-lg shadow min-h-[200px]"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    role="region"
                    aria-label="Shopping Basket"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ShoppingBasket />
                            Your Basket
                        </h2>
                        <button
                            onClick={resetBasket}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                            aria-label="Reset basket"
                        >
                            <RefreshCw />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {basket.map((itemId) => (
                            <div
                                key={itemId}
                                className="flex items-center gap-2 p-2 bg-blue-100 rounded"
                            >
                                {STORE_ITEMS.find(item => item.id === itemId)?.icon}
                                {STORE_ITEMS.find(item => item.id === itemId)?.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {predictions.length > 0 && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Predictions</h2>
                    <div className="space-y-4">
                        {predictions.map((prediction, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {prediction.if.join(" + ")}
                                    <ArrowRight className="text-blue-500" />
                                    {prediction.then}
                                </div>
                                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${prediction.confidence}%` }}
                                        role="progressbar"
                                        aria-valuenow={prediction.confidence}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                                <span className="min-w-[4rem]">{prediction.confidence}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}