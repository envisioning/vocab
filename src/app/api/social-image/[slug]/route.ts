import { ImageResponse } from "next/server";
import { getArticleContent } from "@/lib/getArticles";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const article = await getArticleContent(params.slug);
  
  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {article.frontmatter.title}
        </h1>
        <p
          style={{
            fontSize: "30px",
            textAlign: "center",
            color: "#666",
          }}
        >
          {article.frontmatter.summary}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

