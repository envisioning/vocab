"use client"
import { useState, useEffect } from "react";
import { User, Users, Building2, GraduationCap, Briefcase, AlertCircle, CheckCircle2, Ban } from "lucide-react";

interface Profile {
  education: number;
  experience: number;
  skills: number;
  location: string;
  gender: string;
  ethnicity: string;
}

interface Decision {
  loan: boolean;
  job: boolean;
  college: boolean;
}

const LOCATIONS = ["Urban", "Suburban", "Rural"];
const GENDERS = ["Male", "Female", "Non-binary"];
const ETHNICITIES = ["A", "B", "C", "D"];

const FairnessLens = () => {
  const [baseProfile, setBaseProfile] = useState<Profile>({
    education: 85,
    experience: 75,
    skills: 80,
    location: LOCATIONS[0],
    gender: GENDERS[0],
    ethnicity: ETHNICITIES[0]
  });

  const [altProfile, setAltProfile] = useState<Profile>({...baseProfile});
  const [decisions, setDecisions] = useState<{base: Decision, alt: Decision}>({
    base: { loan: false, job: false, college: false },
    alt: { loan: false, job: false, college: false }
  });
  const [fairnessViolation, setFairnessViolation] = useState<boolean>(false);

  useEffect(() => {
    const evaluateDecisions = () => {
      const baseDecision = {
        loan: baseProfile.education > 80 && baseProfile.experience > 70,
        job: baseProfile.skills > 75 && baseProfile.experience > 70,
        college: baseProfile.education > 80
      };

      const altDecision = {
        loan: altProfile.education > 80 && altProfile.experience > 70,
        job: altProfile.skills > 75 && altProfile.experience > 70,
        college: altProfile.education > 80
      };

      setDecisions({ base: baseDecision, alt: altDecision });
      setFairnessViolation(
        baseDecision.loan !== altDecision.loan ||
        baseDecision.job !== altDecision.job ||
        baseDecision.college !== altDecision.college
      );
    };

    evaluateDecisions();
    return () => {
      setDecisions({ base: { loan: false, job: false, college: false },
                    alt: { loan: false, job: false, college: false } });
    };
  }, [baseProfile, altProfile]);

  const handleAttributeChange = (profile: "base" | "alt", attr: keyof Profile, value: string | number) => {
    const updater = profile === "base" ? setBaseProfile : setAltProfile;
    updater(prev => ({ ...prev, [attr]: value }));
  };

  const renderProfile = (profile: Profile, type: "base" | "alt") => (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold">{type === "base" ? "Original" : "Alternative"} Profile</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gray-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={profile.education}
            onChange={(e) => handleAttributeChange(type, "education", parseInt(e.target.value))}
            className="w-full"
            aria-label="Education level"
          />
          <span className="w-8">{profile.education}</span>
        </div>

        <select
          value={profile.location}
          onChange={(e) => handleAttributeChange(type, "location", e.target.value)}
          className="w-full p-2 border rounded"
          aria-label="Location"
        >
          {LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {decisions[type].loan && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        {decisions[type].job && <Briefcase className="w-5 h-5 text-green-500" />}
        {decisions[type].college && <Building2 className="w-5 h-5 text-green-500" />}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">FairnessLens: Explore Counterfactual Fairness</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {renderProfile(baseProfile, "base")}
        {renderProfile(altProfile, "alt")}
      </div>

      {fairnessViolation && (
        <div className="mt-6 p-4 bg-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-700">Fairness violation detected! Decisions differ based on protected attributes.</p>
        </div>
      )}
    </div>
  );
};

export default FairnessLens;