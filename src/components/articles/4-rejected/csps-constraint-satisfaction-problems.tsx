"use client"
import { useState, useEffect } from "react";
import { Music, Users, X, Check, AlertTriangle, Mic2, Guitar, Drum, Piano } from "lucide-react";

interface Student {
  id: number;
  name: string;
  instruments: string[];
  availability: string[];
}

interface Position {
  id: number;
  instrument: string;
  filled?: Student;
}

interface Constraint {
  type: 'schedule' | 'combination';
  description: string;
  check: (positions: Position[]) => boolean;
}

const STUDENTS: Student[] = [
  { id: 1, name: "Alex", instruments: ["guitar", "vocals"], availability: ["monday", "wednesday"] },
  { id: 2, name: "Sam", instruments: ["drums", "piano"], availability: ["tuesday", "wednesday"] },
  { id: 3, name: "Jordan", instruments: ["piano", "vocals"], availability: ["monday", "tuesday"] },
  { id: 4, name: "Taylor", instruments: ["guitar", "drums"], availability: ["wednesday", "friday"] },
];

const POSITIONS: Position[] = [
  { id: 1, instrument: "vocals" },
  { id: 2, instrument: "guitar" },
  { id: 3, instrument: "drums" },
  { id: 4, instrument: "piano" },
];

const CONSTRAINTS: Constraint[] = [
  {
    type: 'schedule',
    description: "All band members must be available on Wednesday",
    check: (positions) => positions.every(p => p.filled?.availability.includes("wednesday"))
  },
  {
    type: 'combination',
    description: "Vocals and Guitar must be different students",
    check: (positions) => {
      const vocalist = positions.find(p => p.instrument === "vocals")?.filled;
      const guitarist = positions.find(p => p.instrument === "guitar")?.filled;
      return !vocalist || !guitarist || vocalist.id !== guitarist.id;
    }
  }
];

export default function BandMakerCSP() {
  const [positions, setPositions] = useState<Position[]>(POSITIONS);
  const [draggingStudent, setDraggingStudent] = useState<Student | null>(null);
  const [constraints, setConstraints] = useState<boolean[]>([]);

  useEffect(() => {
    const checkConstraints = () => {
      const results = CONSTRAINTS.map(constraint => constraint.check(positions));
      setConstraints(results);
    };
    checkConstraints();
  }, [positions]);

  const handleDragStart = (student: Student) => {
    setDraggingStudent(student);
  };

  const handleDrop = (position: Position) => {
    if (!draggingStudent || !draggingStudent.instruments.includes(position.instrument)) return;

    setPositions(positions.map(p => 
      p.id === position.id ? { ...p, filled: draggingStudent } : p
    ));
    setDraggingStudent(null);
  };

  const handleRemoveStudent = (positionId: number) => {
    setPositions(positions.map(p => 
      p.id === positionId ? { ...p, filled: undefined } : p
    ));
  };

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument) {
      case "vocals": return <Mic2 className="w-6 h-6" />;
      case "guitar": return <Guitar className="w-6 h-6" />;
      case "drums": return <Drum className="w-6 h-6" />;
      case "piano": return <Piano className="w-6 h-6" />;
      default: return <Music className="w-6 h-6" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Music className="w-8 h-8" />
        Band Maker CSP
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Available Students
          </h2>
          <div className="space-y-2">
            {STUDENTS.map(student => (
              <div
                key={student.id}
                draggable
                onDragStart={() => handleDragStart(student)}
                className="bg-white p-3 rounded shadow cursor-move hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-gray-600">
                  Plays: {student.instruments.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Band Positions</h2>
          <div className="space-y-2">
            {positions.map((position, index) => (
              <div
                key={position.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(position)}
                className={`p-3 rounded shadow ${
                  position.filled ? "bg-blue-50" : "bg-white border-2 border-dashed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getInstrumentIcon(position.instrument)}
                    <span className="capitalize">{position.instrument}</span>
                  </div>
                  {position.filled && (
                    <div className="flex items-center gap-2">
                      <span>{position.filled.name}</span>
                      <button
                        onClick={() => handleRemoveStudent(position.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="font-semibold">Constraints:</h3>
        {CONSTRAINTS.map((constraint, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded bg-white"
          >
            {constraints[index] ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            <span>{constraint.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}