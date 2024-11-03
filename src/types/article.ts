export interface Article {
  slug: string;
  title: string;
  categories: string[];
  generality: number[];
  summary: string;
  year: number | null;
  image?: string;
  content?: string;
  relationship?: "parent" | "child" | "bidirectional";
}

export interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
  categories: string[];
  relationship: 'parent' | 'child' | 'bidirectional';
  similarity?: number;
  generality: number[];
  year?: number;
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