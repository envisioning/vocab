"use client";

import React, { useState } from "react";
import Link from "next/link";
import papers from "@/data/txyz-papers.json";
import { usePlausible } from "next-plausible";

interface Paper {
  title: string;
  link: string;
  number_of_citations?: number | null;
  authors: string[];
}

interface RelatedPapersProps {
  slug: string;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

export default function RelatedPapers({ slug }: RelatedPapersProps) {
  const [showAll, setShowAll] = useState(false);
  const plausible = usePlausible();

  const paperData = papers.find((p) => p.slug === slug)?.search_results
    ?.results;

  if (!paperData || paperData.length === 0) {
    return null;
  }

  // Filter out papers with no citations and sort by citation count
  const sortedPapers = paperData
    .filter((paper) => paper.number_of_citations !== null)
    .sort((a, b) => {
      const citesA = a.number_of_citations || 0;
      const citesB = b.number_of_citations || 0;
      return citesB - citesA;
    });

  if (sortedPapers.length === 0) {
    return null;
  }

  const displayPapers = showAll ? sortedPapers : sortedPapers.slice(0, 5);

  const handleLoadMore = () => {
    setShowAll(true);
    plausible("load-more-papers", {
      props: {
        slug,
        total_papers: sortedPapers.length,
      },
    });
  };

  return (
    <div className="mt-8 pt-8">
      <h2 className="text-2xl font-bold mb-4">Academic Papers</h2>
      <div className="space-y-4">
        {displayPapers.map((paper, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Link
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-blue-600"
              onClick={() => {
                plausible("paper-click", {
                  props: {
                    slug,
                    paper_title: paper.title,
                    citations: paper.number_of_citations,
                  },
                });
              }}
            >
              <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
              <div className="text-sm text-gray-600">
                {paper.authors.join(", ")}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {paper.number_of_citations !== null && (
                  <span>
                    {formatNumber(paper.number_of_citations)} citations
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!showAll && sortedPapers.length > 5 && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Show {sortedPapers.length - 5} More Papers
        </button>
      )}
    </div>
  );
}
