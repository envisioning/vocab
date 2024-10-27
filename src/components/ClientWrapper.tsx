"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleList from "./ArticleList";
import { useSearchParams } from "next/navigation";

interface ClientWrapperProps {
  articles: Article[];
  displayMode: "full" | "suggestions";
  showList: boolean;
}

export default function ClientWrapper({
  articles,
  displayMode,
  showList,
}: ClientWrapperProps) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showList) return null;

  return <ArticleList articles={filteredArticles} displayMode={displayMode} />;
}
