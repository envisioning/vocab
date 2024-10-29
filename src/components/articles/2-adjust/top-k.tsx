"use client"
import { useState, useEffect } from "react";
import { Trophy, Star, Crown, Timer, Users, Brain } from "lucide-react";

interface Performer {
  id: number;
  name: string;
  score: number;
  isPerforming: boolean;
  isTopK: boolean;
}

interface TopKTalentScoutProps {}

const PERFORMER_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Eva",
  "Frank", "Grace", "Henry", "Iris", "Jack"
];

/**
 * TopKTalentScout: An interactive component teaching Top-K algorithm
 * through a talent show metaphor.
 */
const TopKTalentScout: React.FC<TopKTalentScoutProps> = () => {
  const [k, setK] = useState<number>(3);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPerformerIndex, setCurrentPerformerIndex] = useState<number>(-1);

  useEffect(() => {
    const initialPerformers = PERFORMER_NAMES.map((name, index) => ({
      id: index,
      name,
      score: 0,
      isPerforming: false,
      isTopK: false,
    }));
    setPerformers(initialPerformers);
    return () => setPerformers([]);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setCurrentPerformerIndex(prev => {
          const next = prev + 1;
          if (next >= performers.length) {
            setIsRunning(false);
            return prev;
          }
          return next;
        });
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, performers.length]);

  useEffect(() => {
    if (currentPerformerIndex >= 0 && currentPerformerIndex < performers.length) {
      const updatedPerformers = [...performers];
      const newScore = Math.floor(Math.random() * 100);
      updatedPerformers[currentPerformerIndex] = {
        ...updatedPerformers[currentPerformerIndex],
        score: newScore,
        isPerforming: true
      };

      const topK = [...updatedPerformers]
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

      updatedPerformers.forEach(performer => {
        performer.isTopK = topK.some(top => top.id === performer.id);
        performer.isPerforming = performer.id === currentPerformerIndex;
      });

      setPerformers(updatedPerformers);
    }
  }, [currentPerformerIndex, k]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-blue-500" />
          Top-{k} Talent Scout
        </h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <Crown className="text-blue-500" />
            K Value:
            <input
              type="range"
              min="1"
              max="5"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-24"
              aria-label="Select K value"
            />
            <span className="w-8 text-center">{k}</span>
          </label>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            aria-label={isRunning ? "Pause simulation" : "Start simulation"}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="text-blue-500" />
            Performers
          </h3>
          <div className="space-y-2">
            {performers.map((performer) => (
              <div
                key={performer.id}
                className={`p-3 rounded-lg transition duration-300 ${
                  performer.isPerforming ? 'bg-blue-100' :
                  performer.isTopK ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{performer.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{performer.score}</span>
                    {performer.isTopK && <Star className="text-green-500 w-4 h-4" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="text-blue-500" />
            Top-{k} Explanation
          </h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="mb-4">
              We're selecting the {k} best performers based on their scores.
              Only the highest scoring performers make it to the top!
            </p>
            <div className="text-sm text-gray-600">
              <p>• New scores are compared with current top-{k}</p>
              <p>• Only better scores make it to the list</p>
              <p>• We don't need to sort all scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopKTalentScout;