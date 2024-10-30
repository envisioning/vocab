"use client"
import { useState, useEffect } from "react";
import { Music, Film, Heart, User2, Search, ArrowRight, Award } from "lucide-react";

interface Avatar {
  id: number;
  music: number;
  movies: number;
  sports: number;
  art: number;
  similarity?: number;
}

interface SimilaritySearchProps {}

/**
 * SimilaritySearch component teaches similarity search through interactive avatar matching
 * @component
 */
const SimilaritySearch: React.FC<SimilaritySearchProps> = () => {
  const [userPrefs, setUserPrefs] = useState<Avatar>({
    id: 0,
    music: 50,
    movies: 50,
    sports: 50,
    art: 50,
  });

  const [matches, setMatches] = useState<Avatar[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const DATABASE: Avatar[] = [
    { id: 1, music: 80, movies: 30, sports: 90, art: 20 },
    { id: 2, music: 40, movies: 70, sports: 40, art: 80 },
    { id: 3, music: 60, movies: 60, sports: 50, art: 50 },
    { id: 4, music: 20, movies: 90, sports: 30, art: 70 },
  ];

  const calculateSimilarity = (a: Avatar, b: Avatar): number => {
    const diff = Math.sqrt(
      Math.pow(a.music - b.music, 2) +
      Math.pow(a.movies - b.movies, 2) +
      Math.pow(a.sports - b.sports, 2) +
      Math.pow(a.art - b.art, 2)
    );
    return 100 - (diff / Math.sqrt(40000)) * 100;
  };

  useEffect(() => {
    if (isSearching) {
      const results = DATABASE.map(avatar => ({
        ...avatar,
        similarity: calculateSimilarity(userPrefs, avatar),
      })).sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

      const timer = setTimeout(() => {
        setMatches(results);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [userPrefs, isSearching]);

  const handleSliderChange = (feature: keyof Avatar, value: number) => {
    setUserPrefs(prev => ({ ...prev, [feature]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <User2 /> Find Your Digital Twin
      </h1>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Music className="text-blue-500" />
          <input
            type="range"
            value={userPrefs.music}
            onChange={(e) => handleSliderChange('music', parseInt(e.target.value))}
            className="w-full"
            aria-label="Music preference"
          />
        </div>

        <div className="flex items-center gap-2">
          <Film className="text-blue-500" />
          <input
            type="range"
            value={userPrefs.movies}
            onChange={(e) => handleSliderChange('movies', parseInt(e.target.value))}
            className="w-full"
            aria-label="Movie preference"
          />
        </div>

        <button
          onClick={() => setIsSearching(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          aria-label="Start similarity search"
        >
          <Search className="w-4 h-4" />
          Find Matches
        </button>
      </div>

      {isSearching && (
        <div className="space-y-4">
          {matches.map((avatar) => (
            <div
              key={avatar.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Award className="text-blue-500" />
                <span>Avatar {avatar.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-green-500" />
                <span>{avatar.similarity?.toFixed(1)}% Match</span>
                <ArrowRight className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilaritySearch;