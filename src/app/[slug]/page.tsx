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
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import KeyboardNavigation from "@/components/KeyboardNavigation";
import hierarchyData from "@/data/ai_terms_hierarchy.json";
import ReportErrorButton from "@/components/ReportErrorButton";
import ComponentFeedback from "@/components/ComponentFeedback";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://envisioning.io";

interface PageProps {
  params: {
    slug: string;
  };
}

const parseAcronyms = (text: string) => {
  const acronymRegex = /(\w+)\s*\(([^)]+)\)/g;
  return text.replace(
    acronymRegex,
    '<div class="acronym">$1<br/><span class="acronym-description">$2</span></div>'
  );
};

async function getArticleContent(slug: string): Promise<{
  frontmatter: Omit<Article, "slug">;
  content: string;
  hasImage: boolean;
  slug: string;
} | null> {
  const article = hierarchyData.find((item) => item.slug === slug);
  if (!article) {
    return null;
  }

  const filePath = path.join(
    process.cwd(),
    "src/content/articles",
    `${slug}.md`
  );
  let content = "";

  if (fs.existsSync(filePath)) {
    const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
    const { content: markdownContent } = matter(markdownWithMeta);
    content = markdownContent;
  }

  return {
    frontmatter: {
      title: article.name,
      summary: article.summary,
      generality: Array.isArray(article.generality)
        ? article.generality
        : [article.generality],
      year: article.year || 0,
      categories: [],
    },
    content,
    hasImage: true,
    slug,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const article = hierarchyData.find((item) => item.slug === slug);
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://envisioning.io";

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.name,
    description: article.summary,
    openGraph: {
      title: article.name,
      description: article.summary,
      url: `${url}/${slug}`,
      images: [
        {
          url: `${url}/images/articles/${slug}.webp`,
          width: 1200,
          height: 630,
        },
      ],
      siteName: "Envisioning Vocab",
    },
    twitter: {
      card: "summary_large_image",
      title: article.name,
      description: article.summary,
      images: [`${url}/images/articles/${slug}.webp`],
    },
  };
}

export async function generateStaticParams() {
  return hierarchyData.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (slug === "vocab") {
    redirect("/");
  }

  const articleContent = await getArticleContent(slug);
  const articles = await getArticles();
  const slugs = articles.map((article) => article.slug).sort();

  if (!articleContent) {
    notFound();
  }

  const { frontmatter, content, hasImage } = articleContent;

  const possiblePaths = [
    path.join(process.cwd(), "src/components/articles", `${slug}.tsx`),
    ...fs
      .readdirSync(path.join(process.cwd(), "src/components/articles"))
      .filter(
        (dir) =>
          (dir.startsWith("0") || dir.startsWith("1") || dir.startsWith("2")) &&
          fs
            .statSync(path.join(process.cwd(), "src/components/articles", dir))
            .isDirectory()
      )
      .map((dir) =>
        path.join(process.cwd(), "src/components/articles", dir, `${slug}.tsx`)
      ),
  ];

  const customComponentPath = possiblePaths.find((path) => existsSync(path));
  const hasCustomComponent = !!customComponentPath;

  const CustomComponent = hasCustomComponent
    ? dynamic(
        () => {
          const relativePath = customComponentPath!.split(
            "src/components/articles/"
          )[1];
          return import(
            `../../components/articles/${relativePath.replace(/\.tsx$/, "")}`
          );
        },
        {
          ssr: true,
        }
      )
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

  return (
    <>
      <KeyboardNavigation availableSlugs={slugs} />
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
            <div className="relative h-[400px]">
              {hasImage && (
                <Image
                  src={`/vocab/images/articles/${slug}.webp`}
                  alt={frontmatter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  quality={90}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h1
                  className="text-4xl font-bold mb-4 text-white"
                  dangerouslySetInnerHTML={{
                    __html: parseAcronyms(frontmatter.title),
                  }}
                />
                <p className="text-gray-200 text-lg mb-4">
                  {frontmatter.summary}
                </p>
              </div>
            </div>

            <div className="px-8 py-6">
              {CustomComponent && (
                <>
                  <CustomComponent />
                  <ComponentFeedback slug={slug} />
                </>
              )}

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
                <div className="block">
                  <a
                    href="/vocab/about/#generality"
                    className="hover:underline"
                  >
                    Generality: {generality}
                  </a>
                </div>
                <div className="block">
                  <a href="/vocab/about/#year" className="hover:underline">
                    Year: {frontmatter.year || "Unknown"}
                  </a>
                </div>
                <div className="block">
                  <ReportErrorButton slug={slug} title={frontmatter.title} />
                </div>
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
    </>
  );
}
