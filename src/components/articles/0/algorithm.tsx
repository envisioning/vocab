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
 * with system-based dark mode support
 */
export default function AlgorithmAccordion() {
    const [openSteps, setOpenSteps] = useState<number[]>([])

    const steps = [
        {
            title: "Define the Problem",
            description: "Start by clearly identifying what needs to be solved. This involves understanding the inputs, desired outputs, and any constraints or requirements. A well-defined problem is already halfway solved!",
            icon: <Telescope className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "from-pink-400 to-purple-400",
            darkColor: "from-pink-600 to-purple-600"
        },
        {
            title: "Break it Down",
            description: "Split the problem into smaller, manageable pieces. Think of it like a puzzle - it's easier to solve when you organize the pieces into groups first. This step helps make complex problems less overwhelming.",
            icon: <Puzzle className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "from-orange-400 to-pink-400",
            darkColor: "from-orange-600 to-pink-600"
        },
        {
            title: "Pattern Recognition",
            description: "Look for familiar patterns or similarities to problems you've solved before. This is like recognizing that multiplication is just repeated addition, or that searching a phone book is similar to searching a dictionary.",
            icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "from-yellow-400 to-orange-400",
            darkColor: "from-yellow-600 to-orange-600"
        },
        {
            title: "Abstract Solution",
            description: "Create a general approach that can work for similar problems. This means developing a solution that isn't tied to specific numbers or cases but can work with any valid input. It's like creating a recipe that works regardless of the quantity of ingredients.",
            icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "from-green-400 to-teal-400",
            darkColor: "from-green-600 to-teal-600"
        },
        {
            title: "Implementation",
            description: "Transform your solution into precise, step-by-step instructions. This is where you get specific about exactly what needs to happen at each step. Think of it as writing detailed directions for someone to follow.",
            icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "from-blue-400 to-indigo-400",
            darkColor: "from-blue-600 to-indigo-600"
        },
        {
            title: "Testing & Refinement",
            description: "Check if your solution works correctly and look for ways to make it better. Try different inputs, edge cases, and see if there are any shortcuts or optimizations possible. This is like proofreading an essay to catch mistakes and improve the writing.",
            icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />,
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
        <div className={`
            rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
            transition-all duration-300 transform hover:-translate-y-1
            bg-gradient-to-r ${color} dark:bg-gradient-to-r dark:${darkColor}
        `}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 sm:p-5 text-left"
            >
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-2 sm:p-3 shadow-inner">
                        <div className="text-gray-800 dark:text-gray-200">
                            {icon}
                        </div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                        {title}
                    </h3>
                </div>
                <div className="bg-white/20 dark:bg-gray-900/20 rounded-full p-1.5 sm:p-2">
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border-t border-white/10 dark:border-gray-800">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 bg-white dark:bg-gray-900 rounded-3xl transition-colors duration-300">
            <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                        <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Understanding Algorithms
                    </h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
                    Explore each step of algorithmic thinking ✨
                </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
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