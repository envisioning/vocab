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

type QuizStage = "start" | "conceptual" | "practical" | "conclusion";

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
  const [currentStage, setCurrentStage] = useState<QuizStage>("start");
  const [attemptedAnswers, setAttemptedAnswers] = useState<{
    [key: string]: number[];
  }>({});
  const [attempts, setAttempts] = useState<{
    [key: string]: number;
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

  const moveToNextStage = () => {
    const stages: QuizStage[] = [
      "start",
      "conceptual",
      "practical",
      "conclusion",
    ];
    const currentIndex = stages.indexOf(currentStage);

    // Track quiz initiation
    if (currentStage === "start") {
      window.plausible?.("Quiz Initiated", {
        props: {
          quizSlug: slug,
        },
      });
    }

    setCurrentStage(stages[currentIndex + 1]);
  };

  const checkAnswer = (questionType: "conceptual" | "practical") => {
    const isCorrect =
      selectedAnswers[questionType] ===
      shuffledAnswers[questionType].correctIndex;
    const currentAttempt = (attempts[questionType] || 0) + 1;

    // Track first question answer
    if (questionType === "conceptual") {
      window.plausible?.("Quiz First Question Answered", {
        props: {
          quizSlug: slug,
          correct: isCorrect,
        },
      });
    }

    // Track second question answer
    if (questionType === "practical") {
      window.plausible?.("Quiz Second Question Answered", {
        props: {
          quizSlug: slug,
          correct: isCorrect,
        },
      });
    }

    setAttempts((prev) => ({
      ...prev,
      [questionType]: currentAttempt,
    }));

    if (!isCorrect && currentAttempt === 1) {
      // First wrong attempt - just mark it as attempted
      setAttemptedAnswers((prev) => ({
        ...prev,
        [questionType]: [
          ...(prev[questionType] || []),
          selectedAnswers[questionType],
        ],
      }));

      // Reset selection but keep showing the question
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionType]: undefined,
      }));
    } else {
      // Either correct or second wrong attempt - show results
      setShowResults((prev) => ({
        ...prev,
        [questionType]: true,
      }));
    }
  };

  const renderAnswerOption = (
    answer: string,
    index: number,
    questionType: "conceptual" | "practical"
  ) => {
    const isAttempted = attemptedAnswers[questionType]?.includes(index);
    const currentAttempts = attempts[questionType] || 0;

    return (
      <label
        key={index}
        htmlFor={`${questionType}-answer-${index}`}
        className={`flex items-start gap-3 border rounded-lg p-3 transition-colors ${
          isAttempted
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-100"
        } ${
          selectedAnswers[questionType] === index
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200"
        }`}
      >
        <input
          type="radio"
          name={`${questionType}-answer`}
          id={`${questionType}-answer-${index}`}
          className="w-4 h-4 mt-1 mr-1 accent-blue-500"
          onChange={() => handleAnswerSelect(questionType, index)}
          checked={selectedAnswers[questionType] === index}
          disabled={isAttempted || showResults[questionType]}
        />
        <span
          className={`flex-1 ${
            isAttempted ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {answer}
        </span>
      </label>
    );
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case "start":
        return (
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz</h2>
            <div className="max-w-xs mx-auto">
              <button
                onClick={moveToNextStage}
                className="w-full p-4 bg-blue-600 text-white rounded-lg text-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        );

      case "conclusion":
        return (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              Quiz Complete!
            </h3>
            <p className="mb-4 text-gray-700">
              You got{" "}
              {
                Object.values(selectedAnswers).filter(
                  (answerIndex, i) =>
                    answerIndex ===
                    shuffledAnswers[Object.keys(shuffledAnswers)[i]]
                      .correctIndex
                ).length
              }{" "}
              out of 2 questions correct.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      case "conceptual":
      case "practical":
        return (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {quizData[currentStage].question}
            </h3>

            <div className="space-y-3">
              {shuffledAnswers[currentStage]?.answers.map((answer, index) =>
                renderAnswerOption(answer, index, currentStage)
              )}
            </div>

            {renderResults(currentStage)}
          </div>
        );
    }
  };

  const renderResults = (questionType: "conceptual" | "practical") => {
    if (!showResults[questionType]) {
      return (
        <>
          {attemptedAnswers[questionType]?.length > 0 && (
            <p className="mt-4 text-red-500 mb-2">
              Sorry, that's wrong. Try again!
            </p>
          )}
          {selectedAnswers[questionType] !== undefined && (
            <button
              onClick={() => checkAnswer(questionType)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Check Answer
            </button>
          )}
        </>
      );
    }

    const isCorrect =
      selectedAnswers[questionType] ===
      shuffledAnswers[questionType].correctIndex;

    return (
      <div className="mt-4">
        {isCorrect ? (
          <div>
            <p className="text-green-500 mb-2">Correct! Well done!</p>
            <button
              onClick={moveToNextStage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {questionType === "conceptual" ? "Next Question" : "See Results"}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-red-500 mb-2">
              Sorry, that's wrong. The correct answer was:{" "}
              <span className="text-gray-900">
                {
                  shuffledAnswers[questionType].answers[
                    shuffledAnswers[questionType].correctIndex
                  ]
                }
              </span>
            </p>
            <button
              onClick={moveToNextStage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {questionType === "conceptual" ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return <div className="my-8">{renderStageContent()}</div>;
}
