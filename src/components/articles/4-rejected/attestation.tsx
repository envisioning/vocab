"use client"
import { useState, useEffect } from "react";
import { Shield, Lock, AlertTriangle, CheckCircle, X, Camera, Fingerprint, Key, Eye } from "lucide-react";

interface SecurityMeasure {
  id: number;
  name: string;
  icon: JSX.Element;
  isActive: boolean;
}

interface AttackAttempt {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  handled: boolean;
}

const SECURITY_MEASURES: SecurityMeasure[] = [
  { id: 1, name: "Biometric Scanner", icon: <Fingerprint className="w-6 h-6" />, isActive: false },
  { id: 2, name: "CCTV System", icon: <Camera className="w-6 h-6" />, isActive: false },
  { id: 3, name: "Access Control", icon: <Key className="w-6 h-6" />, isActive: false },
  { id: 4, name: "Surveillance", icon: <Eye className="w-6 h-6" />, isActive: false },
];

export default function AttestationSimulator() {
  const [measures, setMeasures] = useState<SecurityMeasure[]>(SECURITY_MEASURES);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [currentAttack, setCurrentAttack] = useState<AttackAttempt | null>(null);
  const [isCompromised, setIsCompromised] = useState<boolean>(false);

  useEffect(() => {
    const attackInterval = setInterval(() => {
      if (!isCompromised) {
        generateAttackAttempt();
      }
    }, 3000);

    return () => clearInterval(attackInterval);
  }, [isCompromised]);

  const generateAttackAttempt = () => {
    const attackTypes = ['unauthorized_access', 'tampering', 'spoofing'];
    const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    
    setCurrentAttack({
      id: Math.random(),
      type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      handled: false
    });
  };

  const toggleMeasure = (id: number) => {
    setMeasures(prev => prev.map(measure => 
      measure.id === id ? { ...measure, isActive: !measure.isActive } : measure
    ));
    updateSecurityScore();
  };

  const updateSecurityScore = () => {
    const activeCount = measures.filter(m => m.isActive).length;
    setSecurityScore((activeCount / measures.length) * 100);
  };

  const handleAttack = () => {
    if (!currentAttack) return;
    
    const activeMeasures = measures.filter(m => m.isActive).length;
    const successChance = activeMeasures >= 3 ? 0.9 : 0.5;
    
    if (Math.random() < successChance) {
      setCurrentAttack(prev => prev ? { ...prev, handled: true } : null);
      setTimeout(() => setCurrentAttack(null), 1000);
    } else {
      setIsCompromised(true);
    }
  };

  const resetSimulation = () => {
    setMeasures(SECURITY_MEASURES);
    setSecurityScore(0);
    setCurrentAttack(null);
    setIsCompromised(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Digital Museum Security System</h2>
        <div className="flex items-center gap-2">
          <Shield className={`w-6 h-6 ${securityScore >= 75 ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="font-semibold">{securityScore.toFixed(0)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {measures.map((measure) => (
          <button
            key={measure.id}
            onClick={() => toggleMeasure(measure.id)}
            className={`p-4 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
              measure.isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            aria-pressed={measure.isActive}
          >
            {measure.icon}
            <span>{measure.name}</span>
          </button>
        ))}
      </div>

      {currentAttack && !isCompromised && (
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              <span>Attack Detected: {currentAttack.type}</span>
            </div>
            <button
              onClick={handleAttack}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Respond
            </button>
          </div>
        </div>
      )}

      {isCompromised && (
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <h3 className="text-red-500 font-bold mb-2">System Compromised!</h3>
          <button
            onClick={resetSimulation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Reset System
          </button>
        </div>
      )}
    </div>
  );
}