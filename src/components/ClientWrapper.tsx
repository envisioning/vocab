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

export default function ClientWrapper({
  articles,
  displayMode,
  showList,
}: ClientWrapperProps) {
  return <div>{showList && <ArticleList initialArticles={articles} />}</div>;
}
