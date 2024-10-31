"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

interface FilterBarWrapperProps {
  articles: Article[];
}

export default function FilterBarWrapper({ articles }: FilterBarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("g");
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";

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

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;

    const searchLower = searchTerm.toLowerCase();
    return articles
      .filter((article) => {
        const titleLower = article.title.toLowerCase();
        return titleLower.includes(searchLower);
      })
      .sort((a, b) => {
        // First sort by search priority
        const priorityA = getSearchPriority(a.title, searchTerm);
        const priorityB = getSearchPriority(b.title, searchTerm);
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        // If priorities are equal, sort alphabetically
        return a.title.localeCompare(b.title);
      });
  }, [articles, searchTerm]);

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={articles}
      filteredArticles={filteredArticles}
      isHomeRoute={isHomeRoute}
      getSearchPriority={getSearchPriority}
    />
  );
}
