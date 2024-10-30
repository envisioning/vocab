"use client"
import { useState, useEffect } from "react";
import { Music, Users, Pizza, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import React from "react";

interface ContrastiveItem {
    id: number;
    type: string;
    x: number;
    y: number;
    isPositive: boolean;
}

interface ComponentProps { }

/**
 * ContrastiveLearningPlayground - Interactive component teaching contrastive learning
 * through visual metaphors and drag-and-drop interactions.
 */
const ContrastiveLearningPlayground: React.FC<ComponentProps> = () => {
    const [items, setItems] = useState<ContrastiveItem[]>([]);
    const [activeMetaphor, setActiveMetaphor] = useState<string>("twins");
    const [score, setScore] = useState<number>(0);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const metaphors = {
        twins: { icon: Users, title: "Twin Recognition" },
        music: { icon: Music, title: "Music Genre Sorter" },
        food: { icon: Pizza, title: "Food Taste Profile" }
    };

    useEffect(() => {
        generateItems();
        return () => setItems([]);
    }, [activeMetaphor]);

    const generateItems = () => {
        const newItems: ContrastiveItem[] = [];
        for (let i = 0; i < 6; i++) {
            newItems.push({
                id: i,
                type: activeMetaphor,
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                isPositive: i % 2 === 0
            });
        }
        setItems(newItems);
    };

    const handleDragStart = (id: number) => {
        setDraggedItem(id);
    };

    const handleDrag = (e: React.DragEvent, id: number) => {
        if (draggedItem === null) {
            return;
        }

        const container = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - container.left) / container.width) * 100;
        const y = ((e.clientY - container.top) / container.height) * 100;

        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, x, y } : item
        ));
    };

    const calculateScore = () => {
        let newScore = 0;
        items.forEach((item1) => {
            items.forEach((item2) => {
                if (item1.id !== item2.id) {
                    const distance = Math.sqrt(
                        Math.pow(item1.x - item2.x, 2) + Math.pow(item1.y - item2.y, 2)
                    );
                    if (item1.isPositive === item2.isPositive && distance < 20) {
                        newScore += 1;
                    }
                    if (item1.isPositive !== item2.isPositive && distance > 50) {
                        newScore += 1;
                    }
                }
            });
        });
        setScore(newScore);
    };

    useEffect(() => {
        calculateScore();
    }, [items]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setActiveMetaphor("twins")}
                    className={`p-2 rounded ${activeMetaphor === "twins" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    aria-label="Switch to Twin Recognition metaphor"
                >
                    <Users className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setActiveMetaphor("music")}
                    className={`p-2 rounded ${activeMetaphor === "music" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    aria-label="Switch to Music Genre metaphor"
                >
                    <Music className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setActiveMetaphor("food")}
                    className={`p-2 rounded ${activeMetaphor === "food" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    aria-label="Switch to Food Taste metaphor"
                >
                    <Pizza className="w-6 h-6" />
                </button>
            </div>

            <div className="relative h-96 bg-white border-2 border-gray-200 rounded-lg mb-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        onDrag={(e) => handleDrag(e, item.id)}
                        className={`absolute w-12 h-12 cursor-move rounded-full flex items-center justify-center
                            ${item.isPositive ? "bg-green-100" : "bg-gray-100"}
                            transition-all duration-300`}
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                        role="button"
                        aria-label={`Draggable ${item.type} item`}
                    >
                        {React.createElement(metaphors[item.type as keyof typeof metaphors].icon, {
                            className: "w-6 h-6"
                        })}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Score: {score}</div>
                <button
                    onClick={generateItems}
                    className="p-2 rounded bg-blue-500 text-white"
                    aria-label="Reset items"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ContrastiveLearningPlayground;