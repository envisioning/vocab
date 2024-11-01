"use client";

import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ArticleListProps {
  initialArticles: Article[];
}

export default function ArticleList({ initialArticles }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 24;
  const pathname = usePathname();
  const [hasTrackedEnd, setHasTrackedEnd] = useState(false);

  useEffect(() => {
    if (initialArticles) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  const loadMoreArticles = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);
      const nextPage = currentPage + 1;

      const basePath = pathname.startsWith("/vocab") ? "/vocab" : "";
      const url = new URL(`/vocab/api/articles`, window.location.origin);
      url.searchParams.set("page", nextPage.toString());
      url.searchParams.set("limit", articlesPerPage.toString());

      console.log("Attempting to fetch from:", url.toString());

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newArticles = await response.json();

      console.log("Received articles:", newArticles);

      if (Array.isArray(newArticles) && newArticles.length > 0) {
        setArticles((prev) => [...prev, ...newArticles]);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      setError("Failed to load more articles");
      setHasMore(false);
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
  }, [isLoading, hasMore, error, hasTrackedEnd, articles.length]);

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
