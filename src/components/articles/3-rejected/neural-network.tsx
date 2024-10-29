"use client"
import { useState, useEffect } from "react";
import { Users, ArrowRight, Brain, Smile, Frown, Share2, Settings2 } from "lucide-react";

interface NetworkNode {
    id: string;
    type: 'input' | 'hidden' | 'output';
    position: { x: number; y: number };
    value: number;
}

interface Connection {
    from: string;
    to: string;
    weight: number;
}

interface NeuralNetworkProps {}

const INITIAL_NODES: NetworkNode[] = [
    { id: 'i1', type: 'input', position: { x: 50, y: 100 }, value: 0 },
    { id: 'i2', type: 'input', position: { x: 50, y: 200 }, value: 0 },
    { id: 'h1', type: 'hidden', position: { x: 200, y: 150 }, value: 0 },
    { id: 'o1', type: 'output', position: { x: 350, y: 150 }, value: 0 },
];

const INITIAL_CONNECTIONS: Connection[] = [
    { from: 'i1', to: 'h1', weight: 0.5 },
    { from: 'i2', to: 'h1', weight: 0.5 },
    { from: 'h1', to: 'o1', weight: 1 },
];

const NeuralNetwork: React.FC<NeuralNetworkProps> = () => {
    const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
    const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (step === 1) {
            const newNodes = nodes.map(node => ({
                ...node,
                value: node.type === 'input' ? Math.random() : node.value
            }));
            setNodes(newNodes);
        } else if (step === 2) {
            propagateValues();
        }
    }, [step]);

    const propagateValues = () => {
        const newNodes = [...nodes];
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = newNodes.find(n => n.id === conn.to);
            if (fromNode && toNode) {
                toNode.value = fromNode.value * conn.weight;
            }
        });
        setNodes(newNodes);
    };

    return (
        <div className="relative w-full h-[500px] bg-gray-100 rounded-lg p-4">
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg font-semibold">Neural Network Simulator</h2>
            </div>

            <div className="relative mt-12">
                {connections.map((conn, i) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <svg key={i} className="absolute top-0 left-0 w-full h-full">
                            <line
                                x1={fromNode.position.x}
                                y1={fromNode.position.y}
                                x2={toNode.position.x}
                                y2={toNode.position.y}
                                className="stroke-gray-400 stroke-2"
                            />
                        </svg>
                    );
                })}

                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center
                            ${node.type === 'input' ? 'bg-blue-500' : 
                            node.type === 'hidden' ? 'bg-gray-500' : 'bg-green-500'}
                            ${node.value > 0.5 ? 'ring-2 ring-blue-300' : ''}`}
                        style={{
                            left: node.position.x,
                            top: node.position.y,
                            transform: 'translate(-50%, -50%)',
                            transition: 'all duration-300'
                        }}
                    >
                        {node.type === 'output' ? 
                            (node.value > 0.5 ? <Smile className="w-6 h-6 text-white" /> : 
                                              <Frown className="w-6 h-6 text-white" />) :
                            <Users className="w-6 h-6 text-white" />
                        }
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-4">
                <button
                    onClick={() => setStep(0)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    aria-label="Reset simulation"
                >
                    <Settings2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default NeuralNetwork;