"use client";

import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ArticleListProps {
  initialArticles: Article[];
  sortField: "name" | "year" | "generality";
  sortOrder: "asc" | "desc";
}

export default function ArticleList({
  initialArticles,
  sortField,
  sortOrder,
}: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 24;
  const pathname = usePathname();
  const [hasTrackedEnd, setHasTrackedEnd] = useState(false);

  useEffect(() => {
    setArticles(initialArticles);
    setCurrentPage(1);
    setHasMore(true);
    setHasTrackedEnd(false);
    setError(null);
  }, [initialArticles, sortField, sortOrder]);

  const loadMoreArticles = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);
      const nextPage = currentPage + 1;

      const url = new URL("/vocab/api/articles", window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", articlesPerPage.toString());
      url.searchParams.set("sortBy", sortField);
      url.searchParams.set("sortOrder", sortOrder);

      console.log("Fetching more articles:", url.toString());

      const response = await fetch(url.toString());
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const newArticles: Article[] = await response.json();
      console.log("Received new articles:", newArticles);

      if (Array.isArray(newArticles) && newArticles.length > 0) {
        setArticles((prev) => [...prev, ...newArticles]);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      setError("Failed to load more articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1000
      ) {
        if (!isLoading && hasMore && !error) {
          loadMoreArticles();
        } else if (!hasMore && !hasTrackedEnd) {
          const eventData = {
            props: {
              totalArticles: articles.length,
            },
          };

          if (typeof plausible !== "undefined") {
            plausible("Reached Bottom", eventData);
          }

          setHasTrackedEnd(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    isLoading,
    hasMore,
    error,
    hasTrackedEnd,
    articles.length,
    sortField,
    sortOrder,
  ]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {articles?.map((article, index) => (
          <ArticleCard key={`${article.slug}-${index}`} article={article} />
        ))}
      </div>
      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!hasMore && !error && <div className="text-center py-4">&nbsp;</div>}
    </>
  );
}
