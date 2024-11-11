"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Brain, Sparkles, Puzzle, Lightbulb, Code, CheckCircle2, Telescope } from "lucide-react"

interface StepAccordionProps {
    title: string
    description: string
    isOpen: boolean
    onToggle: () => void
    icon: React.ReactNode
    color: string
    darkColor: string
}

/**
 * Cute interactive accordion component teaching algorithmic thinking steps
 * with system-based dark mode support and golden ratio layout for desktop
 */
export default function AlgorithmAccordion() {
    const [openSteps, setOpenSteps] = useState<number[]>([])

    const steps = [
        {
            title: "Define the Problem",
            description: "Start by clearly identifying what needs to be solved. This involves understanding the inputs, desired outputs, and any constraints or requirements. A well-defined problem is already halfway solved!",
            icon: <Telescope className="w-4 h-4" />,
            color: "from-pink-400 to-purple-400",
            darkColor: "from-pink-600 to-purple-600"
        },
        {
            title: "Break it Down",
            description: "Split the problem into smaller, manageable pieces. Think of it like a puzzle - it's easier to solve when you organize the pieces into groups first. This step helps make complex problems less overwhelming.",
            icon: <Puzzle className="w-4 h-4" />,
            color: "from-orange-400 to-pink-400",
            darkColor: "from-orange-600 to-pink-600"
        },
        {
            title: "Pattern Recognition",
            description: "Look for familiar patterns or similarities to problems you've solved before. This is like recognizing that multiplication is just repeated addition, or that searching a phone book is similar to searching a dictionary.",
            icon: <Sparkles className="w-4 h-4" />,
            color: "from-yellow-400 to-orange-400",
            darkColor: "from-yellow-600 to-orange-600"
        },
        {
            title: "Abstract Solution",
            description: "Create a general approach that can work for similar problems. This means developing a solution that isn't tied to specific numbers or cases but can work with any valid input. It's like creating a recipe that works regardless of the quantity of ingredients.",
            icon: <Lightbulb className="w-4 h-4" />,
            color: "from-green-400 to-teal-400",
            darkColor: "from-green-600 to-teal-600"
        },
        {
            title: "Implementation",
            description: "Transform your solution into precise, step-by-step instructions. This is where you get specific about exactly what needs to happen at each step. Think of it as writing detailed directions for someone to follow.",
            icon: <Code className="w-4 h-4" />,
            color: "from-blue-400 to-indigo-400",
            darkColor: "from-blue-600 to-indigo-600"
        },
        {
            title: "Testing & Refinement",
            description: "Check if your solution works correctly and look for ways to make it better. Try different inputs, edge cases, and see if there are any shortcuts or optimizations possible. This is like proofreading an essay to catch mistakes and improve the writing.",
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: "from-violet-400 to-purple-400",
            darkColor: "from-violet-600 to-purple-600"
        }
    ]

    const toggleStep = (index: number) => {
        setOpenSteps(prev => 
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const StepAccordion = ({ 
        title, 
        description, 
        isOpen, 
        onToggle,
        icon,
        color,
        darkColor
    }: StepAccordionProps) => (
        <div className="flex flex-col">
            <button
                onClick={onToggle}
                className={`
                    w-full flex items-center justify-between p-2 sm:p-3 
                    rounded-xl bg-gradient-to-r ${color} dark:bg-gradient-to-r dark:${darkColor}
                    shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                    h-12 sm:h-10
                `}
            >
                <div className="flex items-center gap-2">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-1.5 shadow-inner">
                        <div className="text-gray-800 dark:text-gray-200">
                            {icon}
                        </div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                        {title}
                    </h3>
                </div>
                <div className="bg-white/20 dark:bg-gray-900/20 rounded-full p-1">
                    {isOpen ? (
                        <ChevronUp className="w-3 h-3 text-white" />
                    ) : (
                        <ChevronDown className="w-3 h-3 text-white" />
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 p-2 sm:p-3 mt-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-xs sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )

    return (
        <div className="w-full sm:aspect-[1.618/1] mx-auto p-3 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl transition-colors duration-300 flex flex-col">
            <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex justify-center items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 p-2 rounded-xl shadow-lg">
                        <Brain className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Understanding Algorithms
                    </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Explore each step of algorithmic thinking ✨
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full flex-1">
                {steps.map((step, index) => (
                    <StepAccordion
                        key={index}
                        title={step.title}
                        description={step.description}
                        isOpen={openSteps.includes(index)}
                        onToggle={() => toggleStep(index)}
                        icon={step.icon}
                        color={step.color}
                        darkColor={step.darkColor}
                    />
                ))}
            </div>
        </div>
    )
}