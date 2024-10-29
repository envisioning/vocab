"use client"
import { useState, useEffect } from "react";
import { Building2, Car, Hospital, School, AlertTriangle, Check, X, Award } from "lucide-react";

interface Zone {
  id: string;
  type: 'transport' | 'healthcare' | 'education';
  risk: number;
  policies: string[];
  issues: string[];
}

interface Scenario {
  id: string;
  description: string;
  options: string[];
  correctIndex: number;
  consequence: string;
}

const INITIAL_ZONES: Zone[] = [
  {
    id: "transport",
    type: "transport",
    risk: 50,
    policies: [],
    issues: ["Autonomous vehicles need safety protocols", "Traffic AI requires oversight"]
  },
  {
    id: "healthcare",
    type: "healthcare",
    risk: 70,
    policies: [],
    issues: ["Patient data privacy concerns", "AI diagnosis accuracy"]
  },
  {
    id: "education",
    type: "education",
    risk: 30,
    policies: [],
    issues: ["Student data protection", "Fair AI assessment systems"]
  }
];

const POLICIES = {
  transport: ["Safety First Protocol", "Real-time Monitoring", "Emergency Override"],
  healthcare: ["Data Encryption", "Human Oversight", "Regular Audits"],
  education: ["Privacy Shield", "Fair Algorithm Check", "Transparent Decisions"]
};

export default function AIGovernCity() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [score, setScore] = useState<number>(0);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handlePolicyImplementation = (zoneId: string, policy: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id === zoneId) {
        const newRisk = Math.max(0, zone.risk - 20);
        return {
          ...zone,
          policies: [...zone.policies, policy],
          risk: newRisk
        };
      }
      return zone;
    }));
    setScore(prev => prev + 10);
    setFeedback(`Successfully implemented ${policy}!`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        risk: Math.min(100, zone.risk + (zone.policies.length === 0 ? 5 : 2))
      })));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getZoneIcon = (type: string) => {
    switch(type) {
      case 'transport': return <Car className="w-8 h-8 text-blue-500" />;
      case 'healthcare': return <Hospital className="w-8 h-8 text-blue-500" />;
      case 'education': return <School className="w-8 h-8 text-blue-500" />;
      default: return <Building2 className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" role="main">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Govern City</h1>
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-500" />
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map(zone => (
          <div
            key={zone.id}
            className={`p-4 rounded-lg border-2 ${
              zone.risk > 70 ? 'border-red-500' : 'border-gray-200'
            }`}
            role="region"
            aria-label={`${zone.type} zone`}
          >
            <div className="flex justify-between items-center mb-4">
              {getZoneIcon(zone.type)}
              <div className="flex items-center gap-2">
                <AlertTriangle 
                  className={`w-6 h-6 ${
                    zone.risk > 70 ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
                <span>{zone.risk}% Risk</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-2 capitalize">{zone.type}</h2>
            
            <div className="space-y-2">
              {POLICIES[zone.type as keyof typeof POLICIES]
                .filter(policy => !zone.policies.includes(policy))
                .map(policy => (
                  <button
                    key={policy}
                    onClick={() => handlePolicyImplementation(zone.id, policy)}
                    className="w-full p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    aria-label={`Implement ${policy}`}
                  >
                    {policy}
                  </button>
                ))}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Active Policies:</h3>
              <ul className="space-y-1">
                {zone.policies.map(policy => (
                  <li key={policy} className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {policy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {feedback}
        </div>
      )}
    </div>
  );
}