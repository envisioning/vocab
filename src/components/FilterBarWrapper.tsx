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

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;

    const searchLower = searchTerm.toLowerCase();
    return articles
      .filter((article) => {
        const titleLower = article.title.toLowerCase();
        return titleLower.includes(searchLower);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
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
      getSearchPriority={(title, term) => 0}
    />
  );
}
