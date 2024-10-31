"use client"
import { useState, useEffect } from "react";
import { FlaskConical, Brain, Zap, Scale, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  knowledge: number;
  color: string;
}

const ModelDistillation = () => {
  const [teacherParticles, setTeacherParticles] = useState<Particle[]>([]);
  const [studentParticles, setStudentParticles] = useState<Particle[]>([]);
  const [isDistilling, setIsDistilling] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [performance, setPerformance] = useState({
    accuracy: 100,
    speed: 0,
    size: 100
  });

  // Initialize teacher model particles
  useEffect(() => {
    const particles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 400,
      knowledge: Math.random() * 100,
      color: `rgb(${Math.random() * 255},${Math.random() * 255},255)`
    }));
    setTeacherParticles(particles);
  }, []);

  // Handle distillation process
  useEffect(() => {
    if (!isDistilling) return;

    const interval = setInterval(() => {
      const newStudentParticles = teacherParticles
        .filter(() => Math.random() > compressionLevel/100)
        .map(p => ({
          ...p,
          x: Math.random() * 300,
          y: Math.random() * 400,
          knowledge: p.knowledge * 0.8
        }));

      setStudentParticles(newStudentParticles);
      
      setPerformance({
        accuracy: 100 - (compressionLevel/2),
        speed: compressionLevel,
        size: 100 - compressionLevel
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDistilling, compressionLevel, teacherParticles]);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen" role="main">
      <h1 className="text-3xl font-bold mb-8">Model Distillation Lab</h1>

      <div className="flex gap-8 mb-8">
        {/* Teacher Model */}
        <div className="relative w-80 h-96 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl">Teacher Model</h2>
          </div>
          
          {teacherParticles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-4 h-4 rounded-full transition-all duration-500"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                opacity: particle.knowledge/100
              }}
            />
          ))}
        </div>

        {/* Control Panel */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => setIsDistilling(!isDistilling)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2"
            aria-label={isDistilling ? "Stop distillation" : "Start distillation"}
          >
            {isDistilling ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
          </button>

          <div className="flex flex-col items-center">
            <label htmlFor="compression" className="mb-2">Compression Level</label>
            <input
              id="compression"
              type="range"
              min="0"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="w-32"
              aria-label="Adjust compression level"
            />
            <span>{compressionLevel}%</span>
          </div>
        </div>

        {/* Student Model */}
        <div className="relative w-80 h-96 bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center mb-4">
            <FlaskConical className="w-6 h-6 mr-2 text-green-600" />
            <h2 className="text-xl">Student Model</h2>
          </div>

          {studentParticles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full transition-all duration-500"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                opacity: particle.knowledge/100
              }}
            />
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl mb-4 flex items-center">
          <Scale className="w-5 h-5 mr-2" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
              Accuracy
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{width: `${performance.accuracy}%`}}
                role="progressbar"
                aria-valuenow={performance.accuracy}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 mr-1 text-blue-500" />
              Speed
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{width: `${performance.speed}%`}}
                role="progressbar"
                aria-valuenow={performance.speed}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Brain className="w-4 h-4 mr-1 text-green-500" />
              Model Size
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{width: `${performance.size}%`}}
                role="progressbar"
                aria-valuenow={performance.size}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDistillation;