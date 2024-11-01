"use client"
import { useState, useEffect } from "react";
import { MessageCircle, Award, RefreshCw, Check, AlertCircle, Redo, Shuffle } from "lucide-react";

interface Scenario {
    question: string;
    answers: {
        text: string;
        isAEO: boolean;
        explanation: string;
    }[];
}

interface ScenarioWithShuffledAnswers extends Scenario {
    shuffledAnswerIndices: number[];
}

interface ComponentProps {}

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const SCENARIOS: Scenario[] = [
    {
        question: "What's the best time to visit Paris?",
        answers: [
            {
                text: "Spring (March to May) is the best time to visit Paris due to mild weather and fewer crowds.",
                isAEO: true,
                explanation: "Direct, concise answer with specific details"
            },
            {
                text: "Paris, the city of lights, has many wonderful seasons each offering unique experiences...",
                isAEO: false,
                explanation: "Too indirect and verbose"
            },
            {
                text: "Tourist seasons vary greatly depending on multiple factors including weather patterns...",
                isAEO: false,
                explanation: "Lacks specific answer"
            }
        ]
    },
    {
        question: "How do I make scrambled eggs?",
        answers: [
            {
                text: "First, you should consider the history of egg preparation techniques...",
                isAEO: false,
                explanation: "Unnecessary background information"
            },
            {
                text: "Beat eggs, heat butter in pan, cook while stirring until firm. Season with salt and pepper.",
                isAEO: true,
                explanation: "Clear, structured steps"
            },
            {
                text: "There are many ways to prepare eggs, including scrambling...",
                isAEO: false,
                explanation: "Too general, not actionable"
            }
        ]
    },
    {
        question: "What's the fastest way to learn a new language?",
        answers: [
            {
                text: "Practice daily with native speakers, use language learning apps, and immerse yourself in media.",
                isAEO: true,
                explanation: "Specific, actionable steps with clear methods"
            },
            {
                text: "Language acquisition is a complex process that varies from person to person...",
                isAEO: false,
                explanation: "Too theoretical, lacks practical advice"
            },
            {
                text: "There are numerous approaches to language learning that have been developed...",
                isAEO: false,
                explanation: "Vague and uninformative"
            }
        ]
    },
    {
        question: "How can I improve my sleep?",
        answers: [
            {
                text: "Sleep science has evolved significantly over the past few decades...",
                isAEO: false,
                explanation: "Historical context instead of practical advice"
            },
            {
                text: "Maintain a consistent sleep schedule, avoid screens before bed, keep your room cool and dark.",
                isAEO: true,
                explanation: "Clear, actionable recommendations"
            },
            {
                text: "Sleep quality can be influenced by various factors in our daily lives...",
                isAEO: false,
                explanation: "Too general, lacks specific advice"
            }
        ]
    },
    {
        question: "What's the formula for calculating compound interest?",
        answers: [
            {
                text: "The concept of compound interest was first developed by ancient mathematicians...",
                isAEO: false,
                explanation: "Historical information instead of the formula"
            },
            {
                text: "Compound interest can be calculated in various ways depending on the situation...",
                isAEO: false,
                explanation: "Lacks the actual formula"
            },
            {
                text: "A = P(1 + r/n)^(nt), where A is final amount, P is principal, r is interest rate, n is compounds per year, t is time.",
                isAEO: true,
                explanation: "Direct formula with clear variable definitions"
            }
        ]
    },
    {
        question: "How do I change a flat tire?",
        answers: [
            {
                text: "Park safely, loosen lug nuts, jack up car, remove flat tire, mount spare, lower car, tighten nuts.",
                isAEO: true,
                explanation: "Clear step-by-step instructions"
            },
            {
                text: "The invention of the pneumatic tire revolutionized transportation...",
                isAEO: false,
                explanation: "Irrelevant historical information"
            },
            {
                text: "Tire maintenance is an important aspect of vehicle safety...",
                isAEO: false,
                explanation: "General information instead of specific steps"
            }
        ]
    },
    {
        question: "What's the difference between RAM and ROM?",
        answers: [
            {
                text: "Computer memory has evolved significantly since the early days of computing...",
                isAEO: false,
                explanation: "Historical context instead of differences"
            },
            {
                text: "RAM is temporary, volatile memory for active programs; ROM is permanent, non-volatile memory for essential instructions.",
                isAEO: true,
                explanation: "Clear, direct comparison of key differences"
            },
            {
                text: "There are various types of computer memory that serve different purposes...",
                isAEO: false,
                explanation: "Too general, doesn't address the specific difference"
            }
        ]
    },
    {
        question: "How can I reduce my carbon footprint?",
        answers: [
            {
                text: "Climate change has been a growing concern since the industrial revolution...",
                isAEO: false,
                explanation: "Historical context instead of solutions"
            },
            {
                text: "Use public transport, reduce meat consumption, switch to LED bulbs, minimize single-use plastics.",
                isAEO: true,
                explanation: "Specific, actionable steps"
            },
            {
                text: "There are many ways individuals can contribute to environmental protection...",
                isAEO: false,
                explanation: "Too vague, lacks specific actions"
            }
        ]
    },
    {
        question: "What's the quickest way to defrost food safely?",
        answers: [
            {
                text: "Food preservation methods have been developed throughout human history...",
                isAEO: false,
                explanation: "Historical information instead of defrosting methods"
            },
            {
                text: "Use microwave defrost setting, cold water bath, or refrigerator. Never defrost at room temperature.",
                isAEO: true,
                explanation: "Clear methods with safety warning"
            },
            {
                text: "There are several factors to consider when defrosting food...",
                isAEO: false,
                explanation: "Lacks specific instructions"
            }
        ]
    },
    {
        question: "How do I create a strong password?",
        answers: [
            {
                text: "Use 12+ characters, mix uppercase, lowercase, numbers, symbols; avoid personal info.",
                isAEO: true,
                explanation: "Specific criteria and practical advice"
            },
            {
                text: "Password security has become increasingly important in the digital age...",
                isAEO: false,
                explanation: "Context without practical guidance"
            },
            {
                text: "There are many factors that contribute to password strength...",
                isAEO: false,
                explanation: "Vague, lacks specific recommendations"
            }
        ]
    },
    {
        question: "What's the best way to store coffee beans?",
        answers: [
            {
                text: "The history of coffee cultivation dates back to ancient Ethiopian highlands...",
                isAEO: false,
                explanation: "Historical information instead of storage advice"
            },
            {
                text: "Store in airtight container, cool dark place, away from moisture. Use within 30 days of roasting.",
                isAEO: true,
                explanation: "Specific storage instructions with timeframe"
            },
            {
                text: "Coffee storage depends on various environmental factors...",
                isAEO: false,
                explanation: "Too general, lacks specific guidance"
            }
        ]
    },
    {
        question: "How do I perform CPR?",
        answers: [
            {
                text: "Check responsiveness, call 911, compress chest 100-120 times/min, give rescue breaths if trained.",
                isAEO: true,
                explanation: "Clear, sequential steps with specific details"
            },
            {
                text: "The development of CPR techniques has saved countless lives...",
                isAEO: false,
                explanation: "Historical context instead of instructions"
            },
            {
                text: "CPR procedures may vary depending on the situation...",
                isAEO: false,
                explanation: "Vague, lacks specific steps"
            }
        ]
    },
    {
        question: "What's the proper way to cite sources in APA format?",
        answers: [
            {
                text: "Citation systems have evolved over many years of academic writing...",
                isAEO: false,
                explanation: "Historical information instead of citation format"
            },
            {
                text: "Author's last name, initials. (Year). Title. Source. DOI/URL",
                isAEO: true,
                explanation: "Clear format with all necessary elements"
            },
            {
                text: "There are multiple aspects to consider when citing sources...",
                isAEO: false,
                explanation: "Lacks specific format instructions"
            }
        ]
    },
    {
        question: "How can I improve my photography skills?",
        answers: [
            {
                text: "Learn manual mode, understand composition rules, practice different lighting conditions, experiment with angles.",
                isAEO: true,
                explanation: "Specific, actionable steps for improvement"
            },
            {
                text: "Photography has transformed since its invention in the 19th century...",
                isAEO: false,
                explanation: "Historical context instead of practical advice"
            },
            {
                text: "There are many aspects to consider in photography...",
                isAEO: false,
                explanation: "Too general, lacks specific guidance"
            }
        ]
    },
    {
        question: "What's the most effective way to study for exams?",
        answers: [
            {
                text: "Educational psychology has made significant advances in understanding learning...",
                isAEO: false,
                explanation: "Theoretical context instead of practical methods"
            },
            {
                text: "Use active recall, spaced repetition, teach concepts to others, take practice tests, review mistakes.",
                isAEO: true,
                explanation: "Specific, evidence-based study methods"
            },
            {
                text: "Study techniques vary depending on individual learning styles...",
                isAEO: false,
                explanation: "Too vague, lacks concrete advice"
            }
        ]
    },
    {
        question: "How do I build a basic website?",
        answers: [
            {
                text: "Choose domain name, select hosting, use HTML/CSS for structure and style, add content, test functionality.",
                isAEO: true,
                explanation: "Clear sequence of steps"
            },
            {
                text: "Web development has evolved significantly since the early days of the internet...",
                isAEO: false,
                explanation: "Historical context instead of instructions"
            },
            {
                text: "There are various approaches to website creation...",
                isAEO: false,
                explanation: "Lacks specific guidance"
            }
        ]
    },
    {
        question: "What's the correct way to measure ingredients for baking?",
        answers: [
            {
                text: "The history of baking measurements dates back to ancient civilizations...",
                isAEO: false,
                explanation: "Historical information instead of measuring instructions"
            },
            {
                text: "Use measuring cups for dry ingredients, level off with knife; use liquid measuring cups at eye level.",
                isAEO: true,
                explanation: "Specific measuring techniques"
            },
            {
                text: "Accurate measurement depends on various factors...",
                isAEO: false,
                explanation: "Too general, lacks specific methods"
            }
        ]
    },
    {
        question: "How do I write an effective resume?",
        answers: [
            {
                text: "Include contact info, relevant experience, skills, education. Use action verbs, quantify achievements.",
                isAEO: true,
                explanation: "Specific content and writing guidelines"
            },
            {
                text: "Resume writing practices have changed over the decades...",
                isAEO: false,
                explanation: "Historical context instead of practical advice"
            },
            {
                text: "There are many factors that contribute to a good resume...",
                isAEO: false,
                explanation: "Vague, lacks specific guidance"
            }
        ]
    },
    {
        question: "What's the best way to remove coffee stains?",
        answers: [
            {
                text: "The chemistry of stain removal is a fascinating subject...",
                isAEO: false,
                explanation: "Scientific context instead of removal methods"
            },
            {
                text: "Blot with clean cloth, apply cold water, use white vinegar or commercial cleaner, wash normally.",
                isAEO: true,
                explanation: "Clear step-by-step instructions"
            },
            {
                text: "Stain removal techniques can vary based on different factors...",
                isAEO: false,
                explanation: "Too general, lacks specific steps"
            }
        ]
    },
    {
        question: "How do I calculate body mass index (BMI)?",
        answers: [
            {
                text: "BMI = weight(kg) / height(m)². For pounds/inches: multiply by 703. Normal range: 18.5-24.9.",
                isAEO: true,
                explanation: "Clear formula with units and reference range"
            },
            {
                text: "The concept of BMI was developed in the 19th century...",
                isAEO: false,
                explanation: "Historical information instead of calculation method"
            },
            {
                text: "There are various ways to assess body composition...",
                isAEO: false,
                explanation: "Too general, doesn't provide the formula"
            }
        ]
    }
];

