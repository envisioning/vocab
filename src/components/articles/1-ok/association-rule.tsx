"use client"
import { useState, useEffect } from "react";
import { ShoppingBasket, Pizza, Coffee, Cookie, Beer, Sandwich, ArrowRight, RefreshCw, AlertCircle, Plus, ArrowLeft } from "lucide-react";

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

const INITIAL_STORE_ITEMS: Item[] = [
    { id: "pizza", name: "Pizza", icon: <Pizza /> },
    { id: "coffee", name: "Coffee", icon: <Coffee /> },
    { id: "cookie", name: "Cookie", icon: <Cookie /> },
    { id: "soda", name: "Soda", icon: <Beer /> },
    { id: "sandwich", name: "Sandwich", icon: <Sandwich /> }
];

const ASSOCIATIONS: Association[] = [
    { if: ["pizza"], then: "soda", confidence: 85, support: 40 },
    { if: ["coffee"], then: "cookie", confidence: 75, support: 35 },
    { if: ["sandwich"], then: "soda", confidence: 65, support: 30 },
    { if: ["pizza", "sandwich"], then: "soda", confidence: 95, support: 45 },
    { if: ["cookie"], then: "coffee", confidence: 70, support: 30 },
    { if: ["soda"], then: "pizza", confidence: 60, support: 25 }
];

export default function AssociationRuleLearner() {
    const [storeItems, setStoreItems] = useState<Item[]>(INITIAL_STORE_ITEMS);
    const [basket, setBasket] = useState<Item[]>([]);
    const [predictions, setPredictions] = useState<Association[]>([]);
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        const basketIds = basket.map(item => item.id);
        const matchingRules = ASSOCIATIONS.filter(rule =>
            rule.if.every(item => basketIds.includes(item))
        );
        setPredictions(matchingRules);

        if (basketIds.length > 0 && matchingRules.length === 0) {
            setFeedback("Try adding different items! Some combinations reveal interesting patterns.");
        } else {
            setFeedback("");
        }

        return () => {
            setFeedback("");
        };
    }, [basket]);

    const addToBasket = (item: Item) => {
        setBasket([...basket, item]);
        setStoreItems(storeItems.filter(i => i.id !== item.id));
    };

    const removeFromBasket = (item: Item) => {
        setBasket(basket.filter(i => i.id !== item.id));
        setStoreItems([...storeItems, item]);
    };

    const resetBasket = () => {
        setStoreItems(INITIAL_STORE_ITEMS);
        setBasket([]);
        setPredictions([]);
        setFeedback("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    The Shopping Cart Detective
                </h1>
                <div className="text-xs sm:text-sm text-gray-600">
                    Discover shopping patterns!
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Store Items</h2>
                    <div className="flex flex-wrap gap-2 md:gap-4 min-h-[100px]">
                        {storeItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => addToBasket(item)}
                                className="flex items-center gap-2 p-2 md:p-3 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors duration-300 group text-sm md:text-base"
                                aria-label={`Add ${item.name} to basket`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                                <Plus className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        ))}
                    </div>
                    {storeItems.length === 0 && (
                        <p className="text-gray-500 text-center italic mt-4 text-sm md:text-base">
                            All items are in your basket!
                        </p>
                    )}
                </div>

                <div className="bg-white p-3 md:p-4 rounded-lg shadow min-h-[200px]">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                        <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
                            <ShoppingBasket className="w-4 h-4 md:w-5 md:h-5" />
                            Your Basket ({basket.length})
                        </h2>
                        <button
                            onClick={resetBasket}
                            className="p-1.5 md:p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                            aria-label="Reset basket"
                        >
                            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[100px]">
                        {basket.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => removeFromBasket(item)}
                                className="flex items-center gap-2 p-2 bg-blue-100 rounded group hover:bg-blue-200 transition-colors duration-300 text-sm md:text-base"
                                aria-label={`Remove ${item.name} from basket`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className="mt-3 md:mt-4 flex items-center gap-2 text-blue-600 text-xs md:text-sm">
                            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                            {feedback}
                        </div>
                    )}
                </div>
            </div>

            {predictions.length > 0 && (
                <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-lg shadow">
                    <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Discovered Patterns</h2>
                    <div className="space-y-4 md:space-y-6">
                        {predictions.map((prediction, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                                <div className="flex flex-wrap items-center gap-2 min-w-[180px]">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {prediction.if.map(itemId => {
                                            const item = INITIAL_STORE_ITEMS.find(i => i.id === itemId);
                                            return (
                                                <span key={itemId} className="flex items-center bg-gray-50 p-1 rounded text-sm md:text-base">
                                                    {item?.icon}
                                                    <span className="ml-1">{item?.name}</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <ArrowRight className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />
                                    <span className="flex items-center bg-gray-50 p-1 rounded text-sm md:text-base">
                                        {INITIAL_STORE_ITEMS.find(item => item.id === prediction.then)?.icon}
                                        <span className="ml-1">
                                            {INITIAL_STORE_ITEMS.find(item => item.id === prediction.then)?.name}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 flex-1">
                                    <div className="flex-1 h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{ width: `${prediction.confidence}%` }}
                                            role="progressbar"
                                            aria-valuenow={prediction.confidence}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                    <span className="min-w-[3rem] md:min-w-[4rem] text-right text-sm md:text-base">{prediction.confidence}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}