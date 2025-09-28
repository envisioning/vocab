"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

interface FilterBarWrapperProps {
  articles: Article[];
}

export default function FilterBarWrapper({ articles }: FilterBarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("zap");
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!searchTerm) return { articles };

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

    return { articles: filteredArticles };
  }, [articles, searchTerm]);

  // Always render the same structure, just without theme classes before mount
  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={articles}
      filteredArticles={filteredResults.articles}
      isHomeRoute={isHomeRoute}
      getSearchPriority={getSearchPriority}
    />
  );
}
