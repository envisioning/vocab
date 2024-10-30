"use client"
import { useState, useEffect } from "react";
import { User, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface StudentData {
  id: number;
  name: string;
  grade: number | null;
  activities: string[];
  photoPresent: boolean;
  hasError: boolean;
}

interface ComponentProps {}

const INITIAL_STUDENTS: StudentData[] = [
  { id: 1, name: "Alex Smith", grade: 11, activities: ["Chess", "Band"], photoPresent: true, hasError: false },
  { id: 2, name: "Beth Johnson", grade: null, activities: ["Soccer"], photoPresent: false, hasError: true },
  { id: 3, name: "Chris Lee", grade: 999, activities: [], photoPresent: true, hasError: true },
  { id: 4, name: "Dana Park", grade: 10, activities: ["Drama"], photoPresent: true, hasError: false },
  { id: 5, name: "", grade: 11, activities: ["Chess"], photoPresent: true, hasError: true },
];

export default function DatasetDetective({}: ComponentProps) {
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);
  const [flaggedIds, setFlaggedIds] = useState<Set<number>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleFlagStudent = (id: number) => {
    setFlaggedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    const correctFlags = students.filter(s => s.hasError).length;
    const userFlags = flaggedIds.size;
    const correctMatches = students.filter(s => s.hasError === flaggedIds.has(s.id)).length;
    
    const newScore = Math.round((correctMatches / students.length) * 100);
    setScore(newScore);

    if (newScore === 100) {
      setFeedback("Perfect! You've identified all data issues!");
    } else if (newScore > 75) {
      setFeedback("Good job! Keep looking for data issues.");
    } else {
      setFeedback("Keep trying to find incorrect or missing data.");
    }

    return () => {
      setFeedback("");
      setScore(0);
    };
  }, [flaggedIds, students]);

  const handleReset = () => {
    setStudents(INITIAL_STUDENTS);
    setFlaggedIds(new Set());
    setScore(0);
    setFeedback("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dataset Detective: School Yearbook</h1>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          aria-label="Reset yearbook"
        >
          <RefreshCw size={20} /> Reset
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg">Flag entries with missing or incorrect data</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold">Score:</span>
          <span className={`${score === 100 ? 'text-green-500' : 'text-gray-700'}`}>{score}%</span>
          <span className="ml-4 text-blue-500">{feedback}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => (
          <div
            key={student.id}
            className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
              flaggedIds.has(student.id) ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {student.photoPresent ? (
                  <User className="text-gray-600" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
                <span className="font-semibold">{student.name || '[Missing Name]'}</span>
              </div>
              <button
                onClick={() => handleFlagStudent(student.id)}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-300"
                aria-label={`Flag ${student.name}'s data`}
              >
                {flaggedIds.has(student.id) ? (
                  <XCircle className="text-red-500" />
                ) : (
                  <CheckCircle className="text-gray-400" />
                )}
              </button>
            </div>
            <div className="mt-2">
              <p>Grade: {student.grade ?? '[Missing]'}</p>
              <p>Activities: {student.activities.length ? student.activities.join(", ") : '[None listed]'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}