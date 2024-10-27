"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/types/article";
import Image from "next/image";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  allArticles: Article[];
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  allArticles,
}: FilterBarProps) {
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && searchTerm.length > 0 && allArticles.length > 0) {
      const filtered = allArticles.filter((article) =>
        article.categories.some((cat) =>
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to top 5 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, allArticles, pathname]);

  // Calculate number of hits for both search and category
  const matchingArticles = allArticles.filter((article) => {
    if (selectedCategory) {
      return article.categories.includes(selectedCategory);
    }
    return searchTerm
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  const hitCount = matchingArticles.length;
  const totalCount = allArticles.length;
  const isFiltered = searchTerm || selectedCategory;

  const categoryLabels: {
    [key: string]: { label: string; description: string };
  } = {
    CORE: {
      label: "CORE",
      description: "foundational AI concepts, base algorithms",
    },
    ARCH: {
      label: "ARCH",
      description: "architecture, components, models",
    },
    IMPL: {
      label: "IMPL",
      description: "tools, infrastructure, practical implementation",
    },
    DATA: {
      label: "DATA",
      description: "data processing, handling, patterns",
    },
    MATH: {
      label: "MATH",
      description: "mathematical & statistical foundations",
    },
    GOV: {
      label: "GOV",
      description: "governance, ethics, safety, societal impact",
    },
    BIO: {
      label: "BIO",
      description: "biological, neural, cognitive inspiration",
    },
  };

  const handleCategorySelect = (key: string) => {
    console.log("Category selected:", key);
    console.log(
      "Current categories in articles:",
      allArticles.map((a) => a.categories)
    );

    if (key === selectedCategory) {
      onCategoryChange("");
      onSearchChange("");
    } else {
      onCategoryChange(key);
      // Don't set search term when selecting category
      onSearchChange("");
    }
    setShowCategories(false);
  };

  const handleClear = () => {
    onSearchChange("");
    onCategoryChange("");
  };

  return (
    <div
      className="sticky top-0 bg-white shadow-md p-4 z-10 mb-6"
      role="search"
      aria-label="Filter articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center relative">
          {/* Add logo and text */}
          <Link href="/" className="flex items-center gap-2 min-w-[120px]">
            <Image
              src="/envisioning.svg"
              alt="Envisioning Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="font-medium text-gray-900">Vocab</span>
          </Link>

          {/* Existing search input wrapper */}
          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search articles..."
              className="px-4 py-2 border rounded-lg w-full pr-24"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                if (searchTerm === "") {
                  setShowCategories(true);
                  setShowSuggestions(false);
                } else if (pathname !== "/") {
                  setShowSuggestions(true);
                  setShowCategories(false);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow click
                setTimeout(() => {
                  setShowSuggestions(false);
                  setShowCategories(false);
                }, 100);
              }}
              aria-label="Search articles"
            />

            {/* Always show counter, with different text based on filter state */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {isFiltered
                ? `${hitCount} ${hitCount === 1 ? "match" : "matches"}`
                : `${totalCount} ${totalCount === 1 ? "entry" : "entries"}`}
            </div>

            {/* Clear button */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category suggestions */}
          {showCategories && searchTerm === "" && (
            <ul className="absolute left-0 top-full bg-white border rounded-lg mt-1 w-full max-w-lg z-20 shadow-lg">
              {Object.entries(categoryLabels).map(
                ([key, { label, description }]) => (
                  <li
                    key={key}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedCategory === key ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleCategorySelect(key)}
                  >
                    <div className="flex justify-center">
                      <span className="text-gray-900">{label}</span>
                      <span className="text-gray-500 ml-2">{description}</span>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}

          {/* Search suggestions - update this one too for consistency */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full bg-white border rounded-lg mt-1 w-full max-w-lg z-20 shadow-lg">
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

          {/* Keep sort dropdown, remove category dropdown */}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            aria-label="Sort articles"
          >
            <option value="g">Sort by Generality</option>
            <option value="a">Sort Alphabetically</option>
          </select>
        </div>
      </div>
    </div>
  );
}
