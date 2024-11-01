"use client"
import { useState, useEffect } from "react"
import { Tree, CircleDot, ArrowRight, Check, X, HelpCircle, Info, RefreshCw } from "lucide-react"

interface DecisionTreeNode {
    question: string
    explanation: string
    yesPath?: DecisionTreeNode
    noPath?: DecisionTreeNode
    result?: string
    resultExplanation?: string
}

const TREE_DATA: DecisionTreeNode = {
    question: "Is the problem numerical?",
    explanation: "Numerical problems involve numbers, quantities, or measurements that can be calculated",
    yesPath: {
        question: "Do you have labeled training data?",
        explanation: "Labeled data means you have historical examples with known correct answers",
        yesPath: {
            result: "Use Regression! 📊",
            resultExplanation: "Regression predicts continuous numerical values based on patterns in your training data"
        },
        noPath: {
            question: "Is grouping important?",
            explanation: "Grouping means organizing data points into clusters based on similarities",
            yesPath: {
                result: "Try Clustering! 🎯",
                resultExplanation: "Clustering algorithms find natural groups in your data without needing labels"
            },
            noPath: {
                result: "Consider Dimensionality Reduction! 🔍",
                resultExplanation: "This technique simplifies complex numerical data while preserving important patterns"
            }
        }
    },
    noPath: {
        question: "Is it a classification task?",
        explanation: "Classification involves categorizing data into distinct classes or categories",
        yesPath: {
            result: "Use Classification Trees! 🌳",
            resultExplanation: "Decision trees for classification help make categorical predictions step by step"
        },
        noPath: {
            result: "Consider Association Rules! 🔗",
            resultExplanation: "This helps discover relationships and patterns in categorical data"
        }
    }
}

export default function DecisionTreeVisualizer() {
    const [currentNode, setCurrentNode] = useState<DecisionTreeNode>(TREE_DATA)
    const [path, setPath] = useState<string[]>([])
    const [isAnimating, setIsAnimating] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [showReset, setShowReset] = useState(false)

    useEffect(() => {
        const tooltipTimer = setTimeout(() => {
            setShowTooltip(false)
        }, 3000)
        return () => clearTimeout(tooltipTimer)
    }, [showTooltip])

    const handleDecision = (choice: 'yes' | 'no') => {
        setIsAnimating(true)
        const nextNode = choice === 'yes' ? currentNode.yesPath : currentNode.noPath
        setPath([...path, choice])
        
        setTimeout(() => {
            if (nextNode) {
                setCurrentNode(nextNode)
                setIsAnimating(false)
                if (nextNode.result) {
                    setShowReset(true)
                }
            }
        }, 400)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                        <Tree className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                            ML Algorithm Finder
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                        Find the right machine learning algorithm for your problem
                    </p>
                </header>

                <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-lg backdrop-filter transform transition-all duration-400 ${isAnimating ? 'scale-98 opacity-90' : 'scale-100 opacity-100'}`}>
                    {currentNode.result ? (
                        <div className="space-y-6 text-center">
                            <CircleDot className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {currentNode.result}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                    {currentNode.resultExplanation}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentNode(TREE_DATA)
                                    setPath([])
                                    setShowReset(false)
                                }}
                                className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Start Over</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="flex items-center justify-center space-x-3">
                                    <HelpCircle className="w-8 h-8 text-blue-500" />
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {currentNode.question}
                                    </h2>
                                    <button
                                        onClick={() => setShowTooltip(!showTooltip)}
                                        className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                                    >
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                                {showTooltip && (
                                    <div className="absolute top-full mt-2 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-xl z-10 max-w-xs">
                                        {currentNode.explanation}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => handleDecision('yes')}
                                    className="flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Yes
                                </button>
                                <button
                                    onClick={() => handleDecision('no')}
                                    className="flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    No
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {path.map((decision, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${
                                decision === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {decision}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}