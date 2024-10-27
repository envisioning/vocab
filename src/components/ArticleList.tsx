"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/article";
import ArticleCard from "./ArticleCard";
import FilterBar from "./FilterBar";
import { useRouter, useSearchParams } from "next/navigation";

interface ArticleListProps {
  initialArticles: Article[];
}

export default function ArticleList({ initialArticles }: ArticleListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters with shorter names
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortOption, setSortOption] = useState(searchParams.get("s") || "g");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("c") || ""
  );

  // Update URL when filters change using shorter parameter names
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortOption !== "g") params.set("s", sortOption);
    if (selectedCategory) params.set("c", selectedCategory);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl);
  }, [searchTerm, sortOption, selectedCategory, router]);

  const categories = [
    ...new Set(
      initialArticles.flatMap((article) =>
        Array.isArray(article.category) ? article.category : [article.category]
      )
    ),
  ];

  const filteredArticles = initialArticles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase());

      if (!selectedCategory) return matchesSearch;

      const categories = Array.isArray(article.category)
        ? article.category
        : [article.category];

      // Show if selected category matches any category (primary or secondary)
      return matchesSearch && categories.includes(selectedCategory);
    })
    .sort((a, b) => {
      // If filtering by category, sort by whether it's primary or secondary
      if (selectedCategory) {
        const aCategories = Array.isArray(a.category)
          ? a.category
          : [a.category];
        const bCategories = Array.isArray(b.category)
          ? b.category
          : [b.category];

        // If one has it as primary and other as secondary, primary comes first
        if (
          aCategories[0] === selectedCategory &&
          bCategories[0] !== selectedCategory
        )
          return -1;
        if (
          bCategories[0] === selectedCategory &&
          aCategories[0] !== selectedCategory
        )
          return 1;
      }

      // Then apply the selected sort option
      if (sortOption === "a") {
        return a.title.localeCompare(b.title);
      }

      // Default to generality sort
      const avgA =
        a.generality.reduce((acc, curr) => acc + curr, 0) / a.generality.length;
      const avgB =
        b.generality.reduce((acc, curr) => acc + curr, 0) / b.generality.length;
      return avgB - avgA;
    });

  return (
    <>
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No articles found matching your criteria
            </div>
          )}
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}
