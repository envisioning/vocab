export interface Article {
  slug: string;
  title: string;
  category: string[]; // Ensure this is always an array
  generality: number[];
  summary: string;
  image?: string;
  content?: string;
  relationship?: "parent" | "child" | "bidirectional"; // Updated to specific union type
}

export interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
  category: string[];
  relationship: 'parent' | 'child' | 'bidirectional';
  similarity?: number;
  generality: number[];
}
