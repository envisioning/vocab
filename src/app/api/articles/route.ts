import { getArticles } from "@/lib/getArticles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');

    console.log('API called with:', { page, limit });

    const allArticles = await getArticles();
    console.log('Total articles fetched:', allArticles?.length || 0);
    
    if (!allArticles) {
      console.log('No articles found');
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    const start = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(start, start + limit);
    
    console.log('Pagination details:', {
      total: allArticles.length,
      start,
      end: start + limit,
      returning: paginatedArticles.length
    });

    if (paginatedArticles.length === 0) {
      console.log('No articles for this page');
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(paginatedArticles);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' }, 
      { status: 500 }
    );
  }
} 