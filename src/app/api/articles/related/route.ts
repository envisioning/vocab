import { NextRequest, NextResponse } from "next/server";
import { getRelatedArticles } from "@/lib/getRelatedArticles.server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  console.log(`API Request to /api/articles/related with slug: ${slug}`); // Logging

  if (!slug) {
    console.warn("Slug parameter is missing in the request."); // Logging
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const relatedArticles = await getRelatedArticles(slug);
    console.log(
      `API Response: Retrieved ${relatedArticles.length} related articles for slug: ${slug}` // Logging
    );
    return NextResponse.json(relatedArticles);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch related articles" },
      { status: 500 }
    );
  }
}
