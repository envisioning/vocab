"use client"
import React, { useState, useEffect } from 'react';
import {
  Brain,
  SplitSquareVertical,
  Microscope,
  Workflow,
  Component,
  ChevronRight,
  Code2
} from 'lucide-react';

// Using the correct type for Lucide icons
type LucideIconType = typeof Brain | typeof SplitSquareVertical | typeof Microscope |
  typeof Workflow | typeof Component | typeof ChevronRight | typeof Code2;

interface Phase {
  id: number;
  text: string;
  description: string;
  longDescription: string;
  scenario: string;
  icon: LucideIconType;
}

interface ScenarioData {
  title: string;
  phases: Phase[];
}

interface Scenarios {
  webApp: ScenarioData;
  algorithm: ScenarioData;
  dataAnalysis: ScenarioData;
}

const SCENARIOS: Scenarios = {
  webApp: {
    title: "Building a Social Media App",
    phases: [
      {
        id: 1,
        text: "Identify Problem",
        description: "Define the main challenge clearly",
        longDescription: "Build a social media platform where users can share posts and interact with others",
        scenario: "Main requirements:\n• User authentication\n• Post creation and sharing\n• Social interactions\n• Real-time updates",
        icon: Brain
      },
      {
        id: 2,
        text: "Break Into Parts",
        description: "Split into smaller manageable tasks",
        longDescription: "Break down the app into core functional components",
        scenario: "Identified components:\n• User management system\n• Content management system\n• Interaction system\n• Notification system",
        icon: SplitSquareVertical
      },
      {
        id: 3,
        text: "Analyze Components",
        description: "Study each part individually",
        longDescription: "Examine each component's requirements and challenges",
        scenario: "Component analysis:\n• User management: Authentication, profiles, privacy\n• Content: Posts, media handling, storage\n• Interactions: Likes, comments, sharing\n• Notifications: Real-time updates, email notifications",
        icon: Microscope
      },
      {
        id: 4,
        text: "Solve Sub-Problems",
        description: "Address each component separately",
        longDescription: "Implement solutions for each component",
        scenario: "Solutions:\n• User management: OAuth implementation\n• Content: AWS S3 for storage\n• Interactions: WebSocket for real-time features\n• Notifications: Push notification service",
        icon: Workflow
      },
      {
        id: 5,
        text: "Combine Solutions",
        description: "Integrate all parts together",
        longDescription: "Integrate all components into a cohesive application",
        scenario: "Integration:\n• Connect all systems through API gateway\n• Implement consistent UI/UX\n• Test component interactions\n• Deploy complete solution",
        icon: Component
      }
    ]
  },
  algorithm: {
    title: "Image Recognition System",
    phases: [
      {
        id: 1,
        text: "Identify Problem",
        description: "Define the main challenge clearly",
        longDescription: "Create an AI system that can recognize objects in images",
        scenario: "Requirements:\n• Object detection\n• Multiple object recognition\n• Real-time processing\n• High accuracy",
        icon: Brain
      },
      {
        id: 2,
        text: "Break Into Parts",
        description: "Split into smaller manageable tasks",
        longDescription: "Divide the system into essential components",
        scenario: "Components:\n• Image preprocessing\n• Feature extraction\n• Object detection\n• Classification system",
        icon: SplitSquareVertical
      },
      {
        id: 3,
        text: "Analyze Components",
        description: "Study each part individually",
        longDescription: "Examine requirements for each component",
        scenario: "Analysis:\n• Preprocessing: Image scaling, normalization\n• Features: Edge detection, pattern recognition\n• Detection: Boundary detection\n• Classification: ML model selection",
        icon: Microscope
      },
      {
        id: 4,
        text: "Solve Sub-Problems",
        description: "Address each component separately",
        longDescription: "Implement solutions for each component",
        scenario: "Solutions:\n• Preprocessing: OpenCV pipeline\n• Features: CNN architecture\n• Detection: YOLO algorithm\n• Classification: Transfer learning",
        icon: Workflow
      },
      {
        id: 5,
        text: "Combine Solutions",
        description: "Integrate all parts together",
        longDescription: "Combine components into a complete system",
        scenario: "Integration:\n• Pipeline construction\n• Performance optimization\n• Error handling\n• System deployment",
        icon: Component
      }
    ]
  },
  dataAnalysis: {
    title: "Customer Behavior Analysis",
    phases: [
      {
        id: 1,
        text: "Identify Problem",
        description: "Define the main challenge clearly",
        longDescription: "Analyze customer behavior patterns to improve sales",
        scenario: "Objectives:\n• Purchase pattern analysis\n• Customer segmentation\n• Churn prediction\n• Revenue optimization",
        icon: Brain
      },
      {
        id: 2,
        text: "Break Into Parts",
        description: "Split into smaller manageable tasks",
        longDescription: "Break down the analysis into key areas",
        scenario: "Components:\n• Data collection\n• Data cleaning\n• Pattern analysis\n• Predictive modeling",
        icon: SplitSquareVertical
      },
      {
        id: 3,
        text: "Analyze Components",
        description: "Study each part individually",
        longDescription: "Examine each analysis component",
        scenario: "Analysis:\n• Data sources identification\n• Data quality assessment\n• Statistical methods selection\n• Model requirements",
        icon: Microscope
      },
      {
        id: 4,
        text: "Solve Sub-Problems",
        description: "Address each component separately",
        longDescription: "Implement solutions for each component",
        scenario: "Solutions:\n• ETL pipeline setup\n• Data cleaning scripts\n• Statistical analysis\n• ML model implementation",
        icon: Workflow
      },
      {
        id: 5,
        text: "Combine Solutions",
        description: "Integrate all parts together",
        longDescription: "Combine analyses into actionable insights",
        scenario: "Integration:\n• Dashboard creation\n• Automated reporting\n• Recommendation system\n• Implementation strategy",
        icon: Component
      }
    ]
  }
} as const;

