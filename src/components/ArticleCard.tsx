import Image from "next/image";
import Link from "next/link";
import { Article, RelatedArticle } from "@/types/article";

interface ArticleCardProps {
  article: Article | RelatedArticle;
  size?: "normal" | "compact";
  // Add new prop to control which metric to show
  metricType?: "generality" | "similarity";
}

// Add helper function to parse acronyms
const parseAcronyms = (text: string) => {
  const acronymRegex = /(\w+)\s*\(([^)]+)\)/g;
  return text.replace(
    acronymRegex,
    '<div class="acronym">$1<br/><span class="acronym-description">$2</span></div>'
  );
};

export default function ArticleCard({
  article,
  size = "compact",
  // Default to generality for backwards compatibility
  metricType = "generality",
}: ArticleCardProps) {
  // Calculate average generality with defensive checks
  const avgGenerality =
    Array.isArray(article.generality) && article.generality.length > 0
      ? (
          article.generality.reduce((acc, curr) => acc + curr, 0) /
          article.generality.length
        ).toFixed(3)
      : "N/A";

  // Determine which metric to show based on metricType prop
  const metricLabel = metricType === "similarity" ? "Similarity" : "Generality";
  const metricValue =
    metricType === "similarity" && "similarity" in article
      ? ((article?.similarity ?? 0) * 100).toFixed(1) + "%" // Fixed multiplication
      : avgGenerality;

  return (
    <Link
      href={`/${article.slug}`}
      className="transform transition duration-500 hover:scale-105"
    >
      <div
        className={`relative rounded-lg overflow-hidden ${
          size === "compact" ? "h-[20rem]" : "h-[32rem]"
        }`}
      >
        <Image
          src={`/vocab/images/articles/small/${article.slug}.webp`}
          alt={article.title}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0" />
        <div className="absolute bottom-0 p-6 w-full">
          <h2
            className={`${
              size === "compact" ? "text-xl" : "text-2xl"
            } font-semibold mb-3 text-white`}
            dangerouslySetInnerHTML={{ __html: parseAcronyms(article.title) }}
          />
          <p
            className={`text-gray-200 mb-3 ${
              size === "compact" ? "text-sm" : "text-base"
            }`}
          >
            {article.summary}
          </p>
          <p className="text-gray-400 text-sm">
            {metricLabel}: {metricValue}
          </p>
        </div>
      </div>
    </Link>
  );
}
