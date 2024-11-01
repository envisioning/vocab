"use client"
import { useState, useEffect } from "react"
import { Tree, Circle, ChevronRight, Database, Network, Brain, Info, BookOpen, Zap, ArrowRight } from "lucide-react"

interface OntologyNode {
  id: string
  label: string
  description: string
  children?: OntologyNode[]
  isExpanded?: boolean
}

const ONTOLOGY_DATA: OntologyNode = {
  id: "knowledge",
  label: "Knowledge Systems",
  description: "Root concept organizing information structures",
  children: [
    {
      id: "concepts",
      label: "Core Concepts",
      description: "Fundamental building blocks of knowledge",
      children: [
        {
          id: "classes",
          label: "Classes",
          description: "Categories that group related entities",
          children: [
            { id: "properties", label: "Properties", description: "Attributes that describe classes" },
            { id: "instances", label: "Instances", description: "Specific examples of classes" }
          ]
        },
        {
          id: "relations",
          label: "Relations",
          description: "Connections between concepts",
          children: [
            { id: "hierarchical", label: "Hierarchical", description: "Parent-child relationships" },
            { id: "semantic", label: "Semantic", description: "Meaning-based connections" }
          ]
        }
      ]
    },
    {
      id: "applications",
      label: "Applications",
      description: "Real-world uses of ontologies",
      children: [
        { id: "ai", label: "Artificial Intelligence", description: "Knowledge representation for AI systems" },
        { id: "semantic-web", label: "Semantic Web", description: "Structured data for the web" }
      ]
    }
  ]
}

export default function OntologyVisualizer() {
  const [ontology, setOntology] = useState<OntologyNode>(ONTOLOGY_DATA)
  const [selectedNode, setSelectedNode] = useState<string>("")
  const [hoveredNode, setHoveredNode] = useState<string>("")
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(hoveredNode !== "")
    }, 300)

    return () => clearTimeout(tooltipTimer)
  }, [hoveredNode])

  const renderNode = (node: OntologyNode, depth: number = 0) => {
    const isSelected = selectedNode === node.id
    const isHovered = hoveredNode === node.id
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="relative group">
        <div
          className={`
            flex items-center p-3 my-2 rounded-lg cursor-pointer
            transition-all duration-300 transform
            ${isSelected ? 'bg-blue-500 text-white scale-105' : 'hover:bg-blue-50 dark:hover:bg-blue-900'}
            border-2 border-transparent hover:border-blue-300
          `}
          style={{ marginLeft: `${depth * 24}px` }}
          onClick={() => setSelectedNode(node.id)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode("")}
        >
          {hasChildren && (
            <ChevronRight className={`w-5 h-5 mr-2 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''}`} />
          )}
          <Circle className={`w-4 h-4 mr-3 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
          <span className="font-medium">{node.label}</span>
          
          {isHovered && showTooltip && (
            <div className="absolute left-full top-0 ml-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 w-64 transform scale-100 transition-all duration-300">
              <h4 className="font-bold text-blue-500 mb-2">{node.label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{node.description}</p>
            </div>
          )}
        </div>

        {isSelected && node.children && (
          <div className="ml-6 border-l-2 border-blue-200 dark:border-blue-800 pl-4 space-y-2">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
      <div className="flex items-center mb-8 space-x-4">
        <Brain className="w-10 h-10 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Understanding Ontology</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Explore the hierarchical structure of knowledge organization</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl">
          <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-300">Knowledge Structure</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Organized information hierarchy</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
          <Network className="w-6 h-6 text-green-500 mr-3" />
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-300">Relationships</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Connected concepts and ideas</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
          <Zap className="w-6 h-6 text-purple-500 mr-3" />
          <div>
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">Interactive Learning</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">Click to explore deeper</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        {renderNode(ontology)}
      </div>
    </div>
  )
}