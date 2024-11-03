"use server";

import hierarchyData from '@/data/ai_terms_hierarchy.json';
import { Article } from "@/types/article";

export async function getArticles(limit?: number): Promise<Article[]> {
  try {
    // Convert hierarchy data into article format
    const articles = hierarchyData.map((item) => ({
      slug: item.slug,
      title: item.name,
      summary: item.summary,
      generality: Array.isArray(item.generality) ? item.generality : [item.generality],
      year: item.year || 0, // Include the year from hierarchy data
      categories: [],
    }));

    // Sort and limit if needed
    const sortedArticles = articles.sort((a, b) => a.slug.localeCompare(b.slug));
    return limit ? sortedArticles.slice(0, limit) : sortedArticles;

  } catch (error) {
    console.error("Error in getArticles:", error);
    return null;
  }
}
