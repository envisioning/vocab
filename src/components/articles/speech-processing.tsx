"use client"
import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Volume1, VolumeX, Wand2 } from "lucide-react";

interface WaveformPoint {
  amplitude: number;
  noiseLevel: number;
}

interface TranscribedWord {
  text: string;
  confidence: number;
  timestamp: number;
}

interface AudioVisualizerProps {}

const SAMPLE_WORDS = [
  { word: "Hello", difficulty: "easy" },
  { word: "Onomatopoeia", difficulty: "hard" },
  { word: "Cat", difficulty: "easy" },
  { word: "Phenomenon", difficulty: "hard" },
];

const AudioVisualizer: React.FC<AudioVisualizerProps> = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [waveformData, setWaveformData] = useState<WaveformPoint[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [transcribedWords, setTranscribedWords] = useState<TranscribedWord[]>([]);
  const [showHardWords, setShowHardWords] = useState<boolean>(false);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const generateWaveform = () => {
      const elapsed = (Date.now() - startTime) * playbackSpeed;
      const newPoint: WaveformPoint = {
        amplitude: Math.sin(elapsed * 0.01) * 0.5 + 0.5,
        noiseLevel: Math.random() * noiseLevel,
      };

      setWaveformData(prev => [...prev.slice(-50), newPoint]);
      animationFrame = requestAnimationFrame(generateWaveform);
    };

    if (isRecording) {
      generateWaveform();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isRecording, noiseLevel, playbackSpeed]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        const word = SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
        if (word.difficulty === "hard" && !showHardWords) return;

        const confidence = 1 - (noiseLevel * 0.8);
        setTranscribedWords(prev => [...prev.slice(-4), {
          text: word.word,
          confidence,
          timestamp: Date.now()
        }]);
      }, 2000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isRecording, noiseLevel, playbackSpeed, showHardWords]);

  const handleRecordToggle = () => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      setWaveformData([]);
      setTranscribedWords([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleRecordToggle}
          className={`p-4 rounded-full ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          } text-white transition-colors duration-300`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHardWords(prev => !prev)}
            className={`p-2 rounded ${
              showHardWords ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            aria-label="Toggle hard words"
          >
            <Wand2 size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <VolumeX size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-32"
              aria-label="Noise level"
            />
            <Volume2 size={20} />
          </div>
        </div>
      </div>

      <div className="h-40 bg-white rounded-lg p-4 mb-4">
        <div className="flex h-full items-center">
          {waveformData.map((point, index) => (
            <div
              key={index}
              className="flex-1 h-full flex flex-col justify-center"
            >
              <div
                className="w-2 bg-blue-500 rounded transition-all duration-300"
                style={{
                  height: `${point.amplitude * 100}%`,
                }}
              />
              <div
                className="w-2 bg-gray-300 rounded transition-all duration-300"
                style={{
                  height: `${point.noiseLevel * 50}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {transcribedWords.map((word, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-2 rounded"
          >
            <span>{word.text}</span>
            <div
              className="h-2 rounded"
              style={{
                width: "100px",
                backgroundColor: `rgb(${Math.floor(
                  255 * (1 - word.confidence)
                )}, ${Math.floor(255 * word.confidence)}, 0)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;