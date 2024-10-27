import aiTermsHierarchy from '@/data/ai_terms_hierarchy.json';

export interface AITerm {
  slug: string;
  name: string;
  summary: string;
  categories: string[];
  generality: number;
  children: {
    slug: string;
    similarity: number;
  }[];
}

export function getArticles(): AITerm[] {
  return aiTermsHierarchy;
}

export function searchArticles(query: string): AITerm[] {
  const searchTerm = query.toLowerCase();
  return aiTermsHierarchy.filter(term => 
    term.name.toLowerCase().includes(searchTerm) || 
    term.summary.toLowerCase().includes(searchTerm) ||
    term.slug.toLowerCase().includes(searchTerm)
  );
}