"use server";

import { Node } from "@/types/article";
import { cache } from 'react'

export const getNodes = cache(async (limit?: number): Promise<Node[] | null> => {
  try {
    const data = await import('@/data/polyhierarchy.json')
    
    const nodes = data.default.map((node: any) => ({
      ...node,
      title: node.name,
      parents: node.parents || [],
      year: node.year || null,
      complexity: node.complexity || null,
      popularity: node.popularity || null,
      safety: node.safety || null,
      generality: node.generality || null,
      impact: node.impact || null,
      newness: node.newness || null
    }))

    return limit ? nodes.slice(0, limit) : nodes
  } catch (error) {
    console.error('Error loading nodes:', error)
    return null
  }
})
