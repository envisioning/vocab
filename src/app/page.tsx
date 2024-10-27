import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "@/types/article";
import { Suspense } from "react";
import ArticleList from "@/components/ArticleList";

async function getArticles(): Promise<Article[]> {
  const contentDirectory = path.join(process.cwd(), "src/content");
  // Filter for .md files only
  const files = await fs.promises.readdir(contentDirectory);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const invalidFiles: string[] = [];

  const articles = files
    .map((filename) => {
      const slug = filename.replace(".md", "");
      const filePath = path.join(contentDirectory, filename);
      const markdownWithMeta = fs.readFileSync(filePath, "utf-8");

      const { data: frontmatter } = matter(markdownWithMeta);

      // Process category to ensure it's an array of trimmed strings
      const category =
        typeof frontmatter.category === "string"
          ? frontmatter.category.split(",").map((cat: string) => cat.trim())
          : frontmatter.category;

      // Validate required fields
      if (!frontmatter.title || !frontmatter.summary) {
        invalidFiles.push(filename);
        return null;
      }

      return {
        slug,
        ...frontmatter,
        category, // Use the processed category
        generality: Array.isArray(frontmatter.generality)
          ? frontmatter.generality
          : [frontmatter.generality],
      } as Article;
    })
    .filter(Boolean) as Article[];

  // Log all invalid files at once
  if (invalidFiles.length > 0) {
    console.warn(
      `\n[Article Load Warning] Found ${invalidFiles.length} articles with missing required fields:\n`
    );
    invalidFiles.forEach((file) => {
      console.warn(`- ${file}`);
    });
    console.warn(
      `\nPlease ensure all articles have both 'title' and 'summary' in their front matter.\n`
    );
  }

  return articles.sort((a, b) => {
    const avgA =
      a.generality.reduce((acc, curr) => acc + curr, 0) / a.generality.length;
    const avgB =
      b.generality.reduce((acc, curr) => acc + curr, 0) / b.generality.length;
    return avgB - avgA;
  });
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <ArticleList initialArticles={articles} />
      </Suspense>
    </main>
  );
}
