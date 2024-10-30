"use client"
import { useState, useEffect } from "react";
import { Music, ArrowRight, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface Note {
  id: number;
  key: string;
  frequency: number;
  probability: number;
}

interface MelodyMakerProps {}

const NOTES: Note[] = [
  { id: 1, key: "C", frequency: 261.63, probability: 0.2 },
  { id: 2, key: "D", frequency: 293.66, probability: 0.3 },
  { id: 3, key: "E", frequency: 329.63, probability: 0.15 },
  { id: 4, key: "F", frequency: 349.23, probability: 0.2 },
  { id: 5, key: "G", frequency: 392.00, probability: 0.15 }
];

const SEQUENCES = [
  ["C", "D", "E", "F"],
  ["D", "E", "F", "G"],
  ["E", "F", "G", "C"],
];

export default function MelodyMaker({}: MelodyMakerProps) {
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [playingNote, setPlayingNote] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    setAudioContext(context);
    return () => {
      context.close();
    };
  }, []);

  const playNote = (frequency: number) => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startGame = () => {
    setGameActive(true);
    setCurrentSequence([]);
    setScore(0);
    playSequence();
  };

  const playSequence = () => {
    const sequence = SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)];
    sequence.forEach((note, index) => {
      setTimeout(() => {
        setPlayingNote(note);
        const noteObj = NOTES.find(n => n.key === note);
        if (noteObj) playNote(noteObj.frequency);
        if (index === sequence.length - 1) {
          setTimeout(() => setPlayingNote(""), 500);
        }
      }, index * 1000);
    });
    setCurrentSequence(sequence);
  };

  const handleNoteClick = (note: Note) => {
    if (!gameActive) return;
    const expectedNote = NOTES.find(n => 
      n.probability === Math.max(...NOTES.map(note => note.probability))
    );
    
    if (expectedNote && note.key === expectedNote.key) {
      setScore(prev => prev + 1);
      playNote(note.frequency);
      setTimeout(playSequence, 1000);
    } else {
      setGameActive(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="text-blue-500" />
            Melody Maker
          </h1>
          <span className="text-lg">Score: {score}</span>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {currentSequence.map((note, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center rounded-lg
                ${playingNote === note ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                transition-colors duration-300`}
            >
              {note}
            </div>
          ))}
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-300">
            <ArrowRight className="text-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-8">
          {NOTES.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note)}
              disabled={!gameActive}
              className={`p-4 rounded-lg transition-all duration-300
                ${gameActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}
                text-white font-bold`}
              aria-label={`Play note ${note.key}`}
            >
              {note.key}
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          className="w-full py-3 bg-green-500 text-white rounded-lg
            hover:bg-green-600 transition-colors duration-300 flex items-center
            justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          {gameActive ? 'Restart Game' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}