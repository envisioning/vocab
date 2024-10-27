"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

interface FilterBarWrapperProps {
  articles: Article[];
}

export default function FilterBarWrapper({ articles }: FilterBarWrapperProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortOption, setSortOption] = useState("g");
  const pathname = usePathname();

  // Update search term when URL changes
  useEffect(() => {
    const currentSearchTerm = searchParams.get("q") || "";
    setSearchTerm(currentSearchTerm);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (value: string) => {
    setSortOption(value);
  };

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={articles}
      isHomeRoute={pathname === "/"}
    />
  );
}
