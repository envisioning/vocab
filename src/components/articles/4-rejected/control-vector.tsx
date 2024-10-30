"use client"
import { useState, useEffect } from "react";
import { Sliders, Music, Save, Undo, Info } from "lucide-react";

interface Preset {
  name: string;
  formality: number;
  emotion: number;
  detail: number;
  style: number;
}

interface ComponentProps {}

const PRESETS: Preset[] = [
  { name: "Professional Email", formality: 90, emotion: 20, detail: 60, style: 40 },
  { name: "Casual Chat", formality: 20, emotion: 70, detail: 30, style: 60 },
  { name: "Technical Doc", formality: 100, emotion: 10, detail: 90, style: 80 },
];

const SAMPLE_TEXT = "Hey there! How are you doing today?";

const AIStyleMixer: React.FC<ComponentProps> = () => {
  const [formality, setFormality] = useState<number>(50);
  const [emotion, setEmotion] = useState<number>(50);
  const [detail, setDetail] = useState<number>(50);
  const [style, setStyle] = useState<number>(50);
  const [outputText, setOutputText] = useState<string>(SAMPLE_TEXT);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  useEffect(() => {
    if (!isDemo) return;
    
    const demoInterval = setInterval(() => {
      setFormality(prev => (prev + 10) % 100);
      setEmotion(prev => (prev + 15) % 100);
      setDetail(prev => (prev + 20) % 100);
      setStyle(prev => (prev + 25) % 100);
    }, 2000);

    return () => clearInterval(demoInterval);
  }, [isDemo]);

  useEffect(() => {
    const transformedText = transformText(SAMPLE_TEXT, formality, emotion, detail, style);
    setOutputText(transformedText);
  }, [formality, emotion, detail, style]);

  const transformText = (text: string, f: number, e: number, d: number, s: number): string => {
    const formalityWords = f > 50 ? 
      ["Greetings", "I trust", "Best regards"] : 
      ["Hey", "Hope", "Bye"];
    
    const emotionWords = e > 50 ? 
      ["excited", "wonderful", "amazing"] : 
      ["okay", "fine", "good"];

    return f > 50 ? 
      `Greetings! I trust you are having a ${emotionWords[0]} day.` :
      `Hey! Hope you're doing ${emotionWords[2]}!`;
  };

  const handlePresetClick = (preset: Preset) => {
    setFormality(preset.formality);
    setEmotion(preset.emotion);
    setDetail(preset.detail);
    setStyle(preset.style);
    setIsDemo(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="w-6 h-6 text-blue-500" />
          AI Style Mixer
        </h1>
        <button
          onClick={() => setIsDemo(!isDemo)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
          aria-label={isDemo ? "Stop demo" : "Start demo"}
        >
          {isDemo ? <Undo className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          {isDemo ? "Stop Demo" : "Start Demo"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Input Text</h2>
          <div className="p-4 bg-white rounded-lg shadow">{SAMPLE_TEXT}</div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="flex flex-col items-center">
            <label className="mb-2">Formality</label>
            <input
              type="range"
              value={formality}
              onChange={(e) => {
                setFormality(Number(e.target.value));
                setIsDemo(false);
              }}
              className="w-full"
              min="0"
              max="100"
              aria-label="Formality control"
            />
          </div>
          {/* Similar sliders for emotion, detail, and style */}
        </div>

        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Output Text</h2>
          <div className="p-4 bg-white rounded-lg shadow">{outputText}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-blue-100 transition-colors duration-300"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIStyleMixer;