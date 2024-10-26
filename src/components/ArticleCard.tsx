import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/${article.slug}`}
      className="transform transition duration-500 hover:scale-105"
    >
      <div className="h-[32rem] relative rounded-lg overflow-hidden">
        <Image
          src={`/images/${article.slug}.webp`}
          alt={article.title}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/0" />
        <div className="absolute bottom-0 p-6 w-full">
          <h2 className="text-2xl font-semibold mb-3 text-white truncate">
            {article.title}
          </h2>
          <p className="text-gray-200 mb-3">{article.summary}</p>
          <p className="text-gray-400 text-sm">
            Generality:{" "}
            {(
              article.generality.reduce((acc, curr) => acc + curr, 0) /
              article.generality.length
            ).toFixed(3)}
          </p>
        </div>
      </div>
    </Link>
  );
}
