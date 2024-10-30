"use client"
import { useState, useEffect } from "react";
import { Lock, Unlock, ShieldAlert, Factory, FileCheck, XCircle, RefreshCcw } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  isSecure: boolean;
  data: string[];
}

interface ProcessingState {
  isProcessing: boolean;
  currentZone: string;
  encryptedData: string[];
}

const ConfidentialComputingDemo = () => {
  const [zones, setZones] = useState<Zone[]>([
    {id: "public", name: "Public Zone", isSecure: false, data: []},
    {id: "transit", name: "Transit Zone", isSecure: true, data: []},
    {id: "secure", name: "Secure Zone", isSecure: true, data: []}
  ]);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    currentZone: "public",
    encryptedData: []
  });

  const [attackAttempt, setAttackAttempt] = useState<boolean>(false);
  const [securityBreach, setSecurityBreach] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (processingState.isProcessing) {
      timer = setTimeout(() => {
        moveDataToNextZone();
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [processingState.isProcessing, processingState.currentZone]);

  const startProcessing = (inputData: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === "public" 
        ? {...zone, data: [...zone.data, inputData]}
        : zone
    ));
    
    setProcessingState({
      isProcessing: true,
      currentZone: "public",
      encryptedData: []
    });
  };

  const moveDataToNextZone = () => {
    const zoneOrder = ["public", "transit", "secure"];
    const currentIndex = zoneOrder.indexOf(processingState.currentZone);
    
    if (currentIndex < zoneOrder.length - 1) {
      const nextZone = zoneOrder[currentIndex + 1];
      
      setZones(prev => prev.map(zone => {
        if (zone.id === processingState.currentZone) {
          return {...zone, data: []};
        }
        if (zone.id === nextZone) {
          return {...zone, data: [...zone.data, ...prev.find(z => z.id === processingState.currentZone)?.data || []]};
        }
        return zone;
      }));

      setProcessingState(prev => ({
        ...prev,
        currentZone: nextZone,
        encryptedData: nextZone === "transit" ? encryptData(zones[0].data) : prev.encryptedData
      }));
    } else {
      setProcessingState(prev => ({...prev, isProcessing: false}));
    }
  };

  const encryptData = (data: string[]): string[] => {
    return data.map(item => item.split("").map(() => "*").join(""));
  };

  const simulateAttack = () => {
    setAttackAttempt(true);
    
    if (processingState.currentZone === "public") {
      setSecurityBreach(true);
    } else {
      setTimeout(() => {
        setAttackAttempt(false);
        setProcessingState(prev => ({...prev, isProcessing: false}));
      }, 1500);
    }
  };

  const resetDemo = () => {
    setZones([
      {id: "public", name: "Public Zone", isSecure: false, data: []},
      {id: "transit", name: "Transit Zone", isSecure: true, data: []},
      {id: "secure", name: "Secure Zone", isSecure: true, data: []}
    ]);
    setProcessingState({
      isProcessing: false,
      currentZone: "public",
      encryptedData: []
    });
    setAttackAttempt(false);
    setSecurityBreach(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Confidential Computing Demo</h1>
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Reset demo"
        >
          <RefreshCcw size={20} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`p-6 rounded-lg border-2 ${
              zone.isSecure 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 bg-gray-50"
            } ${attackAttempt && zone.id === processingState.currentZone ? "animate-shake" : ""}`}
          >
            <div className="flex items-center gap-2 mb-4">
              {zone.isSecure ? <Lock size={20} /> : <Unlock size={20} />}
              <h2 className="font-semibold">{zone.name}</h2>
            </div>
            
            <div className="min-h-[100px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
              {zone.data.map((item, index) => (
                <div key={index} className="p-2 bg-white rounded shadow">
                  {zone.id === "transit" ? processingState.encryptedData[index] : item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <button
          onClick={() => startProcessing("CC-DATA")}
          disabled={processingState.isProcessing}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          aria-label="Start processing"
        >
          <FileCheck className="inline-block mr-2" size={20} />
          Process Data
        </button>

        <button
          onClick={simulateAttack}
          disabled={processingState.isProcessing && !attackAttempt}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          aria-label="Simulate attack"
        >
          <ShieldAlert className="inline-block mr-2" size={20} />
          Simulate Attack
        </button>
      </div>

      {securityBreach && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2">
          <XCircle className="text-red-500" size={20} />
          <p>Security breach detected in public zone! Data compromised.</p>
        </div>
      )}
    </div>
  );
};

export default ConfidentialComputingDemo;