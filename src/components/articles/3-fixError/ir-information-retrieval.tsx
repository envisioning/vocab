"use client"
import { useState, useEffect } from "react"
import { Search, Book, FileText, BookOpen, Info, Loader2, ArrowRight } from "lucide-react"

interface IRDemoProps {}

type Document = {
  id: number
  title: string
  content: string
  relevance: number
  category: string
}

const SAMPLE_DOCS: Document[] = [
  { id: 1, title: "Digital Library Guide", content: "Modern methods of organizing digital information", relevance: 0, category: "Education" },
  { id: 2, title: "Search Engine Architecture", content: "How search engines index and retrieve data", relevance: 0, category: "Technology" },
  { id: 3, title: "Data Mining Basics", content: "Fundamental concepts of extracting patterns from data", relevance: 0, category: "Technology" },
  { id: 4, title: "Knowledge Discovery", content: "Methods for finding insights in large datasets", relevance: 0, category: "Research" },
  { id: 5, title: "Query Processing", content: "Understanding how search queries are processed", relevance: 0, category: "Technology" }
]

const SEARCH_TERMS = ["digital", "search", "data", "knowledge", "query"]

export default function IRDemo({}: IRDemoProps) {
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCS)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  useEffect(() => {
    if (!searchTerm) return
    
    setIsSearching(true)
    
    const timer = setTimeout(() => {
      const updatedDocs = documents.map(doc => ({
        ...doc,
        relevance: calculateRelevance(doc, searchTerm)
      })).sort((a, b) => b.relevance - a.relevance)
      
      setDocuments(updatedDocs)
      setIsSearching(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const calculateRelevance = (doc: Document, term: string): number => {
    const titleMatch = doc.title.toLowerCase().includes(term.toLowerCase()) ? 1 : 0
    const contentMatch = doc.content.toLowerCase().includes(term.toLowerCase()) ? 0.5 : 0
    return titleMatch + contentMatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Information Retrieval Explorer
          </h1>
          <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg backdrop-blur-sm">
            <p className="text-slate-600 dark:text-slate-300">
              Discover how search engines find and rank relevant information based on your queries.
              Watch documents shift and reorganize as their relevance changes!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {SEARCH_TERMS.map(term => (
            <button
              key={term}
              onClick={() => setSearchTerm(term)}
              className={`px-4 py-2 rounded-full transition-all duration-300 transform
                ${searchTerm === term 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-700 hover:scale-105'
                }`}
            >
              {term}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-8 bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm">
            <Search className="w-6 h-6 text-blue-500" />
            <div className="flex-1 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-md px-4 py-2 flex items-center">
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-200">{searchTerm}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isSearching ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              documents.map(doc => (
                <div
                  key={doc.id}
                  onMouseEnter={() => setShowTooltip(doc.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  onClick={() => setSelectedDoc(doc)}
                  className={`relative bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md cursor-pointer
                    transform transition-all duration-500 hover:shadow-xl
                    ${doc.relevance > 0 ? 'border-l-4 border-blue-500' : ''}
                    ${selectedDoc?.id === doc.id ? 'ring-2 ring-blue-500' : ''}
                  `}
                  style={{
                    transform: `translateX(${doc.relevance * 50}px)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    {doc.relevance > 0 ? (
                      <BookOpen className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Book className="w-5 h-5 text-slate-400" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800 dark:text-slate-100">{doc.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{doc.content}</p>
                    </div>
                  </div>
                  
                  {showTooltip === doc.id && (
                    <div className="absolute -top-12 left-0 bg-slate-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-10">
                      Relevance Score: {doc.relevance.toFixed(2)}
                      <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}