"use client"
import { useState, useEffect } from "react"
import { Tree, Brain, Lightbulb, Sparkles, GitBranch, Info, Binary } from "lucide-react"

interface ThoughtNode {
    id: string
    content: string
    explanation: string
    children: ThoughtNode[]
    isActive: boolean
}

const INITIAL_THOUGHTS: ThoughtNode[] = [
    {
        id: "root",
        content: "Tree of Thought Process",
        explanation: "A structured way of breaking down complex problems into smaller, manageable decisions",
        isActive: false,
        children: [
            {
                id: "explore",
                content: "1. Generate Ideas",
                explanation: "Branch out multiple possible solutions or approaches",
                isActive: false,
                children: [
                    {
                        id: "explore-1",
                        content: "Consider Different Angles",
                        explanation: "Look at the problem from various perspectives",
                        isActive: false,
                        children: []
                    },
                    {
                        id: "explore-2",
                        content: "Brainstorm Solutions",
                        explanation: "Generate multiple potential solutions",
                        isActive: false,
                        children: []
                    }
                ]
            },
            {
                id: "evaluate",
                content: "2. Evaluate Paths",
                explanation: "Assess each branch's potential outcomes",
                isActive: false,
                children: [
                    {
                        id: "evaluate-1",
                        content: "Analyze Consequences",
                        explanation: "Consider the impact of each choice",
                        isActive: false,
                        children: []
                    },
                    {
                        id: "evaluate-2",
                        content: "Rate Effectiveness",
                        explanation: "Score each solution's potential success",
                        isActive: false,
                        children: []
                    }
                ]
            }
        ]
    }
]

export default function TreeOfThought() {
    const [thoughts, setThoughts] = useState<ThoughtNode[]>(INITIAL_THOUGHTS)
    const [currentStep, setCurrentStep] = useState(0)
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [isThinking, setIsThinking] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentStep < 5) {
                setCurrentStep(prev => prev + 1)
                setIsThinking(true)
                activateNodes(currentStep)
            }
        }, 2500)

        return () => clearInterval(interval)
    }, [currentStep])

    const activateNodes = (step: number) => {
        const newThoughts = JSON.parse(JSON.stringify(thoughts))
        const activateNode = (nodes: ThoughtNode[], depth: number) => {
            nodes.forEach(node => {
                if (depth === step) node.isActive = true
                activateNode(node.children, depth + 1)
            })
        }
        activateNode(newThoughts, 0)
        setThoughts(newThoughts)
    }

    const renderNode = (node: ThoughtNode, depth: number) => (
        <div
            key={node.id}
            className="relative"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
        >
            <div className={`
                transition-all duration-500 
                ${node.isActive ? 'opacity-100' : 'opacity-40'}
                ${depth === 0 ? 'ml-0' : 'ml-8 md:ml-12'}
            `}>
                <div className={`
                    group flex items-center gap-3 p-4 rounded-xl
                    ${node.isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-700'}
                    transform transition-all duration-300 hover:scale-105
                    border-2 border-transparent hover:border-blue-400
                    cursor-pointer relative
                `}>
                    {depth === 0 ? <Brain className="w-6 h-6 text-white"/> : 
                     depth === 1 ? <Lightbulb className="w-6 h-6 text-white"/> :
                     <Sparkles className="w-6 h-6 text-white"/>}
                    <span className="text-white font-medium">{node.content}</span>
                    <Info className="w-5 h-5 text-white opacity-50 group-hover:opacity-100 transition-opacity"/>
                </div>

                {hoveredNode === node.id && (
                    <div className="absolute left-full top-0 ml-4 p-4 bg-gray-800 rounded-lg shadow-xl z-10 w-64
                                  transform transition-all duration-300 border border-blue-400">
                        <p className="text-sm text-gray-200">{node.explanation}</p>
                    </div>
                )}

                {node.children.length > 0 && (
                    <div className="mt-4 border-l-2 border-blue-400/30 pl-4 space-y-4">
                        {node.children.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-900 min-h-screen">
            <div className="flex items-center gap-4 mb-8 bg-gray-800 p-6 rounded-xl">
                <GitBranch className="w-8 h-8 text-blue-400"/>
                <div>
                    <h1 className="text-2xl font-bold text-white">Tree of Thought</h1>
                    <p className="text-gray-400 text-sm mt-1">A cognitive framework for structured decision-making</p>
                </div>
            </div>
            
            <div className="relative">
                <div className={`
                    absolute top-0 left-0 w-full h-full
                    flex items-center justify-center
                    ${isThinking ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-300
                `}>
                    <Binary className="w-8 h-8 text-blue-400 animate-spin"/>
                </div>
                
                <div className="space-y-6">
                    {thoughts.map(thought => renderNode(thought, 0))}
                </div>
            </div>
        </div>
    )
}