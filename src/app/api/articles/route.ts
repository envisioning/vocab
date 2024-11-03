import { getArticles } from "@/lib/getArticles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract and validate parameters with defaults
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '24'));
    const sortBy = (searchParams.get('sortBy') || 'name') as "name" | "year" | "generality";
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as "asc" | "desc";

    console.log('API Request:', { page, limit, sortBy, sortOrder });

    // Get sorted articles without limit (we'll handle pagination after sorting)
    const allArticles = await getArticles(undefined, sortBy, sortOrder);
    
    if (!allArticles) {
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);

    console.log('Sending response:', {
      totalArticles: allArticles.length,
      pageArticles: paginatedArticles.length,
      page,
      sortBy,
      sortOrder
    });

    return NextResponse.json(paginatedArticles);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 