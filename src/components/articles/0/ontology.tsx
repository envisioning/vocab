"use client"
import { useState, useEffect } from "react"
import { Network, Brain, Database, Link2, FolderTree, ChevronRight, Info, Lightbulb, Moon, Sun } from "lucide-react"

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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isHelperOpen, setIsHelperOpen] = useState<boolean>(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    darkModeMediaQuery.addEventListener('change', handleThemeChange)

    if (darkModeMediaQuery.matches) {
      document.documentElement.classList.add('dark')
    }

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

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
              flex items-center gap-2 p-2 md:gap-3 md:p-3 rounded-lg cursor-pointer
              transition-colors duration-300 relative
              ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
              ${isHighlighted ? 'text-blue-600 dark:text-blue-400' : ''}
              dark:text-gray-100
            `}
            onClick={() => {
              toggleNode(node)
              highlightPath(node)
            }}
          >
            {node.children ? (
              <ChevronRight className={`
                w-4 h-4 md:w-5 md:h-5 transition-transform duration-300
                ${node.isExpanded ? 'rotate-90' : ''}
              `}/>
            ) : (
              <Network className="w-3 h-3 md:w-4 md:h-4" />
            )}
            <span className="font-medium text-xs md:text-sm">{node.label}</span>
            {node.description && (
              <Info className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>
          
          {node.isExpanded && node.description && (
            <div className="ml-6 md:ml-8 mt-1 md:mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
              {node.description}
            </div>
          )}
          
          {node.children && node.isExpanded && (
            <div className="ml-4 md:ml-6 border-l-2 border-gray-200 dark:border-gray-700">
              {node.children.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-6 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="mb-6 md:mb-8 text-center space-y-3 md:space-y-4">
        <div className="flex items-start justify-between mb-2">
          <div className="w-5" /> {/* Spacer for symmetry */}
          <h1 className="text-xl md:text-4xl font-bold flex flex-col md:flex-row items-center gap-2 md:gap-3 dark:text-white">
            <Brain className="w-6 h-6 md:w-10 md:h-10 text-blue-500" />
            <span className="leading-tight">
              Exploring Knowledge<br className="md:hidden" /> Structure
            </span>
          </h1>
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-gray-300 flex-shrink-0" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Discover how information is organized in interconnected hierarchies. Click on any topic to explore its subcategories and relationships.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 transition-all duration-300">
        {renderNode(ontology)}
      </div>
      
      <div className="mt-4 md:mt-6 text-center text-xs md:text-base text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <Database className="w-3 h-3 md:w-4 md:h-4" />
        <p>Visualizing knowledge organization in AI and information systems</p>
      </div>

      <div className="mt-6 md:mt-8">
        <button 
          onClick={() => setIsHelperOpen(prev => !prev)}
          className="w-full flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        >
          <div className="flex-1 flex items-center gap-2 text-left">
            <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
            <span className="text-sm md:text-base font-medium text-blue-700 dark:text-blue-300">
              Understanding AI Ontologies
            </span>
          </div>
          <ChevronRight 
            className={`w-4 h-4 md:w-5 md:h-5 text-blue-500 transition-transform duration-300 flex-shrink-0
              ${isHelperOpen ? 'rotate-90' : ''}`
            }
          />
        </button>
        
        {isHelperOpen && (
          <div className="mt-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Ontologies</span> are like 
                detailed maps of knowledge that help AI systems understand how different concepts are connected! 
                🤖✨
              </p>
              <p>
                Just like how your brain organizes information into categories and subcategories, AI uses 
                ontologies to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Understand relationships between concepts</li>
                <li>Make logical connections and inferences</li>
                <li>Organize and retrieve information efficiently</li>
                <li>Share knowledge in a structured way</li>
              </ul>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 pt-2">
                Try exploring the tree above to see how knowledge can be structured hierarchically, 
                just like in real AI systems! 🌳
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}