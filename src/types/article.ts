export interface Article {
  slug: string;
  title: string;
  category: string;
  generality: number[];
  summary: string;
  image?: string;
  content?: string;
}
