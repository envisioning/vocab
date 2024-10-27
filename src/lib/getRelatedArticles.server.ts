import { promises as fsPromises } from "fs";
import path from "path";
import { RelatedArticle } from "@/types/article"; // Use RelatedArticle if defined

const DEFAULT_GENERALITY = [0.5]; // Default generality score for articles missing it

// Add these interfaces at the top of the file
interface HierarchyChild {
  slug: string;
  id: string;
  similarity?: number;
}

interface HierarchyItem {
  slug: string;
  id: string;
  name: string;
  summary: string;
  categories: string[];
  generality: number | number[];
  children?: HierarchyChild[];
}

// Update the cache type
let hierarchyDataCache: HierarchyItem[] | null = null;

export async function getRelatedArticles(slug: string): Promise<RelatedArticle[]> {
  if (!hierarchyDataCache) {
    try {
      const data = await fsPromises.readFile(
        path.join(process.cwd(), "src/data/ai_terms_hierarchy.json"),
        "utf-8"
      );
      hierarchyDataCache = JSON.parse(data);
    } catch (error) {
      console.error("Error reading or parsing ai_terms_hierarchy.json:", error);
      return [];
    }
  }

  const hierarchyData = hierarchyDataCache;

  const currentArticle = hierarchyData?.find((item: HierarchyItem) => item.slug === slug);
  if (!currentArticle) return [];

  // Get child articles with proper error handling
  const childConnections = currentArticle.children?.map((child: HierarchyChild) => {
    const childArticle = hierarchyData?.find((item) => item.slug === child.slug);
    if (!childArticle) return null;
    
    return {
      slug: child.slug,
      id: child.id,
      relationship: "child" as const,
      similarity: child.similarity || 0,
      title: childArticle.name,
      summary: childArticle.summary,
      category: childArticle.categories,
      generality: Array.isArray(childArticle.generality) 
        ? childArticle.generality 
        : [childArticle.generality],
    };
  }).filter((child): child is { slug: string; id: string; relationship: "child"; similarity: number; title: string; summary: string; category: string[]; generality: number[] } => child !== null) || [];

  // Find parent articles with proper error handling
  const parentConnections = hierarchyData
    ?.filter((item: HierarchyItem) => 
      item.children?.some((child: HierarchyChild) => child.slug === currentArticle.slug)
    )
    .map((parentItem) => {
      const childWithSimilarity = parentItem.children?.find(
        (child: HierarchyChild) => child.slug === currentArticle.slug
      );
      
      return {
        slug: parentItem.slug,
        id: parentItem.id,
        relationship: "parent" as const,
        similarity: childWithSimilarity?.similarity || 0,
        title: parentItem.name,
        summary: parentItem.summary,
        category: parentItem.categories,
        generality: Array.isArray(parentItem.generality)
          ? parentItem.generality
          : [parentItem.generality],
      } as RelatedArticle;
    }) || [];

  // Combine and handle bidirectional relationships
  const connectionMap = new Map<string, RelatedArticle>();

  // Add child connections
  childConnections.forEach((conn) => {
    if (conn) {
      connectionMap.set(conn.slug, conn);
    }
  });

  // Add or merge parent connections
  parentConnections.forEach((conn) => {
    const existing = connectionMap.get(conn.slug);
    if (existing) {
      // Only mark as bidirectional if there's both a parent and child connection
      // for the same article
      const isBidirectional = 
        existing.relationship === "child" && conn.relationship === "parent";
      
      connectionMap.set(conn.slug, {
        ...conn,
        relationship: isBidirectional ? "bidirectional" : conn.relationship,
        similarity: Math.max(conn.similarity ?? 0, existing.similarity ?? 0),
      });
    } else {
      connectionMap.set(conn.slug, conn);
    }
  });

  // Convert to array and sort by relationship type and similarity
  return Array.from(connectionMap.values())
    .sort((a, b) => {
      // First sort by relationship type
      if (a.relationship === "bidirectional" && b.relationship !== "bidirectional") return -1;
      if (b.relationship === "bidirectional" && a.relationship !== "bidirectional") return 1;
      
      // Then by similarity
      return (b.similarity || 0) - (a.similarity || 0);
    });
}
