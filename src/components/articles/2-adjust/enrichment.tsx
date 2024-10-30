"use client"
import { useState, useEffect } from "react";
import { User, ShoppingBag, Globe, Users, Smartphone, Brain } from "lucide-react";

interface EnrichmentSource {
    id: string;
    name: string;
    icon: JSX.Element;
    insights: string[];
}

interface DragItem {
    id: string;
    position: { x: number; y: number };
}

interface ProfileState {
    enrichments: string[];
    insights: string[];
    score: number;
}

const ENRICHMENT_SOURCES: EnrichmentSource[] = [
    {
        id: "purchase",
        name: "Purchase History",
        icon: <ShoppingBag className="w-6 h-6" />,
        insights: ["Prefers eco-friendly products", "Monthly budget: $200-300", "Shops mostly online"]
    },
    {
        id: "location",
        name: "Location Data",
        icon: <Globe className="w-6 h-6" />,
        insights: ["Commutes 5 miles daily", "Frequents coffee shops", "Lives in urban area"]
    },
    {
        id: "social",
        name: "Social Connections",
        icon: <Users className="w-6 h-6" />,
        insights: ["Connected to 150+ peers", "Active in tech groups", "High engagement rate"]
    },
    {
        id: "device",
        name: "Device Usage",
        icon: <Smartphone className="w-6 h-6" />,
        insights: ["6h daily screen time", "Uses iOS devices", "Active 8AM-11PM"]
    }
];

export default function EnrichmentLearning() {
    const [draggingItem, setDraggingItem] = useState<string | null>(null);
    const [profile, setProfile] = useState<ProfileState>({
        enrichments: [],
        insights: [],
        score: 0
    });
    const [prediction, setPrediction] = useState<string>("");

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setDraggingItem(null);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    const handleDragStart = (sourceId: string) => {
        setDraggingItem(sourceId);
    };

    const handleDrop = (sourceId: string) => {
        if (!profile.enrichments.includes(sourceId)) {
            const source = ENRICHMENT_SOURCES.find(s => s.id === sourceId);
            if (source) {
                setProfile(prev => ({
                    ...prev,
                    enrichments: [...prev.enrichments, sourceId],
                    insights: [...prev.insights, ...source.insights],
                    score: prev.score + (prediction ? 10 : 5)
                }));
            }
        }
        setDraggingItem(null);
        setPrediction("");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex gap-6">
                <div className="w-1/2 space-y-4">
                    <div className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-8 h-8 text-blue-500" />
                            <h2 className="text-xl font-bold">Basic Profile</h2>
                        </div>
                        <div className="space-y-2 text-gray-600">
                            <p>Name: Alex Chen</p>
                            <p>Age: 25</p>
                            <p>Location: San Francisco</p>
                        </div>
                        {profile.insights.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded">
                                <h3 className="font-semibold mb-2">Enriched Insights:</h3>
                                <ul className="list-disc pl-4 space-y-1">
                                    {profile.insights.map((insight, idx) => (
                                        <li key={idx} className="text-sm text-gray-600">{insight}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-semibold">Score: {profile.score}</span>
                    </div>
                </div>

                <div className="w-1/2 space-y-4">
                    <h3 className="font-semibold mb-2">Available Enrichment Sources</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {ENRICHMENT_SOURCES.map(source => (
                            <div
                                key={source.id}
                                draggable={!profile.enrichments.includes(source.id)}
                                onDragStart={() => handleDragStart(source.id)}
                                onDragEnd={() => handleDrop(source.id)}
                                className={`p-3 rounded-lg flex items-center gap-2 cursor-grab
                                    ${profile.enrichments.includes(source.id) 
                                        ? 'bg-gray-200 opacity-50 cursor-not-allowed' 
                                        : 'bg-white shadow-sm hover:shadow-md transition-shadow duration-300'}`}
                                aria-label={`Drag ${source.name} to enrich profile`}
                                role="button"
                                tabIndex={0}
                            >
                                {source.icon}
                                <span>{source.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Predict what insights this source might add..."
                            value={prediction}
                            onChange={(e) => setPrediction(e.target.value)}
                            aria-label="Prediction input"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}