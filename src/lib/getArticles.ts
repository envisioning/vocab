"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "@/types/article";

export async function getArticles(): Promise<Article[]> {
  const contentDirectory = path.join(process.cwd(), "src/content");
  
  // Filter for .md files only
  const files = await fs.promises.readdir(contentDirectory);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const invalidFiles: string[] = [];

  const articles = mdFiles
    .map((filename) => {
      const slug = filename.replace(".md", "");
      const filePath = path.join(contentDirectory, filename);
      const markdownWithMeta = fs.readFileSync(filePath, "utf-8");

      try {
        const { data: frontmatter } = matter(markdownWithMeta);

        // Process category to ensure it's an array of trimmed strings
        const categories = typeof frontmatter.categories === "string"
          ? frontmatter.categories.split(",").map((cat: string) => cat.trim())
          : Array.isArray(frontmatter.categories)
            ? frontmatter.categories
            : [];

        // Validate required fields
        if (!frontmatter.title || !frontmatter.summary) {
          invalidFiles.push(filename);
          return null;
        }

        return {
          slug,
          title: frontmatter.title,
          summary: frontmatter.summary,
          categories: categories, // Changed from category to categories
          generality: Array.isArray(frontmatter.generality)
            ? frontmatter.generality
            : [frontmatter.generality],
          related: frontmatter.related || [],
          similarity: frontmatter.similarity || 0,
        } as Article;
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        invalidFiles.push(filename);
        return null;
      }
    })
    .filter((article): article is Article => article !== null);

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

  // Sort articles by average generality (highest first)
  return articles.sort((a, b) => {
    const avgA =
      a.generality.reduce((acc, curr) => acc + curr, 0) / a.generality.length;
    const avgB =
      b.generality.reduce((acc, curr) => acc + curr, 0) / b.generality.length;
    return avgB - avgA;
  });
}
