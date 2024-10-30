"use client"
import { useState, useEffect } from "react";
import { Palette, Image, Slider, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface ComponentProps {}

type ArtworkType = {
  id: number;
  src: string;
  style: string;
};

const ARTWORKS: ArtworkType[] = [
  { id: 1, src: "/art1.jpg", style: "Abstract" },
  { id: 2, src: "/art2.jpg", style: "Impressionist" },
  { id: 3, src: "/art3.jpg", style: "Cubist" },
  { id: 4, src: "/art4.jpg", style: "Surrealist" },
  { id: 5, src: "/art5.jpg", style: "Pop Art" },
];

/**
 * GANArtGallery: An interactive component to teach Mode Collapse in GANs
 */
const GANArtGallery: React.FC<ComponentProps> = () => {
  const [diversity, setDiversity] = useState<number>(100);
  const [generatedArt, setGeneratedArt] = useState<ArtworkType[]>([]);
  const [challenge, setChallenge] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    generateArt();
    return () => {
      // Cleanup
    };
  }, [diversity]);

  const generateArt = () => {
    const artCount = Math.max(1, Math.floor(diversity / 20));
    const newArt = ARTWORKS.slice(0, artCount).map((art) => ({
      ...art,
      id: Math.random(),
    }));
    setGeneratedArt(newArt);
  };

  const handleDiversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiversity(Number(e.target.value));
  };

  const startChallenge = () => {
    setChallenge(true);
    setDiversity(Math.random() * 100);
    setUserAnswer(null);
  };

  const checkAnswer = (answer: boolean) => {
    setUserAnswer(answer);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">GAN Art Gallery</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Original Art Collection</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {ARTWORKS.map((art) => (
            <div key={art.id} className="flex-shrink-0">
              <Image className="w-32 h-32 object-cover rounded" />
              <p className="text-center mt-2">{art.style}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">GAN Artist Studio</h2>
        <div className="flex items-center space-x-4 mb-4">
          <Palette className="text-blue-500" />
          <label htmlFor="diversity" className="font-medium">
            Diversity:
          </label>
          <input
            type="range"
            id="diversity"
            min="0"
            max="100"
            value={diversity}
            onChange={handleDiversityChange}
            className="w-64"
          />
          <span>{diversity}%</span>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {generatedArt.map((art) => (
            <div key={art.id} className="flex-shrink-0">
              <Image className="w-32 h-32 object-cover rounded" />
              <p className="text-center mt-2">{art.style}</p>
            </div>
          ))}
        </div>
      </div>

      {!challenge && (
        <button
          onClick={startChallenge}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Start Challenge
        </button>
      )}

      {challenge && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Challenge Mode</h2>
          <p className="mb-4">Is this an example of mode collapse?</p>
          <div className="flex space-x-4">
            <button
              onClick={() => checkAnswer(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Yes
            </button>
            <button
              onClick={() => checkAnswer(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              No
            </button>
          </div>
          {userAnswer !== null && (
            <div className="mt-4">
              {userAnswer === (diversity < 50) ? (
                <p className="text-green-500 flex items-center">
                  <CheckCircle className="mr-2" /> Correct! 
                  {diversity < 50
                    ? " This is an example of mode collapse."
                    : " This is not an example of mode collapse."}
                </p>
              ) : (
                <p className="text-red-500 flex items-center">
                  <XCircle className="mr-2" /> Incorrect. Try again!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Understanding Mode Collapse</h2>
        <p className="mb-2">
          Mode collapse occurs when a GAN generates limited, similar outputs instead of diverse results.
        </p>
        <p>
          In this example, low diversity settings simulate mode collapse, producing fewer unique artworks.
        </p>
      </div>
    </div>
  );
};

export default GANArtGallery;