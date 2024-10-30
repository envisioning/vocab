"use client";
import React, { useState } from "react";
import {
  Brain,
  Music,
  Calculator,
  Palette,
  Code,
  Book,
  ArrowRight,
  Check,
} from "lucide-react";

const CrossDomainExplorer = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showConnection, setShowConnection] = useState(false);

  const domains = [
    {
      id: "math",
      icon: Calculator,
      title: "Mathematics",
      skills: [
        "Pattern Recognition",
        "Logical Reasoning",
        "Quantitative Analysis",
      ],
      applications: [
        "Music Theory",
        "Programming Algorithms",
        "Art Composition",
      ],
    },
    {
      id: "music",
      icon: Music,
      title: "Music",
      skills: [
        "Pattern Recognition",
        "Temporal Sequences",
        "Emotional Expression",
      ],
      applications: ["Mathematical Rhythms", "Code Generation", "Visual Arts"],
    },
    {
      id: "art",
      icon: Palette,
      title: "Visual Arts",
      skills: ["Spatial Reasoning", "Pattern Creation", "Aesthetic Judgment"],
      applications: [
        "Mathematical Symmetry",
        "Musical Composition",
        "UI Design",
      ],
    },
    {
      id: "code",
      icon: Code,
      title: "Programming",
      skills: ["Logic Structure", "Problem Solving", "Pattern Implementation"],
      applications: [
        "Mathematical Modeling",
        "Music Generation",
        "Generative Art",
      ],
    },
  ];

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
    setShowConnection(true);
    setTimeout(() => setShowConnection(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Cross-Domain Competency in AI
        </h1>
        <p className="text-gray-600">
          Click on different domains to see how AI connects and applies
          knowledge across fields
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => handleDomainClick(domain)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedDomain?.id === domain.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <domain.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-sm font-medium">{domain.title}</div>
          </button>
        ))}
      </div>

      {selectedDomain && (
        <div className="bg-gray-50 rounded-lg p-6 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-4">
            {selectedDomain.title} Domain
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Book className="w-4 h-4 mr-2" />
                Core Skills
              </h3>
              <ul className="space-y-2">
                {selectedDomain.skills.map((skill, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2" />
                Cross-Domain Applications
              </h3>
              <ul className="space-y-2">
                {selectedDomain.applications.map((app, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div
                      className={`h-1 w-1 rounded-full mr-2 ${
                        showConnection ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    />
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {showConnection && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg transition-opacity duration-300" />
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500 text-center">
        This visualization demonstrates how AI systems can leverage knowledge
        and skills from one domain to enhance understanding and performance in
        others.
      </div>
    </div>
  );
};

export default CrossDomainExplorer;
