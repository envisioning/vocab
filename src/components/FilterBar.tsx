"use client";

import { useEffect, useState, KeyboardEvent } from "react";
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
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  allArticles = [], // Provide default empty array
  isHomeRoute,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);

  // Calculate matching articles (with null check)
  const matchingArticles =
    allArticles?.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const hitCount = matchingArticles.length;
  const totalCount = allArticles?.length || 0;
  const isFiltered = searchTerm;

  const handleClear = () => {
    onSearchChange("");
    setSelectedIndex(-1);
    setShowResults(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!searchTerm) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < matchingArticles.length - 1 ? prev + 1 : prev
        );
        setShowResults(true);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && matchingArticles[selectedIndex]) {
          const selected = matchingArticles[selectedIndex];
          onSearchChange(selected.title); // Set the search term to the selected article's title
          router.push(`/${selected.slug}`);
          setShowResults(false);
        }
        break;
      case "Escape":
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Reset selection when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
    setShowResults(!!searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    // Update URL with search term
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="sticky top-0 bg-white shadow-md p-4 z-10 mb-6"
      role="search"
      aria-label="Filter articles"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 items-center relative">
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

          {/* Show search on all routes */}
          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              placeholder="Search articles..."
              className="px-4 py-2 border rounded-lg w-full pr-24"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search articles"
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
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {matchingArticles.map((article, index) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className={`block px-4 py-2 hover:bg-gray-100 ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      onSearchChange(article.title); // Set the search term to the clicked article's title
                      setShowResults(false);
                    }}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Only show sort on home route */}
          {isHomeRoute && (
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2 border rounded-lg min-w-[150px]"
              aria-label="Sort articles"
            >
              <option value="g">Sort by Generality</option>
              <option value="a">Sort Alphabetically</option>
            </select>
          )}

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
