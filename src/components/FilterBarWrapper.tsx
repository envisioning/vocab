"use client";

import { useState } from "react";
import { Article } from "@/types/article";
import FilterBar from "./FilterBar";

interface FilterBarWrapperProps {
  allArticles: Article[];
  onFilterChange: (articles: Article[]) => void;
}

export default function FilterBarWrapper({
  allArticles,
  onFilterChange,
}: FilterBarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("g");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique categories from all articles
  const categories = Array.from(
    new Set(allArticles.flatMap((article) => article.categories)) // Changed from category to categories
  );

  // Handle filter changes
  const handleSearch = (value: string) => {
    console.log("Searching:", value);
    setSearchTerm(value);
    if (value === "") {
      setSelectedCategory(""); // Clear category when search is cleared
      filterArticles("", sortOption, "");
    } else {
      setSelectedCategory(""); // Clear category when searching
      filterArticles(value, sortOption, "");
    }
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    filterArticles(searchTerm, value, selectedCategory);
  };

  const handleCategory = (value: string) => {
    console.log("Selecting category:", value);
    setSelectedCategory(value);
    // When selecting a category, we want to filter by the category code only
    filterArticles("", sortOption, value);
  };

  const filterArticles = (search: string, sort: string, category: string) => {
    let filtered = [...allArticles];
    console.log("Initial articles:", filtered.length);

    if (category) {
      // Debug logging
      console.log("Filtering by category:", category);
      console.log("Sample article categories:", filtered[0]?.categories);

      filtered = filtered.filter((article) => {
        const hasCategory = article.categories.includes(category);
        console.log(
          `Article ${article.slug} has categories:`,
          article.categories,
          "Match:",
          hasCategory
        );
        return hasCategory;
      });

      console.log("After category filter:", filtered.length);
    } else if (search) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(search.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sort === "g") {
        const avgA =
          a.generality.reduce((acc, curr) => acc + curr, 0) /
          a.generality.length;
        const avgB =
          b.generality.reduce((acc, curr) => acc + curr, 0) /
          b.generality.length;
        return avgB - avgA;
      }
      return a.title.localeCompare(b.title);
    });

    onFilterChange(filtered);
  };

  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={handleSearch}
      sortOption={sortOption}
      onSortChange={handleSort}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategory}
      categories={categories}
      allArticles={allArticles}
    />
  );
}
