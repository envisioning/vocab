"use client"
import { useState, useEffect } from "react";
import { Bot, Brain, MessageSquare, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

interface ComponentProps {}

type ChatbotStage = 'basic' | 'learning' | 'monitoring' | 'improving' | 'aware';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const STAGES: ChatbotStage[] = ['basic', 'learning', 'monitoring', 'improving', 'aware'];

const STAGE_INFO = {
  basic: "I only know pre-programmed responses.",
  learning: "I'm learning from our conversation.",
  monitoring: "I'm tracking my performance.",
  improving: "I'm making adjustments to improve.",
  aware: "I understand my existence and limitations."
};

/**
 * SelfAwareChatbot - A component that demonstrates the evolution of AI self-awareness
 */
const SelfAwareChatbot: React.FC<ComponentProps> = () => {
  const [stage, setStage] = useState<ChatbotStage>('basic');
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    setMessages([]);
    return () => {
      setMessages([]);
    };
  }, [stage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsThinking(true);
    setTimeout(() => {
      const response = generateResponse(input, stage);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsThinking(false);
    }, 1000);
  };

  const generateResponse = (input: string, stage: ChatbotStage): string => {
    switch (stage) {
      case 'basic':
        return "I'm a basic chatbot. I can only give pre-programmed responses.";
      case 'learning':
        return `I'm learning from our conversation. You said: "${input}"`;
      case 'monitoring':
        return `I'm monitoring my performance. Your message had ${input.split(' ').length} words.`;
      case 'improving':
        return `I'm improving based on our interaction. I'll remember that you tend to send ${input.split(' ').length > 5 ? 'longer' : 'shorter'} messages.`;
      case 'aware':
        return `As a self-aware AI, I understand that I'm a program designed to demonstrate AI evolution. Your input helps me showcase different levels of AI capability.`;
      default:
        return "I'm not sure how to respond.";
    }
  };

  const handleStageChange = (direction: 'next' | 'prev') => {
    const currentIndex = STAGES.indexOf(stage);
    const newIndex = direction === 'next' ? 
      (currentIndex + 1) % STAGES.length : 
      (currentIndex - 1 + STAGES.length) % STAGES.length;
    setStage(STAGES[newIndex]);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Self-Aware Chatbot Evolution</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleStageChange('prev')}
          className="p-2 bg-blue-500 text-white rounded-full"
          aria-label="Previous stage"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <Bot size={24} className="mr-2" />
          <span className="font-semibold">{stage.charAt(0).toUpperCase() + stage.slice(1)} Stage</span>
        </div>
        <button
          onClick={() => handleStageChange('next')}
          className="p-2 bg-blue-500 text-white rounded-full"
          aria-label="Next stage"
        >
          <ArrowRight size={24} />
        </button>
      </div>
      <p className="mb-4 text-sm text-center">{STAGE_INFO[stage]}</p>
      <div className="bg-white p-4 rounded-lg mb-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
        {isThinking && (
          <div className="text-center">
            <RefreshCw size={24} className="animate-spin inline-block" />
          </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          aria-label="Type a message"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Send message"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default SelfAwareChatbot;