"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

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
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search AI terms..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.length > 1);
          }}
          className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 
                   dark:bg-gray-800 dark:text-white focus:outline-none 
                   focus:ring-2 focus:ring-blue-500"
        />

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

      {/* Suggestions dropdown */}
      {displayMode === "suggestions" &&
        showSuggestions &&
        searchTerm.length > 1 && (
          <div className="absolute mt-1 w-full max-w-lg z-20">
            {filteredArticles.slice(0, 5).map((article) => (
              <div
                key={article.slug}
                className="p-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700 
                         hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => router.push(`/${article.slug}`)}
              >
                <h3 className="font-semibold dark:text-white">
                  {article.title}
                </h3>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
