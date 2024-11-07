"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

// Add title case helper at the top of the file
const toTitleCase = (str: string) => {
  return str
    .split(" ")
    .map((word) => {
      // Handle special cases like "v." in names like "Quoc V. Le"
      if (word.toLowerCase() === "v.") return "V.";
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Helper function to get authors cited in multiple articles
const getFrequentAuthors = (namesData: Record<string, string[]>) => {
  const authorFrequency: Record<string, number> = {};

  // Count appearances of each author
  Object.values(namesData).forEach((authors) => {
    authors.forEach((author) => {
      // Skip 'Unknown' authors
      if (author.toLowerCase() !== "unknown") {
        authorFrequency[author] = (authorFrequency[author] || 0) + 1;
      }
    });
  });

  // Filter authors with more than 2 citations and sort alphabetically
  return Object.entries(authorFrequency)
    .filter(([_, count]) => count > 2)
    .map(([author]) => toTitleCase(author))
    .sort((a, b) => a.localeCompare(b));
};

interface FilterBarWrapperProps {
  articles: Article[];
  namesData: Record<string, string[]>;
}

export default function FilterBarWrapper({
  articles,
  namesData,
}: FilterBarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("zap");
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";

  const frequentAuthors = useMemo(
    () => getFrequentAuthors(namesData),
    [namesData]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (value: string) => {
    setSortOption(value);
  };

  const getSearchPriority = (title: string, searchTerm: string): number => {
    const titleLower = title.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    // Exact title match (highest priority)
    if (titleLower === searchLower) {
      return 3;
    }

    // Exact whole word match (second priority)
    if (titleLower.split(/\s+/).includes(searchLower)) {
      return 2;
    }

    // Acronym match (third priority)
    const titleWords = titleLower.split(/\s+/);
    const isAcronymMatch = titleWords
      .map((word) => word[0])
      .join("")
      .includes(searchLower);
    if (isAcronymMatch) {
      return 1;
    }

    // Regular partial match (lowest priority)
    return 0;
  };

  const filteredResults = useMemo(() => {
    if (!searchTerm) return { articles, authors: frequentAuthors };

    const searchLower = searchTerm.toLowerCase();

    // Filter articles
    const filteredArticles = articles
      .filter((article) => {
        const titleLower = article.title.toLowerCase();
        return titleLower.includes(searchLower);
      })
      .sort((a, b) => {
        const priorityA = getSearchPriority(a.title, searchTerm);
        const priorityB = getSearchPriority(b.title, searchTerm);
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });

    // Filter authors
    const filteredAuthors = frequentAuthors
      .filter((author) => author.toLowerCase().includes(searchLower))
      .sort((a, b) => {
        const priorityA = getSearchPriority(a, searchTerm);
        const priorityB = getSearchPriority(b, searchTerm);
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.localeCompare(b);
      });

    return { articles: filteredArticles, authors: filteredAuthors };
  }, [articles, searchTerm, frequentAuthors]);

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={articles}
      filteredArticles={filteredResults.articles}
      filteredAuthors={filteredResults.authors}
      isHomeRoute={isHomeRoute}
      getSearchPriority={getSearchPriority}
    />
  );
}
