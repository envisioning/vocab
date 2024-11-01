export interface Article {
  slug: string;
  title: string;
  categories: string[]; // Changed from category to categories
  generality: number[];
  summary: string;
  image?: string;
  content?: string;
  relationship?: "parent" | "child" | "bidirectional";
}

export interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
  categories: string[]; // Changed from category to categories
  relationship: 'parent' | 'child' | 'bidirectional';
  similarity?: number;
  generality: number[];
}


export interface Node {
  slug: string;
  title: string;
  summary?: string;
  generality?: number;
  children: NodeRelation[];
  parents?: NodeRelation[];
  x?: number;
  y?: number;
}

export interface NodeRelation {
  slug: string;
  similarity: number;
}