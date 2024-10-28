import { Article } from "@/types/article";
import Head from "next/head";

interface SocialMetaTagsProps {
  article: {
    frontmatter: Omit<Article, "slug">;
    slug: string;
    hasImage: boolean;
  };
  url: string;
}

export default function SocialMetaTags({ article, url }: SocialMetaTagsProps) {
  const { frontmatter, slug, hasImage } = article;
  const imageUrl = hasImage
    ? `${url}/images/${slug}.webp`
    : `${url}/default-social.webp`;

  return (
    <Head>
      {/* Open Graph Tags */}
      <meta property="og:title" content={frontmatter.title} />
      <meta property="og:description" content={frontmatter.summary} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={`${url}/${slug}`} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Envisioning Vocab" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={frontmatter.title} />
      <meta name="twitter:description" content={frontmatter.summary} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Optional: Add structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: frontmatter.title,
            description: frontmatter.summary,
            image: imageUrl,
            url: `${url}/${slug}`,
          }),
        }}
      />
    </Head>
  );
}
