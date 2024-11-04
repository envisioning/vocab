import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import namesData from "@/data/names.json";
import hierarchyData from "@/data/polyhierarchy.json";
import { notFound } from "next/navigation";
import { toTitleCase } from "@/lib/formatters";

interface PageProps {
  params: {
    name: string;
  };
}

// Generate static params for all names
export function generateStaticParams() {
  const uniqueNames = new Set<string>();

  Object.values(namesData).forEach((names) => {
    names.forEach((name) => {
      if (name !== "unknown") {
        uniqueNames.add(name);
      }
    });
  });

  return Array.from(uniqueNames).map((name) => ({
    name: encodeURIComponent(name),
  }));
}

// Get all articles for a specific contributor
function getArticlesForContributor(name: string): Article[] {
  const articles: Article[] = [];

  Object.entries(namesData).forEach(([slug, contributors]) => {
    if (contributors.includes(name)) {
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

export default function ContributorPage({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.name);
  const articles = getArticlesForContributor(decodedName);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="px-8 py-6">
            <div className="flex items-baseline gap-3 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {toTitleCase(decodedName)}
              </h1>
              <span className="text-lg text-gray-500">
                ({articles.length} article{articles.length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}
