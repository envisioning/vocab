"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleList from "./ArticleList";
import clsx from "clsx";

interface ClientWrapperProps {
  articles: Article[];
  displayMode: "full" | "suggestions";
  showList: boolean;
}

type SortField = "name" | "year" | "generality";
type SortOrder = "asc" | "desc";

export default function ClientWrapper({
  articles,
  displayMode,
  showList,
}: ClientWrapperProps) {
  const [sortField, setSortField] = useState<SortField>("generality");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortedArticles, setSortedArticles] = useState<Article[]>(articles);

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
    setSortOrder(field === "generality" ? "desc" : "asc");
  };

  const fetchSortedArticles = async () => {
    try {
      const url = new URL("/vocab/api/articles", window.location.origin);
      url.searchParams.set("page", "1");
      url.searchParams.set("limit", "24");
      url.searchParams.set("sortBy", sortField);
      url.searchParams.set("sortOrder", sortOrder);

      const response = await fetch(url.toString());
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSortedArticles(data);
    } catch (error) {
      console.error("Error fetching sorted articles:", error);
    }
  };

  useEffect(() => {
    fetchSortedArticles();
  }, [sortField, sortOrder]);

  return (
    <div>
      {displayMode === "full" && (
        <div className="flex justify-end mb-4 items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Sort:</span>
              <div className="flex items-center space-x-2">
                {["name", "year", "generality"].map((field) => (
                  <button
                    key={field}
                    onClick={() => handleSortFieldChange(field as SortField)}
                    className={clsx(
                      "px-2 py-1 rounded transition-colors text-gray-600 hover:text-gray-900",
                      sortField === field &&
                        "underline underline-offset-4 font-medium"
                    )}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-gray-300">•</span>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Order:</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSortOrder("asc")}
                  className={clsx(
                    "px-2 py-1 rounded transition-colors text-gray-600 hover:text-gray-900",
                    sortOrder === "asc" && "underline underline-offset-4"
                  )}
                  aria-label="Sort Ascending"
                >
                  ↑
                </button>
                <button
                  onClick={() => setSortOrder("desc")}
                  className={clsx(
                    "px-2 py-1 rounded transition-colors text-gray-600 hover:text-gray-900",
                    sortOrder === "desc" && "underline underline-offset-4"
                  )}
                  aria-label="Sort Descending"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showList && (
        <ArticleList
          initialArticles={sortedArticles}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
}
