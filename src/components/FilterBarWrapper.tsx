"use client";

import { useState, useEffect, useRef } from "react";
import { Article } from "@/types/article";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterBarWrapperProps {
  allArticles: Article[];
  displayMode?: "suggestions" | "full";
}

export default function FilterBarWrapper({
  allArticles,
  displayMode = "suggestions",
}: FilterBarWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  // Add new state for controlling suggestion visibility
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Add state for keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Get unique categories from all articles
  const categories = Array.from(
    new Set(allArticles.flatMap((article) => article.category))
  ).sort();

  // Modified filtered articles logic
  const filteredArticles = allArticles
    .filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || article.category.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by generality (shorter terms are usually more general)
      return a.title.length - b.title.length;
    });

  // Add ref for input element
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = filteredArticles.slice(0, 5);

    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            const selectedArticle = suggestions[selectedIndex];
            window.location.assign(`/${selectedArticle.slug}`);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    }
  };

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);

    const newUrl =
      pathname + (params.toString() ? `?${params.toString()}` : "");
    router.push(newUrl);
  }, [searchTerm, selectedCategory, pathname, router]);

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search AI terms... (⌘K)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 1);
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 
                     dark:bg-gray-800 dark:text-white focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
          />

          {/* Move suggestions inside input container and adjust positioning */}
          {displayMode === "suggestions" &&
            showSuggestions &&
            searchTerm.length > 1 && (
              <div className="absolute left-0 right-0 mt-1 z-20 border rounded-lg shadow-lg overflow-hidden">
                {filteredArticles.slice(0, 5).map((article, index) => (
                  <div
                    key={article.slug}
                    className={`p-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 
                             hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                             ${
                               index === selectedIndex
                                 ? "bg-blue-50 dark:bg-blue-900 border-l-4 border-l-blue-500"
                                 : ""
                             }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.assign(`/${article.slug}`);
                    }}
                  >
                    <h3 className="font-semibold dark:text-white">
                      {article.title}
                    </h3>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 
                   dark:bg-gray-800 dark:text-white focus:outline-none 
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Results Count */}
        <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
          {filteredArticles.length} terms found
        </div>
      </div>
    </div>
  );
}
