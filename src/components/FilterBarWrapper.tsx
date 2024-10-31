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

  // Optimize debouncing to prevent unnecessary URL updates
  const debouncedHandleSearch = useCallback(
    debounce((value: string) => {
      // Only update URL if there's a meaningful search
      if (value.length === 0 || value.length > 1) {
        const params = new URLSearchParams(searchParams);
        if (value) {
          params.set("q", value);
        } else {
          params.delete("q");
        }
        // Use replace instead of push to avoid adding to history stack
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 300), // You could reduce debounce time since we're not hitting server
    [pathname, router, searchParams]
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

  // Add this new function to handle search prioritization
  const getSearchPriority = useCallback((title: string, searchTerm: string) => {
    // Exact match (case insensitive)
    if (title.toLowerCase() === searchTerm.toLowerCase()) {
      return 0;
    }
    // Acronym match (all caps terms)
    if (
      /^[A-Z0-9\s()-]+$/.test(title) &&
      title.includes(searchTerm.toUpperCase())
    ) {
      return 1;
    }
    // Partial match
    return 2;
  }, []);

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      allArticles={articles}
      isHomeRoute={pathname === "/"}
      getSearchPriority={getSearchPriority} // Pass the new function
    />
  );
}
