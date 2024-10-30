"use client"
import { useState, useEffect } from "react";
import { Book, MessageSquare, RefreshCcw, Send, Zap } from "lucide-react";

interface Message {
    alien: string;
    english: string;
}

interface Rule {
    pattern: string;
    translation: string;
}

const ALIEN_MESSAGES: Message[] = [
    { alien: "◈◇◆", english: "Hello friend" },
    { alien: "◇◆◈", english: "How are you" },
    { alien: "◆◈◇", english: "Good morning" }
];

const TRANSLATION_RULES: Rule[] = [
    { pattern: "◈", translation: "first word" },
    { pattern: "◇", translation: "second word" },
    { pattern: "◆", translation: "third word" }
];

export default function ChineseRoom() {
    const [currentMessage, setCurrentMessage] = useState<Message>(ALIEN_MESSAGES[0]);
    const [userTranslation, setUserTranslation] = useState<string>("");
    const [showRules, setShowRules] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>("");
    const [attempts, setAttempts] = useState<number>(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (feedback) setFeedback("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [feedback]);

    const handleTranslationSubmit = () => {
        const isCorrect = userTranslation.toLowerCase() === currentMessage.english.toLowerCase();
        setFeedback(isCorrect ? "Correct! But did you understand, or just follow rules?" : "Try again!");
        setAttempts(prev => prev + 1);
        
        if (isCorrect && attempts > 1) {
            const nextIndex = ALIEN_MESSAGES.indexOf(currentMessage) + 1;
            if (nextIndex < ALIEN_MESSAGES.length) {
                setCurrentMessage(ALIEN_MESSAGES[nextIndex]);
                setUserTranslation("");
            }
        }
    };

    const handleReset = () => {
        setCurrentMessage(ALIEN_MESSAGES[0]);
        setUserTranslation("");
        setFeedback("");
        setAttempts(0);
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="text-blue-500" />
                    Universal Translator Booth
                </h1>

                <div className="bg-white p-4 rounded-md mb-4">
                    <p className="text-lg font-mono text-center">{currentMessage.alien}</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setShowRules(!showRules)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors duration-300"
                        aria-expanded={showRules}
                    >
                        <Book /> Translation Rules
                    </button>

                    {showRules && (
                        <div className="bg-gray-50 p-4 rounded-md" role="region" aria-label="Translation rules">
                            {TRANSLATION_RULES.map((rule, index) => (
                                <p key={index} className="mb-2">
                                    {rule.pattern} = {rule.translation}
                                </p>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <input
                            type="text"
                            value={userTranslation}
                            onChange={(e) => setUserTranslation(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your translation..."
                            aria-label="Translation input"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleTranslationSubmit}
                                className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Submit Translation
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2 text-gray-500 hover:text-gray-600 transition-colors duration-300"
                                aria-label="Reset exercise"
                            >
                                <RefreshCcw size={18} />
                            </button>
                        </div>
                    </div>

                    {feedback && (
                        <div className="flex items-center gap-2 text-green-500">
                            <Zap size={18} />
                            <p>{feedback}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}