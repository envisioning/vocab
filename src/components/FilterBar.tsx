"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/types/article";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories?: string[];
  allArticles?: Article[]; // Add this line for type-ahead
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  allArticles = [],
}: FilterBarProps) {
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && searchTerm.length > 0 && allArticles.length > 0) {
      const filtered = allArticles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to top 5 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, allArticles, pathname]);

  return (
    <div
      className="sticky top-0 bg-white shadow-md p-4 z-10 mb-6"
      role="search"
      aria-label="Filter articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="px-4 py-2 border rounded-lg flex-grow min-w-[200px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              if (pathname !== "/") setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay hiding to allow click
              setTimeout(() => setShowSuggestions(false), 100);
            }}
            aria-label="Search articles"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute bg-white border rounded-lg mt-12 w-full max-w-lg z-20">
              {suggestions.map((article) => (
                <li key={article.slug} className="px-4 py-2 hover:bg-gray-100">
                  <Link
                    href={`/${article.slug}`}
                    onClick={() => setShowSuggestions(false)}
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            aria-label="Sort articles"
          >
            <option value="g">Sort by Generality</option>
            <option value="a">Sort Alphabetically</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
