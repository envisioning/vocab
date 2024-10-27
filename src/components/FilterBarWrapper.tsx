"use client";

import { useState } from "react";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

interface FilterBarWrapperProps {
  allArticles: Article[];
  onFilterChange: (articles: Article[]) => void;
}

export default function FilterBarWrapper({
  allArticles,
  onFilterChange,
}: FilterBarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("g");

  // Handle filter changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterArticles(value, sortOption);
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    filterArticles(searchTerm, value);
  };

  const filterArticles = (search: string, sort: string) => {
    let filtered = [...allArticles];

    if (search) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sort === "g") {
        const avgA =
          a.generality.reduce((acc, curr) => acc + curr, 0) /
          a.generality.length;
        const avgB =
          b.generality.reduce((acc, curr) => acc + curr, 0) /
          b.generality.length;
        return avgB - avgA;
      }
      return a.title.localeCompare(b.title);
    });

    onFilterChange(filtered);
  };

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={allArticles}
    />
  );
}
