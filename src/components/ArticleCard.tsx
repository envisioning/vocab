import Image from "next/image";
import Link from "next/link";
import { Article, RelatedArticle } from "@/types/article";

interface ArticleCardProps {
  article: Article | RelatedArticle;
  size?: "normal" | "compact";
}

export default function ArticleCard({
  article,
  size = "compact",
}: ArticleCardProps) {
  // Calculate average generality with defensive checks
  const avgGenerality =
    Array.isArray(article.generality) && article.generality.length > 0
      ? (
          article.generality.reduce((acc, curr) => acc + curr, 0) /
          article.generality.length
        ).toFixed(3)
      : "N/A";

  // Check if article is a RelatedArticle by checking for similarity property
  const isRelatedArticle = "similarity" in article;

  return (
    <Link
      href={`/${article.slug}`}
      className="transform transition duration-500 hover:scale-105"
    >
      <div
        className={`relative rounded-lg overflow-hidden ${
          size === "compact" ? "h-[24rem]" : "h-[32rem]"
        }`}
      >
        <Image
          src={`/images/${article.slug}.webp`}
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
            } font-semibold mb-3 text-white truncate`}
          >
            {article.title}
          </h2>
          <p
            className={`text-gray-200 mb-3 ${
              size === "compact" ? "text-sm" : "text-base"
            }`}
          >
            {article.summary}
          </p>
          {isRelatedArticle ? (
            <p className="text-gray-400 text-sm">
              Similarity: {(article.similarity || 0).toFixed(3)}
            </p>
          ) : (
            <p className="text-gray-400 text-sm">Generality: {avgGenerality}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
