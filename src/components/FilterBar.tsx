"use client";

import { useEffect, useState, KeyboardEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  allArticles: Article[];
  isHomeRoute: boolean;
  getSearchPriority: (title: string, searchTerm: string) => number;
  filteredArticles: Article[];
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  allArticles = [], // Provide default empty array
  isHomeRoute,
  getSearchPriority,
  filteredArticles,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to check if a title is an acronym with explanation
  const isAcronym = (title: string): boolean => {
    // Check if title contains parentheses and the text before it is all caps
    const match = title.match(/^([^(]+)(\s*\(.*\))?$/);
    if (match) {
      const mainText = match[1].trim();
      return mainText === mainText.toUpperCase() && mainText.length > 1;
    }
    return false;
  };

  const hitCount = filteredArticles.length;
  const totalCount = allArticles?.length || 0;
  const isFiltered = searchTerm;

  const handleClear = () => {
    onSearchChange("");
    setSelectedIndex(-1);
    setShowResults(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredArticles.length - 1 ? prev + 1 : prev
        );
        setShowResults(true);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredArticles[selectedIndex]) {
          const selected = filteredArticles[selectedIndex];
          handleSelection(selected);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Separate the selection handling from the search
  const handleSelection = (article: Article) => {
    setShowResults(false);
    setSelectedIndex(-1);
    router.push(`/${article.slug}`);
  };

  // Keep search purely local
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setShowResults(!!value);
    setSelectedIndex(-1);
  };

  // Add keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // Prevent default browser behavior
        inputRef.current?.focus();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown as any);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
    };
  }, []);

  return (
    <div
      className="sticky top-0 bg-white shadow-md p-4 z-10 mb-6"
      role="search"
      aria-label="Filter articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center relative">
          <Link
            href="https://envisioning.io"
            className="flex items-center gap-2"
          >
            <Image
              src="/vocab/envisioning.svg"
              alt="Envisioning Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="font-medium text-gray-900">Envisioning /</span>
          </Link>

          <Link href="/vocab" className="flex items-center gap-2">
            <span className="font-medium text-gray-900 underline">Vocab</span>
          </Link>

          {/* Show search on all routes */}
          <form
            className="relative flex-grow min-w-[200px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-lg w-full pr-24"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search"
              autoComplete="off"
            />

            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {isFiltered
                ? `${hitCount} ${hitCount === 1 ? "match" : "matches"}`
                : `${totalCount} ${totalCount === 1 ? "entry" : "entries"}`}
            </div>

            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {filteredArticles.map((article, index) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelection(article);
                    }}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            )}
          </form>

          <Link
            href="/about"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="About"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
