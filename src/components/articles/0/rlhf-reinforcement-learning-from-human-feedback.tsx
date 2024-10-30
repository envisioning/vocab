"use client";
import { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Brain,
  Rocket,
  History,
  RefreshCw,
} from "lucide-react";

interface Post {
  id: number;
  content: string;
  quality: number;
  feedback: number;
}

interface RLHFSimulatorProps {}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    content: "Hey everyone! Just posting random stuff.",
    quality: 1,
    feedback: 0,
  },
  {
    id: 2,
    content: "Check out this amazing AI tutorial!",
    quality: 2,
    feedback: 0,
  },
  {
    id: 3,
    content: "Here's a detailed explanation of machine learning concepts.",
    quality: 3,
    feedback: 0,
  },
];

/**
 * RLHFSimulator - Educational component teaching RLHF through social media analogy
 */
const RLHFSimulator: React.FC<RLHFSimulatorProps> = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [generation, setGeneration] = useState<number>(1);
  const [isLearning, setIsLearning] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useEffect(() => {
    if (isLearning && generation < 10) {
      const interval = setInterval(() => {
        setPosts((prevPosts) =>
          prevPosts.map((post) => ({
            ...post,
            quality:
              post.feedback > 0
                ? Math.min(post.quality + 0.5, 5)
                : post.quality,
          }))
        );
        setGeneration((prev) => {
          const nextGen = prev + 1;
          if (nextGen >= 10) {
            setIsLearning(false);
          }
          return nextGen;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLearning, generation]);

  const handleFeedback = (postId: number, isPositive: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        feedback:
          post.id === postId
            ? isPositive
              ? post.feedback + 1
              : post.feedback - 1
            : post.feedback,
      }))
    );
  };

  const generateImprovedContent = (quality: number): string => {
    const improvements = [
      "Hey everyone! Just posting random stuff.",
      "Check out this cool AI concept I learned!",
      "Here's an interesting perspective on AI learning.",
      "Let me explain this complex topic simply.",
      "Here's a detailed yet accessible explanation of AI concepts.",
    ];
    return improvements[Math.min(Math.floor(quality), 4)];
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-500" />
          <span className="font-bold">Generation: {generation}</span>
        </div>
        <button
          onClick={() => setIsLearning(!isLearning)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          aria-label={isLearning ? "Pause Learning" : "Start Learning"}
        >
          {isLearning ? <RefreshCw className="animate-spin" /> : <Rocket />}
          {isLearning ? "Learning..." : "Start Learning"}
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded-lg border-2 ${
              selectedPost === post.id ? "border-blue-500" : "border-gray-200"
            }`}
            onClick={() => setSelectedPost(post.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">AI Post {post.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(post.id, true)}
                  className="p-2 hover:bg-green-100 rounded-full transition duration-300"
                  aria-label="Like"
                >
                  <ThumbsUp
                    className={
                      post.feedback > 0 ? "text-green-500" : "text-gray-400"
                    }
                  />
                </button>
                <button
                  onClick={() => handleFeedback(post.id, false)}
                  className="p-2 hover:bg-red-100 rounded-full transition duration-300"
                  aria-label="Dislike"
                >
                  <ThumbsDown
                    className={
                      post.feedback < 0 ? "text-red-500" : "text-gray-400"
                    }
                  />
                </button>
              </div>
            </div>
            <p className="text-gray-700">
              {generateImprovedContent(post.quality)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <History className="text-gray-400" />
              <div className="h-2 bg-gray-200 rounded-full flex-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(post.quality / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RLHFSimulator;
