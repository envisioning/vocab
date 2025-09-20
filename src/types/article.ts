export interface Article {
  slug: string;
  title: string;
  generality: number[];
  summary: string;
  year: number | null;
  image?: string;
  content?: string;
  relationship?: "parent" | "child" | "bidirectional";
  component: boolean;
}

export interface RelatedArticle {
  slug: string;
  title: string;
  summary: string;
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
  year: number | null;
  normalizedYear?: number;
}

export interface NodeRelation {
  slug: string;
  similarity: number;
}