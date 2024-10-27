"use client";

import React, { useState } from "react";
import { Article } from "@/types/article";
import FilterBarWrapper from "./FilterBarWrapper";
import ArticleList from "./ArticleList";

interface ClientWrapperProps {
  articles: Article[];
  displayMode?: "suggestions" | "full";
  showList?: boolean;
}

export default function ClientWrapper({
  articles,
  displayMode = "full",
  showList = true,
}: ClientWrapperProps) {
  const [filteredArticles, setFilteredArticles] = useState(articles);

  return (
    <div>
      <FilterBarWrapper
        allArticles={articles}
        onFilterChange={setFilteredArticles}
        displayMode={displayMode}
      />
      {showList && <ArticleList articles={filteredArticles} />}
    </div>
  );
}
