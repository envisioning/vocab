"use client"
import { useState, useEffect } from "react";
import { Chef, Utensils, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface Order {
    description: string;
    expectedItems: string[];
    receivedItems: string[];
}

interface Scenario {
    id: number;
    target: string;
    hints: string[];
    requirements: string[];
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        target: "Cheeseburger",
        hints: ["Be specific about main item", "What type of burger?"],
        requirements: ["meat", "cheese"]
    },
    {
        id: 2,
        target: "Well-done beef burger with cheddar and lettuce",
        hints: ["Specify cooking preference", "List toppings"],
        requirements: ["cooking_style", "meat", "cheese_type", "vegetables"]
    },
    {
        id: 3,
        target: "Gluten-free chicken burger with dairy-free cheese, no onions",
        hints: ["Mention dietary restrictions", "Specify exclusions"],
        requirements: ["dietary", "meat_type", "allergens", "exclusions"]
    }
];

const AIRestaurant = () => {
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [order, setOrder] = useState<Order>({
        description: "",
        expectedItems: [],
        receivedItems: []
    });
    const [score, setScore] = useState<number>(0);

    const analyzePrompt = (prompt: string): string[] => {
        const keywords = prompt.toLowerCase().split(" ");
        return SCENARIOS[currentScenario].requirements.filter(req =>
            keywords.some(word => word.includes(req))
        );
    };

    const handleSubmitPrompt = (e: React.FormEvent) => {
        e.preventDefault();
        const receivedItems = analyzePrompt(userPrompt);
        setOrder({
            description: userPrompt,
            expectedItems: SCENARIOS[currentScenario].requirements,
            receivedItems
        });
        setScore((receivedItems.length / SCENARIOS[currentScenario].requirements.length) * 100);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (score === 100) {
                if (currentScenario < SCENARIOS.length - 1) {
                    setCurrentScenario(prev => prev + 1);
                    setUserPrompt("");
                    setScore(0);
                }
            }
        }, 2000);

        return () => clearInterval(timer);
    }, [score, currentScenario]);

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
                <Chef className="w-8 h-8 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold">AI Restaurant</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Your Order</h2>
                    <form onSubmit={handleSubmitPrompt}>
                        <textarea
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Place your order here..."
                            aria-label="Order input"
                        />
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            <Utensils className="inline-block mr-2 w-4 h-4" />
                            Place Order
                        </button>
                    </form>
                </div>

                <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">AI Waiter's Understanding</h2>
                    <div className="space-y-2">
                        {order.receivedItems.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span>{item}</span>
                            </div>
                        ))}
                        {order.expectedItems.filter(item => !order.receivedItems.includes(item)).map((item, index) => (
                            <div key={index} className="flex items-center">
                                <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center mb-2">
                            <AlertCircle className="w-4 h-4 text-blue-500 mr-2" />
                            <span>Prompt Success: {score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Hints:</h3>
                <ul className="list-disc list-inside">
                    {SCENARIOS[currentScenario].hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AIRestaurant;