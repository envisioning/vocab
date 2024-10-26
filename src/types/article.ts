export interface Article {
  slug: string;
  title: string;
  category: string[]; // Ensure this is always an array
  generality: number[];
  summary: string;
  image?: string;
  content?: string;
}
