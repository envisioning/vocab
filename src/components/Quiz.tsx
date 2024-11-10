"use client";

import { useState } from "react";

interface QuizQuestion {
  question: string;
  answers: string[];
}

interface QuizData {
  conceptual: QuizQuestion;
  practical: QuizQuestion;
}

interface QuizProps {
  slug: string;
}

function shuffleAndLimitAnswers(answers: string[]): string[] {
  // Separate correct answer (first one) from incorrect answers
  const correctAnswer = answers[0];
  const incorrectAnswers = answers.slice(1);

  // Shuffle incorrect answers and take only 2
  const shuffledIncorrect = incorrectAnswers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  // Combine correct answer with 2 random incorrect answers and shuffle again
  return [correctAnswer, ...shuffledIncorrect].sort(() => Math.random() - 0.5);
}

export default function Quiz({ slug }: QuizProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({
    conceptual: false,
    practical: false,
  });
  const [shuffledAnswers, setShuffledAnswers] = useState<{
    [key: string]: { answers: string[]; correctIndex: number };
  }>({});

  // Fetch quiz data on component mount
  useState(() => {
    import("../data/quizzes.json").then((data) => {
      if (data[slug]) {
        setQuizData(data[slug]);

        // Shuffle and store answers for both question types
        const shuffled = {
          conceptual: {
            answers: shuffleAndLimitAnswers(data[slug].conceptual.answers),
            correctIndex: 0,
          },
          practical: {
            answers: shuffleAndLimitAnswers(data[slug].practical.answers),
            correctIndex: 0,
          },
        };

        // Store the index of the correct answer for each question
        shuffled.conceptual.correctIndex = shuffled.conceptual.answers.indexOf(
          data[slug].conceptual.answers[0]
        );
        shuffled.practical.correctIndex = shuffled.practical.answers.indexOf(
          data[slug].practical.answers[0]
        );

        setShuffledAnswers(shuffled);
      }
    });
  }, [slug]);

  if (!quizData) return null;

  const handleAnswerSelect = (
    questionType: "conceptual" | "practical",
    answerIndex: number
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionType]: answerIndex,
    }));
  };

  const checkAnswer = (questionType: "conceptual" | "practical") => {
    setShowResults((prev) => ({
      ...prev,
      [questionType]: true,
    }));
  };

  return (
    <div className="my-8 space-y-8">
      {["conceptual", "practical"].map((type) => (
        <div key={type} className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            {quizData[type].question}
          </h3>

          <div className="space-y-3">
            {shuffledAnswers[type]?.answers.map((answer, index) => (
              <div key={index} className="flex items-start gap-3">
                <input
                  type="radio"
                  name={`${type}-answer`}
                  id={`${type}-answer-${index}`}
                  className="w-4 h-4 mt-1 cursor-pointer"
                  onChange={() => handleAnswerSelect(type, index)}
                  checked={selectedAnswers[type] === index}
                  disabled={showResults[type]}
                />
                <label
                  htmlFor={`${type}-answer-${index}`}
                  className={`flex-1 cursor-pointer ${
                    showResults[type] &&
                    index === shuffledAnswers[type].correctIndex
                      ? "text-green-600 font-medium"
                      : showResults[type] && selectedAnswers[type] === index
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {answer}
                </label>
              </div>
            ))}
          </div>

          {!showResults[type] && selectedAnswers[type] !== undefined && (
            <button
              onClick={() => checkAnswer(type)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Check Answer
            </button>
          )}

          {showResults[type] && (
            <div className="mt-4">
              {selectedAnswers[type] === shuffledAnswers[type].correctIndex ? (
                <p className="text-green-600">Correct! Well done!</p>
              ) : (
                <p className="text-red-600">
                  Incorrect. The correct answer is:{" "}
                  {
                    shuffledAnswers[type].answers[
                      shuffledAnswers[type].correctIndex
                    ]
                  }
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
