"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import { useRouter, useSearchParams } from "next/navigation";
import FilterBarWrapper from "./FilterBarWrapper";

interface ArticleListProps {
  initialArticles: Article[];
}

export default function ArticleList({ initialArticles }: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialArticles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
