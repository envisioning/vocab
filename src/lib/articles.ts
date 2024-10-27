import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "@/types/article";

export async function getArticles(): Promise<Article[]> {
  const contentDirectory = path.join(process.cwd(), "src/content");
  const files = fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".md"));

  const articles = files
    .map((filename) => {
      const slug = filename.replace(".md", "");
      const filePath = path.join(contentDirectory, filename);
      const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter } = matter(markdownWithMeta);

      const category = Array.isArray(frontmatter.category)
        ? frontmatter.category
        : frontmatter.category.split(",").map((cat: string) => cat.trim());

      if (!frontmatter.title || !frontmatter.summary) {
        console.warn(`Invalid article: ${filename}`);
        return null;
      }

      return {
        slug,
        ...frontmatter,
        category,
        generality: Array.isArray(frontmatter.generality)
          ? frontmatter.generality
          : [frontmatter.generality],
      } as Article;
    })
    .filter(Boolean) as Article[];

  return articles.sort((a, b) => {
    const avgA = a.generality.reduce((acc, curr) => acc + curr, 0) / a.generality.length;
    const avgB = b.generality.reduce((acc, curr) => acc + curr, 0) / b.generality.length;
    return avgB - avgA;
  });
}