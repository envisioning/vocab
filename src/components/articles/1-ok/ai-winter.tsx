"use client";

import React, { useState } from "react";
import {
  Snowflake,
  Sun,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertTriangle,
  TrendingDown,
  ArrowUpCircle,
} from "lucide-react";

const TimelineEvent = ({
  year,
  title,
  description,
  isExpanded,
  onToggle,
  icon: Icon,
  isWinter,
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 rounded-lg transition-colors duration-200 flex items-start gap-4 ${
          isWinter
            ? "bg-blue-50 hover:bg-blue-100"
            : "bg-orange-50 hover:bg-orange-100"
        }`}
      >
        <div
          className={`p-2 rounded-full ${
            isWinter ? "bg-blue-100" : "bg-orange-100"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              isWinter ? "text-blue-600" : "text-orange-600"
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{year}</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <h3 className="font-bold mt-1">{title}</h3>
        </div>
      </button>
      {isExpanded && (
        <div className="mt-2 ml-16 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};

const AIWinterExplainer = () => {
  const [expandedId, setExpandedId] = useState(null);

  const events = [
    {
      id: 1,
      year: "1956-1969",
      title: "The Golden Years",
      description:
        "Early AI pioneers made bold predictions about machine intelligence. Significant funding flowed into AI research with high expectations.",
      icon: Sun,
      isWinter: false,
    },
    {
      id: 2,
      year: "1970-1980",
      title: "First AI Winter",
      description:
        "Limitations of existing AI approaches became apparent. The Lighthill Report led to reduced funding in Britain, and DARPA cut funding in the US.",
      icon: Snowflake,
      isWinter: true,
    },
    {
      id: 3,
      year: "1980-1987",
      title: "Expert Systems Boom",
      description:
        "Commercial interest in expert systems brought new investment and optimism to the field.",
      icon: ArrowUpCircle,
      isWinter: false,
    },
    {
      id: 4,
      year: "1987-1993",
      title: "Second AI Winter",
      description:
        "Expert systems proved too costly to maintain and couldn't scale. The AI business bubble burst, leading to another period of reduced funding.",
      icon: TrendingDown,
      isWinter: true,
    },
    {
      id: 5,
      year: "1993-Present",
      title: "Modern Era",
      description:
        "AI has seen steady progress with more realistic expectations. Machine learning and deep learning have brought practical applications.",
      icon: Brain,
      isWinter: false,
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-bold">AI Winter</h2>
        </div>
        <p className="text-gray-700">
          AI Winters were periods when enthusiasm and funding for artificial
          intelligence research declined dramatically. These cycles were often
          triggered by unmet expectations and limitations of the technology at
          the time.
        </p>
      </div>

      <div className="mt-8">
        {events.map((event) => (
          <TimelineEvent
            key={event.id}
            {...event}
            isExpanded={expandedId === event.id}
            onToggle={() =>
              setExpandedId(expandedId === event.id ? null : event.id)
            }
          />
        ))}
      </div>

      <div className="mt-6 flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-blue-600" />
          <span>AI Winter Period</span>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-orange-600" />
          <span>Growth Period</span>
        </div>
      </div>
    </div>
  );
};

export default AIWinterExplainer;
