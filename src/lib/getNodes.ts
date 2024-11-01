"use server";

import { Node } from "@/types/article";

export async function getNodes(limit?: number): Promise<Node[] | null> {
  try {
    // Import your JSON data
    const data = await import('@/data/ai_terms_hierarchy.json');
    
    // Transform the data to include both parent and child relationships
    const nodes = data.default.map((node: Node) => {
      // Initialize parents array if not present
      if (!node.parents) {
        node.parents = [];
      }

      // For each child in the current node, add this node as a parent
      if (node.children) {
        node.children.forEach((child: any) => {
          // Find the child node
          const childNode = data.default.find((n: Node) => n.slug === child.slug);
          if (childNode) {
            // Initialize parents array if not present
            if (!childNode.parents) {
              childNode.parents = [];
            }
            // Add current node as parent
            childNode.parents.push({
              slug: node.slug,
              similarity: child.similarity
            });
          }
        });
      }

      return node;
    });

    // Apply limit if specified
    return limit ? nodes.slice(0, limit) : nodes;
  } catch (error) {
    console.error('Error loading nodes:', error);
    return null;
  }
}
