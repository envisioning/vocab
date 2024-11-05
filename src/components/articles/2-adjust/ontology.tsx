"use client"
import { useState, useEffect } from "react"
import { Network, Brain, Database, Link2, FolderTree, ChevronRight, Info, Lightbulb } from "lucide-react"

interface OntologyNode {
  id: string
  label: string
  description?: string
  children?: OntologyNode[]
  isExpanded?: boolean
}

const SAMPLE_ONTOLOGY: OntologyNode = {
  id: "knowledge",
  label: "Knowledge Domain",
  description: "The root of our knowledge structure",
  children: [
    {
      id: "science",
      label: "Science",
      description: "Systematic study of the natural world",
      children: [
        {
          id: "biology",
          label: "Biology",
          description: "Study of living organisms",
          children: [
            { id: "genetics", label: "Genetics", description: "Study of genes and heredity" },
            { id: "ecology", label: "Ecology", description: "Study of interactions between organisms" }
          ]
        },
        {
          id: "physics",
          label: "Physics",
          description: "Study of matter and energy",
          children: [
            { id: "mechanics", label: "Mechanics", description: "Study of motion and forces" },
            { id: "quantum", label: "Quantum Physics", description: "Study of atomic and subatomic particles" }
          ]
        }
      ]
    },
    {
      id: "arts",
      label: "Arts",
      description: "Creative and cultural expression",
      children: [
        { id: "music", label: "Music", description: "Auditory art form" },
        { id: "painting", label: "Painting", description: "Visual art on canvas" }
      ]
    }
  ]
}

export default function OntologyVisualizer() {
  const [ontology, setOntology] = useState<OntologyNode>(SAMPLE_ONTOLOGY)
  const [highlightedPath, setHighlightedPath] = useState<string[]>([])
  const [activeNode, setActiveNode] = useState<OntologyNode | null>(null)

  const toggleNode = (node: OntologyNode) => {
    const updateNode = (current: OntologyNode): OntologyNode => {
      if (current.id === node.id) {
        return { ...current, isExpanded: !current.isExpanded }
      }
      if (current.children) {
        return {
          ...current,
          children: current.children.map(updateNode)
        }
      }
      return current
    }
    setOntology(updateNode(ontology))
    setActiveNode(node)
  }

  const highlightPath = (node: OntologyNode) => {
    const findPath = (current: OntologyNode, path: string[] = []): string[] | null => {
      const currentPath = [...path, current.id]
      if (current.id === node.id) return currentPath
      if (!current.children) return null
      
      for (const child of current.children) {
        const foundPath = findPath(child, currentPath)
        if (foundPath) return foundPath
      }
      return null
    }
    
    const path = findPath(ontology) || []
    setHighlightedPath(path)
  }

  const renderNode = (node: OntologyNode, depth: number = 0) => {
    const isHighlighted = highlightedPath.includes(node.id)
    const isActive = activeNode?.id === node.id
    
    return (
      <div key={node.id} className="group">
        <div
          className={`
            ml-${depth * 4} transition-all duration-300 
            ${isHighlighted ? 'scale-102' : ''}
          `}
        >
          <div 
            className={`
              flex items-center gap-3 p-3 rounded-lg cursor-pointer
              transition-colors duration-300 relative
              ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
              ${isHighlighted ? 'text-blue-600 dark:text-blue-400' : ''}
            `}
            onClick={() => {
              toggleNode(node)
              highlightPath(node)
            }}
          >
            {node.children ? (
              <ChevronRight className={`
                w-5 h-5 transition-transform duration-300
                ${node.isExpanded ? 'rotate-90' : ''}
              `}/>
            ) : (
              <Network className="w-4 h-4" />
            )}
            <span className="font-medium text-sm md:text-base">{node.label}</span>
            {node.description && (
              <Info className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>
          
          {node.isExpanded && node.description && (
            <div className="ml-8 mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {node.description}
            </div>
          )}
          
          {node.children && node.isExpanded && (
            <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700">
              {node.children.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
          Exploring Knowledge Structure
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Discover how information is organized in interconnected hierarchies. Click on any topic to explore its subcategories and relationships.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300">
        {renderNode(ontology)}
      </div>
      
      <div className="mt-6 text-center text-sm md:text-base text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <Database className="w-4 h-4" />
        <p>Visualizing knowledge organization in AI and information systems</p>
      </div>
    </div>
  )
}