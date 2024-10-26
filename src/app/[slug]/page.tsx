import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { Article } from "@/types/article";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticleContent(slug: string): Promise<{
  frontmatter: Omit<Article, "slug">;
  content: string;
}> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), "src/content", `${slug}.md`),
    "utf-8"
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);
  return {
    frontmatter: frontmatter as Omit<Article, "slug">,
    content,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const { frontmatter, content } = await getArticleContent(slug);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg px-8 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
          <div className="text-gray-600 mb-4">
            <span className="mr-4">Category: {frontmatter.category}</span>
            <span>Generality: {frontmatter.generality}</span>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>
      </div>
    </div>
  );
}
