"use client"
import { useState, useEffect } from "react";
import { Magnifier, Image, FileImage, Layers, Book, PieChart } from "lucide-react";

interface ComponentProps {}

type Stage = "input" | "convolution" | "pooling" | "featureMap" | "classification" | "quiz";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

const QUESTIONS: Question[] = [
  {
    text: "What does the magnifying glass represent in our CNN metaphor?",
    options: ["Input layer", "Convolutional filter", "Pooling layer", "Fully connected layer"],
    correctAnswer: 1
  },
  {
    text: "What is the purpose of the pooling layer?",
    options: ["To add more details", "To extract features", "To summarize and reduce data", "To classify the image"],
    correctAnswer: 2
  }
];

/**
 * CNNExplorer: Interactive component to teach Convolutional Neural Networks
 */
const CNNExplorer: React.FC<ComponentProps> = () => {
  const [stage, setStage] = useState<Stage>("input");
  const [image, setImage] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  useEffect(() => {
    if (stage === "convolution") {
      const timer = setTimeout(() => setStage("pooling"), 5000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStage("convolution");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (answerIndex === QUESTIONS[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage("classification");
    }
  };

  const renderStage = () => {
    switch (stage) {
      case "input":
        return (
          <div className="flex flex-col items-center">
            <FileImage className="w-16 h-16 text-blue-500 mb-4" />
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Upload Image
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
        );
      case "convolution":
        return (
          <div className="relative">
            {image && <img src={image} alt="Uploaded" className="w-full h-auto" />}
            <Magnifier className="absolute top-1/4 left-1/4 w-16 h-16 text-blue-500 animate-pulse" />
            <Magnifier className="absolute top-1/2 left-1/2 w-16 h-16 text-green-500 animate-pulse" />
            <p className="mt-4">Convolutional filters extracting features...</p>
          </div>
        );
      case "pooling":
        return (
          <div className="flex flex-col items-center">
            <Layers className="w-16 h-16 text-blue-500 mb-4" />
            <p>Pooling layer summarizing information...</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setStage("featureMap")}
            >
              Next
            </button>
          </div>
        );
      case "featureMap":
        return (
          <div className="flex flex-col items-center">
            <Image className="w-16 h-16 text-blue-500 mb-4" />
            <p>Feature maps created from previous layers...</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setStage("quiz")}
            >
              Start Quiz
            </button>
          </div>
        );
      case "quiz":
        const question = QUESTIONS[currentQuestion];
        return (
          <div className="flex flex-col items-center">
            <Book className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-xl mb-4">{question.text}</h2>
            {question.options.map((option, index) => (
              <button
                key={index}
                className="mt-2 bg-gray-200 px-4 py-2 rounded w-full text-left"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "classification":
        return (
          <div className="flex flex-col items-center">
            <PieChart className="w-16 h-16 text-blue-500 mb-4" />
            <p>Final classification: Image recognized!</p>
            <p className="mt-4">Quiz Score: {quizScore}/{QUESTIONS.length}</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setStage("input");
                setImage(null);
                setQuizScore(0);
                setCurrentQuestion(0);
              }}
            >
              Start Over
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">CNN Explorer: The Art Detective</h1>
      {renderStage()}
    </div>
  );
};

export default CNNExplorer;