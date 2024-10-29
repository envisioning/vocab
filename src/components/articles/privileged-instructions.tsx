"use client";
import { useState, useEffect } from "react";
import { Lock, LockIcon, Shield, User, UserCheck, XCircle, CheckCircle } from "lucide-react";

interface Character {
  id: number;
  role: "student" | "teacher" | "admin";
  level: number;
  position: { x: number; y: number };
}

interface Zone {
  id: number;
  level: number;
  name: string;
  description: string;
  color: string;
}

const PrivilegedInstructionsSimulator = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: 1,
      role: "student",
      level: 3,
      position: { x: 50, y: 50 }
    },
    {
      id: 2, 
      role: "teacher",
      level: 2,
      position: { x: 150, y: 150 }
    },
    {
      id: 3,
      role: "admin",
      level: 0,
      position: { x: 250, y: 250 }
    }
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState(0);

  const zones: Zone[] = [
    {
      id: 1,
      level: 0,
      name: "Kernel Zone",
      description: "Most privileged, system-critical operations",
      color: "bg-red-100"
    },
    {
      id: 2,
      level: 1,
      name: "System Zone", 
      description: "Device drivers and system services",
      color: "bg-orange-100"
    },
    {
      id: 3,
      level: 2,
      name: "User Zone",
      description: "Standard application operations",
      color: "bg-blue-100"
    }
  ];

  const handleCharacterMove = (character: Character, zone: Zone) => {
    if (character.level <= zone.level) {
      setFeedback("Access granted - Privilege level sufficient");
      setScore(prev => prev + 10);
      
      setCharacters(prev => 
        prev.map(c => 
          c.id === character.id 
            ? {...c, position: {x: zone.id * 100, y: zone.id * 100}}
            : c
        )
      );
    } else {
      setFeedback("Access denied - Insufficient privileges");
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const handlePrivilegeEscalation = (character: Character) => {
    if (character.level > 0) {
      setCharacters(prev =>
        prev.map(c =>
          c.id === character.id
            ? {...c, level: c.level - 1}
            : c
        )  
      );
      setFeedback("Privilege level increased");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFeedback("");
    }, 3000);

    return () => clearInterval(timer);
  }, [feedback]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privileged Instructions Simulator</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {zones.map(zone => (
          <div 
            key={zone.id}
            className={`${zone.color} p-4 rounded-lg min-h-[200px] relative`}
            onClick={() => selectedCharacter && handleCharacterMove(selectedCharacter, zone)}
            role="button"
            tabIndex={0}
          >
            <h3 className="font-bold mb-2">{zone.name}</h3>
            <p className="text-sm">{zone.description}</p>
            <Shield className="absolute top-2 right-2" size={24} />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        {characters.map(character => (
          <button
            key={character.id}
            onClick={() => setSelectedCharacter(character)}
            className={`flex items-center gap-2 p-2 rounded ${
              selectedCharacter?.id === character.id ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            {character.role === 'admin' ? (
              <LockIcon className="text-red-500" />
            ) : character.role === 'teacher' ? (
              <UserCheck className="text-orange-500" />
            ) : (
              <User className="text-blue-500" />
            )}
            <span className="capitalize">{character.role}</span>
            <span className="text-sm">Level {character.level}</span>
          </button>
        ))}
      </div>

      {selectedCharacter && (
        <button
          onClick={() => handlePrivilegeEscalation(selectedCharacter)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          aria-label="Request higher privileges"
        >
          Request Higher Privileges
        </button>
      )}

      {feedback && (
        <div className={`mt-4 p-4 rounded flex items-center gap-2 ${
          feedback.includes('granted') ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {feedback.includes('granted') ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          {feedback}
        </div>
      )}

      <div className="mt-4">
        <p className="font-bold">Score: {score}</p>
      </div>
    </div>
  );
};

export default PrivilegedInstructionsSimulator;