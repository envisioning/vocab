import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import namesData from "@/data/names.json";
import hierarchyData from "@/data/polyhierarchy.json";
import { notFound } from "next/navigation";
import { toTitleCase, generateSafeSlug } from "@/lib/formatters";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

// Generate static params for all names
export function generateStaticParams() {
  const uniqueNames = new Set<string>();

  Object.values(namesData).forEach((names) => {
    names.forEach((name) => {
      if (name !== "unknown") {
        // Use safe slug generation to prevent ENAMETOOLONG errors
        const safeSlug = generateSafeSlug(name);
        uniqueNames.add(safeSlug);
      }
    });
  });

  return Array.from(uniqueNames).map((name) => ({
    name: name,
  }));
}

// Get all articles for a specific contributor
async function getArticlesForContributor(name: string): Promise<Article[]> {
  const articles: Article[] = [];

  Object.entries(namesData).forEach(([slug, contributors]) => {
    // Check if any of the contributors has a safe slug that matches our current name
    const matchingContributor = contributors.find((contributor) => {
      if (contributor !== "unknown") {
        const safeSlug = generateSafeSlug(contributor);
        return safeSlug === name;
      }
      return false;
    });

    if (matchingContributor) {
      const article = hierarchyData.find((item) => item.slug === slug);
      if (article) {
        // Only add articles with known years (year !== 0)
        if (article.year) {
          articles.push({
            slug,
            title: article.name,
            summary: article.summary,
            generality: Array.isArray(article.generality)
              ? article.generality
              : [article.generality],
            year: article.year,
            component: false,
          });
        }
      }
    }
  });

  // Sort articles by year in ascending order (oldest first)
  articles.sort((a, b) => a.year - b.year);

  return articles;
}

export default async function ContributorPage({ params }: PageProps) {
  const { name } = await params;
  const articles = await getArticlesForContributor(name);

  if (articles.length === 0) {
    notFound();
  }

  // Find the actual contributor name for display
  let displayName = name.replace(/-/g, " ");

  // Look up the actual name from the data
  for (const contributors of Object.values(namesData)) {
    const matchingContributor = contributors.find((contributor) => {
      if (contributor !== "unknown") {
        return generateSafeSlug(contributor) === name;
      }
      return false;
    });
    if (matchingContributor) {
      displayName = matchingContributor;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="px-8 py-6">
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {toTitleCase(displayName)}
              </h1>
              <span className="text-lg text-gray-500 dark:text-gray-400">
                ({articles.length} article{articles.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              metricType="generality"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
