"use client";

import { useState, useEffect, Suspense } from "react";
import { Article } from "@/types/article";
import ArticleList from "./ArticleList";
import { useSearchParams } from "next/navigation";

interface ClientWrapperProps {
  articles: Article[];
  displayMode: "full" | "suggestions";
  showList: boolean;
}

function ClientContent({
  articles,
  displayMode,
}: Omit<ClientWrapperProps, "showList">) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <ArticleList articles={filteredArticles} displayMode={displayMode} />;
}

export default function ClientWrapper({
  articles,
  displayMode,
  showList,
}: ClientWrapperProps) {
  if (!showList) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientContent articles={articles} displayMode={displayMode} />
    </Suspense>
  );
}
