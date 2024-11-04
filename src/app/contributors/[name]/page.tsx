import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import namesData from "@/data/names.json";
import hierarchyData from "@/data/polyhierarchy.json";
import { notFound } from "next/navigation";
import { toTitleCase } from "@/lib/formatters";

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
        uniqueNames.add(name.toLowerCase().replace(/\s+/g, "-"));
      }
    });
  });

  return Array.from(uniqueNames).map((name) => ({
    name: name,
  }));
}

// Get all articles for a specific contributor
async function getArticlesForContributor(name: string): Promise<Article[]> {
  const originalName = name.replace(/-/g, " ");
  const articles: Article[] = [];

  Object.entries(namesData).forEach(([slug, contributors]) => {
    if (contributors.includes(originalName)) {
      const article = hierarchyData.find((item) => item.slug === slug);
      if (article) {
        articles.push({
          slug,
          title: article.name,
          summary: article.summary,
          categories: [],
          generality: Array.isArray(article.generality)
            ? article.generality
            : [article.generality],
          year: article.year || 0,
          component: false,
        });
      }
    }
  });

  return articles;
}

export default async function ContributorPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = name.replace(/-/g, " ");
  const articles = await getArticlesForContributor(name);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header in a separate card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="px-8 py-6">
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {toTitleCase(decodedName)}
              </h1>
              <span className="text-lg text-gray-500">
                ({articles.length} article{articles.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        </div>

        {/* Articles grid with more columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
