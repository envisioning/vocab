"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";
import debounce from "lodash/debounce";

interface FilterBarWrapperProps {
  articles: Article[];
}

export default function FilterBarWrapper({ articles }: FilterBarWrapperProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortOption, setSortOption] = useState("g");
  const pathname = usePathname();
  const router = useRouter();

  // Update search term when URL changes
  useEffect(() => {
    const currentSearchTerm = searchParams.get("q") || "";
    setSearchTerm(currentSearchTerm);
  }, [searchParams]);

  // Create a debounced version of the search handler
  const debouncedHandleSearch = useCallback(
    debounce((value: string) => {
      if (value.length === 0 || value.length > 1) {
        const newUrl = value
          ? `${pathname}?q=${encodeURIComponent(value)}`
          : pathname;
        router.push(newUrl);
      }
    }, 750),
    [pathname, router]
  );

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length === 0 || value.length > 1) {
      debouncedHandleSearch(value);
    }
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
