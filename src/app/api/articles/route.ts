import { getArticles } from "@/lib/getArticles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");
  const sortBy = (searchParams.get("sortBy") || "name") as "name" | "year" | "generality";
  const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";
  const showComponentsOnly = searchParams.get("showComponentsOnly") === "true";

  const articles = await getArticles(
    undefined,
    sortBy,
    sortOrder,
    showComponentsOnly
  );

  if (!articles) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pageArticles = articles.slice(startIndex, endIndex);

  return NextResponse.json({
    totalArticles: articles.length,
    pageArticles: pageArticles,
    page,
  });
} 