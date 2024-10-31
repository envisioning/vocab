"use server";

import hierarchyData from '@/data/ai_terms_hierarchy.json';
import { Article } from "@/types/article";

export async function getArticles(): Promise<Article[]> {
  return hierarchyData
    .map(item => ({
      slug: item.slug,
      title: item.name,
      summary: item.summary,
      categories: [],
      generality: Array.isArray(item.generality) 
        ? item.generality 
        : [item.generality],
    }))
    .sort((a, b) => {
      // Calculate average generality for each article
      const avgA = Array.isArray(a.generality) 
        ? a.generality.reduce((sum, val) => sum + val, 0) / a.generality.length 
        : a.generality;
      
      const avgB = Array.isArray(b.generality) 
        ? b.generality.reduce((sum, val) => sum + val, 0) / b.generality.length 
        : b.generality;
      
      // Sort descending (higher generality first)
      return avgB - avgA;
    });
}
