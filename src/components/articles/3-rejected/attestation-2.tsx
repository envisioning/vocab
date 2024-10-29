"use client"
import { useState, useEffect } from "react";
import { Package, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ComponentProps {}

type PackageType = {
  id: number;
  status: "intact" | "tampered";
  verified: boolean;
};

/**
 * AttestationGuardian: An interactive component to teach the concept of attestation
 * to 15-18 year old students through a visual security checkpoint metaphor.
 */
const AttestationGuardian: React.FC<ComponentProps> = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [currentPackage, setCurrentPackage] = useState<PackageType | null>(null);
  const [verificationCount, setVerificationCount] = useState<number>(0);
  const [tamperCount, setTamperCount] = useState<number>(0);

  useEffect(() => {
    const initialPackages: PackageType[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      status: "intact",
      verified: false,
    }));
    setPackages(initialPackages);

    const interval = setInterval(() => {
      setPackages((prev) => {
        if (prev.length === 0) return initialPackages;
        return prev.slice(1);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (packages.length > 0 && !currentPackage) {
      setCurrentPackage(packages[0]);
    }
  }, [packages, currentPackage]);

  const handleVerify = () => {
    if (currentPackage) {
      setVerificationCount((prev) => prev + 1);
      setCurrentPackage({ ...currentPackage, verified: true });
    }
  };

  const handleTamper = () => {
    if (currentPackage) {
      setTamperCount((prev) => prev + 1);
      setCurrentPackage({ ...currentPackage, status: "tampered" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">The Attestation Guardian</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between mb-4">
          <Shield className="text-blue-500 w-12 h-12" />
          <div className="text-right">
            <p>Verified: {verificationCount}</p>
            <p>Tampered: {tamperCount}</p>
          </div>
        </div>
        <div className="border-t-4 border-b-4 border-gray-300 py-4 my-4 relative">
          {currentPackage && (
            <div className="flex items-center justify-center">
              <Package
                className={`w-16 h-16 ${
                  currentPackage.status === "intact" ? "text-green-500" : "text-red-500"
                }`}
              />
              {currentPackage.verified && (
                <CheckCircle className="text-green-500 w-6 h-6 absolute top-0 right-0" />
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleVerify}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Verify
          </button>
          <button
            onClick={handleTamper}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
          >
            Tamper
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {currentPackage?.status === "intact"
              ? "Package looks intact. Verify to ensure authenticity."
              : "Package has been tampered with!"}
          </p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          aria-label="Learn more about attestation"
          className="text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
        >
          <Info className="inline-block mr-1" size={16} />
          Learn more about attestation
        </button>
      </div>
    </div>
  );
};

export default AttestationGuardian;