type ScenarioKey = keyof typeof SCENARIOS;

export default function DecompositionDemo() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('webApp');
  const [expanded, setExpanded] = useState<number | null>(null);

  const { phases, title } = SCENARIOS[selectedScenario];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 rounded-xl shadow-lg transition-colors duration-300">
      <div className="mb-6 md:mb-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
          Problem Decomposition
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
          Break down complex problems into manageable pieces using this systematic approach
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.entries(SCENARIOS) as [ScenarioKey, ScenarioData][]).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedScenario(key);
                setExpanded(null);
              }}
              className={`
                px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300
                ${selectedScenario === key
                  ? 'bg-blue-500/90 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'}
                hover:scale-105 active:scale-95
              `}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {phases.map((phase: Phase, idx: number) => (
          <div
            key={phase.id}
            className="group"
          >
            <div
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className={`
                relative p-4 md:p-6 rounded-xl cursor-pointer
                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                shadow-sm hover:shadow-md transition-all duration-300
                border border-gray-100 dark:border-gray-700
                ${expanded === idx ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-800/50 dark:group-hover:to-indigo-800/50 transition-colors duration-300">
                  <phase.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {phase.text}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                    {phase.description}
                  </p>
                </div>

                <ChevronRight className={`
                  w-5 h-5 text-gray-400 dark:text-gray-600 transition-transform duration-300 ease-in-out
                  ${expanded === idx ? 'rotate-90' : 'group-hover:translate-x-1'}
                `} />
              </div>

              <div className={`
                grid transition-all duration-300 ease-in-out
                ${expanded === idx ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}
              `}>
                <div className="overflow-hidden">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-800/50 dark:to-indigo-900/30 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                      {phase.longDescription}
                    </p>
                    <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-white/80 dark:bg-gray-900/50 p-3 rounded-lg">
                      {phase.scenario}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}