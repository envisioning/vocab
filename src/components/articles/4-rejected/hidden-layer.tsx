"use client"
import { useState, useEffect } from "react"
import { ChefHat, Utensils, ArrowRight, Book, RefreshCcw, Check } from "lucide-react"

interface ComponentProps {}

type Ingredient = {
  id: number
  name: string
  isSelected: boolean
}

type Recipe = {
  id: number
  ingredients: number[]
  result: string
}

const INGREDIENTS: Ingredient[] = [
  { id: 1, name: "🥚 Eggs", isSelected: false },
  { id: 2, name: "🥛 Milk", isSelected: false },
  { id: 3, name: "🥖 Bread", isSelected: false },
  { id: 4, name: "🧀 Cheese", isSelected: false }
]

const RECIPES: Recipe[] = [
  { id: 1, ingredients: [1, 2], result: "🍮 Custard" },
  { id: 2, ingredients: [1, 3], result: "🍳 French Toast" },
  { id: 3, ingredients: [3, 4], result: "🧀 Grilled Cheese" }
]

export default function HiddenLayerKitchen({}: ComponentProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INGREDIENTS)
  const [hiddenLayerActive, setHiddenLayerActive] = useState<boolean>(false)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleIngredientClick = (id: number) => {
    setIngredients(prev =>
      prev.map(ing => 
        ing.id === id ? { ...ing, isSelected: !ing.isSelected } : ing
      )
    )
    setHiddenLayerActive(false)
    setCurrentRecipe(null)
    setSuccess(false)
  }

  useEffect(() => {
    if (hiddenLayerActive) {
      const selectedIds = ingredients
        .filter(ing => ing.isSelected)
        .map(ing => ing.id)
        .sort()

      const recipe = RECIPES.find(r => 
        r.ingredients.length === selectedIds.length &&
        r.ingredients.sort().every((id, index) => id === selectedIds[index])
      )

      const timer = setTimeout(() => {
        setCurrentRecipe(recipe || null)
        setSuccess(!!recipe)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [hiddenLayerActive, ingredients])

  const handleReset = () => {
    setIngredients(INGREDIENTS)
    setHiddenLayerActive(false)
    setCurrentRecipe(null)
    setSuccess(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">The Secret Recipe Laboratory</h2>
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
          aria-label="Reset kitchen"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Book className="w-5 h-5" />
            Select Ingredients
          </h3>
          <div className="space-y-2">
            {ingredients.map(ing => (
              <button
                key={ing.id}
                onClick={() => handleIngredientClick(ing.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors duration-300
                  ${ing.isSelected ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                aria-pressed={ing.isSelected}
              >
                {ing.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={() => setHiddenLayerActive(true)}
            disabled={!ingredients.some(ing => ing.isSelected)}
            className={`p-4 rounded-full transition-all duration-300
              ${hiddenLayerActive 
                ? 'bg-green-500 scale-110' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            aria-label="Process ingredients"
          >
            <ChefHat className={`w-6 h-6 ${hiddenLayerActive ? 'text-white' : 'text-gray-600'}`} />
          </button>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className="relative">
            <Utensils className={`w-6 h-6 ${hiddenLayerActive ? 'text-blue-500' : 'text-gray-400'}`} />
            {hiddenLayerActive && (
              <div className="absolute inset-0 animate-ping">
                <Utensils className="w-6 h-6 text-blue-500" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg min-h-[200px] flex items-center justify-center">
          {currentRecipe ? (
            <div className="text-center">
              <div className="text-4xl mb-2">{currentRecipe.result}</div>
              {success && <Check className="w-5 h-5 text-green-500 mx-auto" />}
            </div>
          ) : (
            <p className="text-gray-400 text-center">Your dish will appear here</p>
          )}
        </div>
      </div>
    </div>
  )
}