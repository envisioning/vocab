import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types/article";

async function getArticles(): Promise<Article[]> {
  const files = fs.readdirSync(path.join(process.cwd(), "src/content"));

  const articles = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), "src/content", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      ...frontmatter,
      generality: Array.isArray(frontmatter.generality)
        ? frontmatter.generality
        : [frontmatter.generality],
    } as Article;
  });

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
    <main className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}
