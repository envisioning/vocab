import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { existsSync } from "fs";
import { Suspense } from "react";
import { Article } from "@/types/article";
import RelatedArticles from "@/components/RelatedArticles";
import { getArticles } from "@/lib/getArticles";
import ClientWrapper from "@/components/ClientWrapper";
import { notFound } from "next/navigation"; // Import the notFound function

interface PageProps {
  params: {
    slug: string;
  };
}

async function getArticleContent(slug: string): Promise<{
  frontmatter: Omit<Article, "slug">;
  content: string;
  hasImage: boolean;
  slug: string;
} | null> {
  const filePath = path.join(
    process.cwd(),
    "src/content/articles",
    `${slug}.md`
  );

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return null; // Return null if the file doesn't exist
  }

  const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
  const imagePath = path.join(process.cwd(), "public/images", `${slug}.webp`);
  const hasImage = fs.existsSync(imagePath);

  const { data: frontmatter, content } = matter(markdownWithMeta);
  return {
    frontmatter: frontmatter as Omit<Article, "slug">,
    content,
    hasImage,
    slug,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = await params.slug; // ✅ Correctly awaited
  console.log("Generating metadata for params:", { slug });
  try {
    const { frontmatter } = await getArticleContent(slug);
    return {
      title: frontmatter.title,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Article Not Found",
    };
  }
}

export async function generateStaticParams() {
  console.log("Generating static params");
  const files = fs
    .readdirSync(path.join(process.cwd(), "src/content/articles"))
    .filter((file) => file.endsWith(".md"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params;

  // Fetch the article content
  const articleContent = await getArticleContent(slug);

  if (!articleContent) {
    // If the article doesn't exist, trigger the 404 page
    notFound();
  }

  const { frontmatter, content, hasImage } = articleContent;

  const customComponentPath = path.join(
    process.cwd(),
    "src/components/articles",
    `${slug}.tsx`
  );
  const hasCustomComponent = existsSync(customComponentPath);

  const CustomComponent = hasCustomComponent
    ? dynamic(() => import(`../../components/articles/${slug}`), {
        ssr: true,
      })
    : null;

  const generality =
    Array.isArray(frontmatter.generality) && frontmatter.generality.length > 0
      ? Number(
          (
            frontmatter.generality.reduce((a, b) => a + b, 0) /
            frontmatter.generality.length
          ).toFixed(3)
        )
      : "N/A";

  console.log("Generality calculated as:", generality);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientWrapper
          articles={await getArticles()}
          displayMode="suggestions"
          showList={false}
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="relative h-[400px]">
            {hasImage && (
              <Image
                src={`/images/${slug}.webp`}
                alt={frontmatter.title}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h1 className="text-4xl font-bold mb-4 text-white">
                {frontmatter.title}
              </h1>
              <p className="text-gray-200 text-lg mb-4">
                {frontmatter.summary}
              </p>
            </div>
          </div>

          <div className="px-8 py-6">
            {CustomComponent && <CustomComponent />}

            <div
              className="prose max-w-none 
                prose-headings:mt-8 prose-headings:mb-4
                prose-p:my-6 prose-p:leading-7
                prose-li:my-2 prose-li:leading-7
                prose-ul:my-4 prose-ol:my-4
                [&>p]:mb-8 [&>p]:mt-4
                [&>p]:text-gray-600
                [&>p+p]:mt-8"
              dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
            />
            <div className="text-gray-500">
              <span>Generality: {generality}</span>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 pt-8 animate-pulse max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Related</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          }
        >
          <div className="max-w-4xl mx-auto">
            <RelatedArticles slug={slug} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