const getRandomScenarios = (count: number = 5): ScenarioWithShuffledAnswers[] => {
    const shuffledScenarios = shuffleArray([...SCENARIOS])
        .slice(0, count)
        .map(scenario => ({
            ...scenario,
            shuffledAnswerIndices: shuffleArray([0, 1, 2])
        }));
    return shuffledScenarios;
};

export default function AEOTrainer({}: ComponentProps) {
    const [randomizedScenarios, setRandomizedScenarios] = useState<ScenarioWithShuffledAnswers[]>([]);
    const [currentScenario, setCurrentScenario] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{text: string; isCorrect: boolean} | null>(null);
    const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
    const [foundCorrectAnswer, setFoundCorrectAnswer] = useState<boolean>(false);
    const [attempts, setAttempts] = useState<number[]>([]);

    useEffect(() => {
        initializeGame();
        return () => {
            // Cleanup
            setRandomizedScenarios([]);
            setAttempts([]);
        };
    }, []);

    const initializeGame = () => {
        const newScenarios = getRandomScenarios(5);
        setRandomizedScenarios(newScenarios);
        setCurrentScenario(0);
        setScore(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setIsGameComplete(false);
        setFoundCorrectAnswer(false);
        setAttempts([]);
    };

    const handleAnswerSelect = (index: number) => {
        if (foundCorrectAnswer || attempts.includes(index)) return;
        
        setSelectedAnswer(index);
        const currentQuestion = randomizedScenarios[currentScenario];
        const originalIndex = currentQuestion.shuffledAnswerIndices[index];
        const answer = currentQuestion.answers[originalIndex];
        
        setAttempts(prev => [...prev, index]);
        
        if (answer.isAEO) {
            setScore(prev => prev + 1);
            setFeedback({
                text: "Correct! " + answer.explanation,
                isCorrect: true
            });
            setFoundCorrectAnswer(true);
        } else {
            setFeedback({
                text: answer.explanation,
                isCorrect: false
            });
        }
    };

    const handleNext = () => {
        if (currentScenario + 1 >= randomizedScenarios.length) {
            setIsGameComplete(true);
            return;
        }

        setCurrentScenario(prev => prev + 1);
        setSelectedAnswer(null);
        setFeedback(null);
        setFoundCorrectAnswer(false);
        setAttempts([]);
    };

    if (randomizedScenarios.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <RefreshCw className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (isGameComplete) {
        return (
            <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Game Complete!</h2>
                    <p className="text-base sm:text-lg mb-4">Final Score: {score}/{randomizedScenarios.length}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={initializeGame}
                            className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
                            aria-label="Try new scenarios"
                        >
                            <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                            Try new scenarios
                        </button>
                        <button
                            onClick={() => {
                                setCurrentScenario(0);
                                setScore(0);
                                setSelectedAnswer(null);
                                setFeedback(null);
                                setIsGameComplete(false);
                                setFoundCorrectAnswer(false);
                                setAttempts([]);
                            }}
                            className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
                            aria-label="Retry same scenarios"
                        >
                            <Redo className="w-4 h-4 sm:w-5 sm:h-5" />
                            Retry same scenarios
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = randomizedScenarios[currentScenario];

    return (
        <div className="max-w-2xl mx-auto p-3 sm:p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">AEO Training Game</h2>
                <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="text-sm sm:text-base">Score: {score}/{randomizedScenarios.length}</span>
                </div>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg mb-4">
                <div className="flex items-start gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <p className="text-base sm:text-lg">{currentQuestion.question}</p>
                </div>

                <div className="p-2 sm:p-4 mb-3 sm:mb-4 text-center text-gray-500 text-sm sm:text-base">
                    {foundCorrectAnswer 
                        ? "Correct answer found! Click Next to continue" 
                        : "Click an answer to check if it's AEO-optimized"}
                </div>

                <div className="space-y-3">
                    {currentQuestion.shuffledAnswerIndices.map((originalIndex, index) => {
                        const answer = currentQuestion.answers[originalIndex];
                        const isAttempted = attempts.includes(index);
                        const isCorrect = isAttempted && answer.isAEO;
                        
                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={isAttempted}
                                className={`w-full p-2 sm:p-3 rounded-lg text-left transition-all duration-300 text-sm sm:text-base
                                    ${isAttempted 
                                        ? isCorrect ? 'bg-green-100' : 'bg-red-100'
                                        : 'bg-gray-100 hover:bg-gray-200'}`}
                                aria-label={`Answer option ${index + 1}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>{answer.text}</div>
                                    {isAttempted && (
                                        <div className="ml-2 mt-1">
                                            {isCorrect ? (
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isAttempted && (
                                    <div className="mt-2 text-xs sm:text-sm text-gray-600">
                                        {answer.explanation}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!foundCorrectAnswer}
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg disabled:opacity-50 transition-opacity duration-300 text-sm sm:text-base"
                aria-label="Next question"
            >
                Next Question
            </button>
        </div>
    );
}