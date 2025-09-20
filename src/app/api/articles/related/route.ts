import { NextRequest, NextResponse } from "next/server";
import { getRelatedArticles } from "@/lib/getRelatedArticles.server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const relatedArticles = await getRelatedArticles(slug);
    return NextResponse.json(relatedArticles);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch related articles" },
      { status: 500 }
    );
  }
}
