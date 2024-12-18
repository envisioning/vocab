"use client";

import { useEffect, useState, KeyboardEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  allArticles: Article[];
  isHomeRoute: boolean;
  getSearchPriority: (title: string, searchTerm: string) => number;
  filteredArticles: Article[];
  filteredAuthors: string[];
}

// Add this new component above FilterBar
function TopNavigation() {
  return (
    <div className="hidden sm:block bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <Link
            href="https://envisioning.io"
            className="flex items-center gap-2"
          >
            <Image
              src="/vocab/envisioning.svg"
              alt="Envisioning Logo"
              width={30}
              height={30}
              className="w-8 h-8 sm:w-6 sm:h-6"
            />
            <span className="font-medium text-gray-900 text-sm sm:text-base">
              Envisioning
            </span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              href="https://envisioning.io"
              className="text-gray-900 py-1 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="https://envisioning.io/services"
              className="text-gray-900 py-1 hover:text-gray-900"
            >
              Services
            </Link>
            <Link
              href="https://envisioning.io/work"
              className="text-gray-900 py-1 hover:text-gray-900"
            >
              Work
            </Link>
            <Link
              href="https://envisioning.io/signals"
              className="text-gray-900 py-1 hover:text-gray-900"
            >
              Signals
            </Link>

            <Link
              href="https://vocab.envisioning.io"
              className="px-2 py-1 rounded bg-[#D6F248] text-gray-900"
            >
              Vocab
            </Link>
            <Link
              href="https://envisioning.io/about"
              className="text-gray-900 py-1 hover:text-gray-900"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
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
  filteredAuthors,
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

  // Helper to determine if current selection is an author
  const isAuthorSelected = (index: number) => {
    return index >= 0 && index < filteredAuthors.length;
  };

  // Helper to determine if current selection is an article
  const isArticleSelected = (index: number) => {
    return (
      index >= filteredAuthors.length &&
      index < filteredAuthors.length + filteredArticles.length
    );
  };

  // Get the article index when an article is selected
  const getArticleIndex = (index: number) => {
    return index - filteredAuthors.length;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const totalItems = filteredAuthors.length + filteredArticles.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        setShowResults(true);
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (isAuthorSelected(selectedIndex)) {
            // Handle author selection
            const author = filteredAuthors[selectedIndex];
            router.push(
              `/contributors/${author.toLowerCase().replace(/\s+/g, "-")}`
            );
            setShowResults(false);
            setSelectedIndex(-1);
          } else if (isArticleSelected(selectedIndex)) {
            // Handle article selection
            const articleIndex = getArticleIndex(selectedIndex);
            handleSelection(filteredArticles[articleIndex]);
          }
        } else if (totalItems > 0) {
          // If no item is selected but results exist, select the first item
          if (filteredAuthors.length > 0) {
            // First result is an author
            const author = filteredAuthors[0];
            router.push(
              `/contributors/${author.toLowerCase().replace(/\s+/g, "-")}`
            );
          } else if (filteredArticles.length > 0) {
            // First result is an article
            handleSelection(filteredArticles[0]);
          }
          setShowResults(false);
          setSelectedIndex(-1);
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
    <>
      <TopNavigation />
      <div
        className="sticky top-0 bg-white shadow-md p-2 sm:p-4 z-10 mb-6"
        role="search"
        aria-label="Filter articles"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center">
                  <span className="font-medium text-gray-900 underline text-sm sm:text-base">
                    Vocab
                  </span>
                </Link>
              </div>

              <NavLinks isMobile={true} />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <form
                className="relative flex-1 min-w-0 sm:min-w-[300px]"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  className="px-3 sm:px-4 py-2 border rounded-lg w-full pr-16 sm:pr-24 text-sm sm:text-base
                    bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search"
                  autoComplete="off"
                />

                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500">
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

                {showResults && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {filteredAuthors.length > 0 && (
                      <div className="border-b">
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Authors
                        </div>
                        {filteredAuthors.map((author, index) => (
                          <Link
                            key={author}
                            href={`/contributors/${author
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className={`block px-4 py-2 hover:bg-gray-100
                              ${index === selectedIndex ? "bg-blue-50" : ""}`}
                            onClick={() => {
                              setShowResults(false);
                              setSelectedIndex(-1);
                            }}
                          >
                            <span className="text-gray-900">{author}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {filteredArticles.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Articles
                        </div>
                        {filteredArticles.map((article, index) => (
                          <Link
                            key={article.slug}
                            href={`/${article.slug}`}
                            className={`block px-4 py-2 hover:bg-gray-100
                              ${
                                index + filteredAuthors.length === selectedIndex
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelection(article);
                            }}
                          >
                            <span className="text-gray-900">
                              {article.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form>

              <div className="hidden sm:flex items-center gap-4">
                <NavLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Extract navigation links to a separate component
function NavLinks({ isMobile = false }: { isMobile?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/grid", label: "Grid" },
    { href: "/node-graph", label: "Graph" },
    { href: "/sunflower", label: "Sunflower" },
    { href: "/about", label: "Info" },
  ];

  if (isMobile) {
    return (
      <div className="sm:hidden relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={24} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 text-sm text-gray-700 
                  hover:bg-gray-100
                  ${pathname === link.href ? "bg-gray-50" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-gray-600 
            hover:text-gray-900 transition-colors
            ${pathname === link.href ? "text-gray-900" : ""}`}
          aria-label={link.label}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
