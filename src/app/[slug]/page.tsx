import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { Article } from "@/types/article";
import Image from "next/image";
import { existsSync } from "fs";
import dynamic from "next/dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticleContent(slug: string): Promise<{
  frontmatter: Omit<Article, "slug">;
  content: string;
  hasImage: boolean;
}> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), "src/content", `${slug}.md`),
    "utf-8"
  );

  // Check if image exists
  const imagePath = path.join(process.cwd(), "public/images", `${slug}.webp`);
  const hasImage = fs.existsSync(imagePath);

  const { data: frontmatter, content } = matter(markdownWithMeta);
  return {
    frontmatter: frontmatter as Omit<Article, "slug">,
    content,
    hasImage,
  };
}

// Update getRelatedArticles to handle bidirectional connections
async function getRelatedArticles(slug: string): Promise<Article[]> {
  const hierarchyData = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/data/ai_terms_hierarchy.json"),
      "utf-8"
    )
  );

  const currentArticle = hierarchyData.find((item: any) => item.slug === slug);
  if (!currentArticle) return [];

  // Get child articles (articles that the current article points to)
  const childConnections =
    currentArticle.children?.map((child: any) => ({
      slug: child.slug,
      id: child.id,
      relationship: "child" as const,
      similarity: child.similarity, // Add this
    })) || [];

  // Find parent articles (articles that point to the current article)
  const parentConnections = hierarchyData
    .filter((item: any) =>
      item.children?.some((child: any) => child.id === currentArticle.id)
    )
    .map((item) => {
      const childWithSimilarity = item.children.find(
        (child: any) => child.id === currentArticle.id
      );
      return {
        slug: item.slug,
        id: item.id,
        relationship: "parent" as const,
        similarity: childWithSimilarity?.similarity, // Add this
      };
    });

  // Create a map using slug as the key to prevent duplicates
  const connectionMap = new Map<
    string,
    {
      slug: string;
      relationship: string;
      similarity?: number;
      // Use the higher similarity value for bidirectional connections
      parentSimilarity?: number;
      childSimilarity?: number;
    }
  >();

  // Add child connections first
  childConnections.forEach((conn) => {
    connectionMap.set(conn.slug, {
      ...conn,
      relationship: "child" as const,
      childSimilarity: conn.similarity,
    });
  });

  // Add parent connections, handling bidirectional relationships
  parentConnections.forEach((conn) => {
    const existingConnection = connectionMap.get(conn.slug);
    if (existingConnection) {
      // If already exists, it's bidirectional - merge the connections
      connectionMap.set(conn.slug, {
        slug: conn.slug,
        id: conn.id,
        relationship: "bidirectional" as const,
        similarity: Math.max(
          conn.similarity || 0,
          existingConnection.childSimilarity || 0
        ),
      });
    } else {
      connectionMap.set(conn.slug, {
        ...conn,
        relationship: "parent" as const,
        similarity: conn.similarity,
      });
    }
  });

  // Convert connections to articles
  const relatedArticles = Array.from(connectionMap.values())
    .map((conn) => {
      const article = hierarchyData.find(
        (item: any) => item.slug === conn.slug
      );
      if (!article) return null;
      return {
        slug: article.slug,
        title: article.name,
        summary: article.summary,
        category: article.categories,
        relationship: conn.relationship,
        similarity: conn.similarity,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by bidirectional first, then by similarity
      if (
        a.relationship === "bidirectional" &&
        b.relationship !== "bidirectional"
      )
        return -1;
      if (
        b.relationship === "bidirectional" &&
        a.relationship !== "bidirectional"
      )
        return 1;
      return (b.similarity || 0) - (a.similarity || 0); // Sort by similarity (highest first)
    });

  return relatedArticles;
}

// Add ArticleCard component definition
function ArticleCard({
  slug,
  title,
  summary,
  category,
  relationship,
  similarity,
}: Article & {
  relationship: "parent" | "child" | "bidirectional";
  similarity?: number;
}) {
  return (
    <Link
      href={`/${slug}`}
      className="transform transition duration-500 hover:scale-105"
    >
      <div className="h-[24rem] relative rounded-lg overflow-hidden">
        <Image
          src={`/images/${slug}.webp`}
          alt={title}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/0" />
        <div className="absolute bottom-0 p-6 w-full">
          <h3 className="text-xl font-semibold mb-3 text-white truncate">
            {title}
          </h3>
          <p className="text-gray-200 mb-3">{summary}</p>
          {similarity && (
            <p className="text-gray-400 text-sm">
              Similarity: {(similarity * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Add this function to check for component existence
function getCustomComponent(slug: string) {
  const componentPath = path.join(
    process.cwd(),
    "src/components/articles",
    `${slug}.tsx`
  );
  return existsSync(componentPath);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const { frontmatter, content, hasImage } = await getArticleContent(slug);
  const relatedArticles = await getRelatedArticles(slug);
  const hasCustomComponent = getCustomComponent(slug);

  // Add dynamic component import
  const CustomComponent = hasCustomComponent
    ? dynamic(() => import(`@/components/articles/${slug}`), {
        ssr: true,
      })
    : null;

  // Calculate average generality if it's an array, limited to 3 decimal places
  const generality = Array.isArray(frontmatter.generality)
    ? Number(
        (
          frontmatter.generality.reduce((a, b) => a + b, 0) /
          frontmatter.generality.length
        ).toFixed(3)
      )
    : frontmatter.generality;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-black hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to Home
        </Link>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header section with background image */}
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
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h1 className="text-4xl font-bold mb-4 text-white">
                {frontmatter.title}
              </h1>
              <p className="text-gray-200 text-lg mb-4">
                {frontmatter.summary}
              </p>
            </div>
          </div>

          {/* Article content */}
          <div className="px-8 py-6">
            {/* Add custom component if it exists */}
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

        {/* Related articles section */}
        {relatedArticles.length > 0 && (
          <div className="mt-8 pt-8">
            <h2 className="text-2xl font-bold mb-4">Related</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((article) => (
                <ArticleCard
                  key={`${article.slug}-${article.relationship || "default"}`}
                  {...article}
                  relationship={article.relationship || "parent"} // Provide a valid default relationship
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
