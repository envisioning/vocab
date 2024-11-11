"use client";

import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { RelatedArticle } from "@/types/article";

interface RelatedArticlesProps {
  slug: string;
}

export default function RelatedArticles({ slug }: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchRelatedArticles() {
      try {
        const response = await fetch(
          `/vocab/api/articles/related?slug=${slug}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch related articles");
        }

        const data = await response.json();
        if (isMounted) {
          setRelatedArticles(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch related articles:", err);
          setError("Failed to load related articles");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRelatedArticles();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-8 pt-8 animate-pulse">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 mt-8 pt-8">{error}</div>;
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8">
      <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {relatedArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            metricType="similarity"
            size="compact"
          />
        ))}
      </div>
    </div>
  );
}
