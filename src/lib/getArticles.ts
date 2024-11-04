"use server";

import hierarchyData from '@/data/polyhierarchy.json';
import { Article } from "@/types/article";

type SortField = "name" | "year" | "generality";
type SortOrder = "asc" | "desc";

export async function getArticles(
  limit?: number,
  sortBy: SortField = "name",
  sortOrder: SortOrder = "asc",
  showComponentsOnly: boolean = false
): Promise<Article[] | null> {
  try {
    console.log('getArticles called with:', { limit, sortBy, sortOrder, showComponentsOnly });

    // Convert hierarchy data into article format
    const articles = hierarchyData.map((item) => ({
      slug: item.slug,
      title: item.name,
      summary: item.summary,
      generality: Array.isArray(item.generality) ? item.generality : [item.generality],
      year: item.year || 0,
      categories: [],
      similarity: 0,
      component: item.component || false,
    }));

    console.log('Articles before filtering:', articles.length);
    console.log('Component articles:', articles.filter(article => article.component).length);

    // Add component filter before sorting
    let filteredArticles = showComponentsOnly 
      ? articles.filter(article => article.component === true)
      : articles;

    console.log('Articles after filtering:', filteredArticles.length);

    console.log('Articles before sorting:', filteredArticles.length);

    // Sorting logic
    const sortedArticles = filteredArticles.sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (sortBy) {
        case "name":
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case "year":
          if (a.year === 0 && b.year === 0) {
            compareA = a.title.toLowerCase();
            compareB = b.title.toLowerCase();
          } else if (a.year === 0) {
            return sortOrder === "asc" ? 1 : -1;
          } else if (b.year === 0) {
            return sortOrder === "asc" ? -1 : 1;
          } else {
            compareA = a.year;
            compareB = b.year;
          }
          break;
        case "generality":
          const avgA = Array.isArray(a.generality) && a.generality.length > 0
            ? a.generality.reduce((acc, curr) => acc + curr, 0) / a.generality.length
            : 0;
          const avgB = Array.isArray(b.generality) && b.generality.length > 0
            ? b.generality.reduce((acc, curr) => acc + curr, 0) / b.generality.length
            : 0;
          compareA = avgA;
          compareB = avgB;
          break;
        default:
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    console.log('Articles after sorting:', sortedArticles.length);

    return limit ? sortedArticles.slice(0, limit) : sortedArticles;

  } catch (error) {
    console.error("Error in getArticles:", error);
    return null;
  }
}
