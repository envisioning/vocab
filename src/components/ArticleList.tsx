"use client";

import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";

interface ArticleListProps {
  articles: Article[];
  displayMode: "full" | "suggestions";
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
