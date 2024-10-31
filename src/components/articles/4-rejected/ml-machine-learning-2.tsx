"use client"
import { useState, useEffect } from "react"
import { Dog, Cat, Bird, Star, Heart, X } from "lucide-react"

interface Pet {
    id: number
    type: 'dog' | 'cat' | 'bird'
    progress: number
    behavior: string
    isLearning: boolean
}

interface TrainingMethod {
    id: number
    name: string
    description: string
    success: Record<string, number>
}

const TRAINING_METHODS: TrainingMethod[] = [
    { id: 1, name: "Positive Reinforcement", description: "Reward good behavior", success: { dog: 0.8, cat: 0.6, bird: 0.9 } },
    { id: 2, name: "Pattern Training", description: "Repeat actions", success: { dog: 0.9, cat: 0.7, bird: 0.6 } },
    { id: 3, name: "Social Learning", description: "Learn from others", success: { dog: 0.7, cat: 0.8, bird: 0.7 } }
]

export default function PetTrainingAcademy() {
    const [pets, setPets] = useState<Pet[]>([
        { id: 1, type: 'dog', progress: 0, behavior: 'untrained', isLearning: false },
        { id: 2, type: 'cat', progress: 0, behavior: 'untrained', isLearning: false },
        { id: 3, type: 'bird', progress: 0, behavior: 'untrained', isLearning: false }
    ])
    const [selectedMethod, setSelectedMethod] = useState<TrainingMethod | null>(null)
    const [particles, setParticles] = useState<{ x: number, y: number }[]>([])

    useEffect(() => {
        const interval = setInterval(() => {
            setPets(prev => prev.map(pet => ({
                ...pet,
                progress: pet.isLearning 
                    ? Math.min(100, pet.progress + (selectedMethod?.success[pet.type] || 0) * 5)
                    : pet.progress
            })))
        }, 100)

        return () => clearInterval(interval)
    }, [selectedMethod])

    const handleMethodSelect = (method: TrainingMethod) => {
        setSelectedMethod(method)
        setPets(prev => prev.map(pet => ({ ...pet, isLearning: true })))
        createParticles()
    }

    const createParticles = () => {
        const newParticles = Array.from({ length: 5 }, (_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100
        }))
        setParticles(newParticles)
    }

    const getPetIcon = (type: string) => {
        switch (type) {
            case 'dog': return <Dog className="w-12 h-12" />
            case 'cat': return <Cat className="w-12 h-12" />
            case 'bird': return <Bird className="w-12 h-12" />
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Pet Training Academy</h1>
                
                <div className="grid grid-cols-1 gap-8">
                    {/* Training Methods */}
                    <div className="flex gap-4 justify-center mb-8">
                        {TRAINING_METHODS.map(method => (
                            <button
                                key={method.id}
                                onClick={() => handleMethodSelect(method)}
                                className={`p-4 rounded-lg shadow-lg transition-all duration-300 ${
                                    selectedMethod?.id === method.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white hover:bg-blue-50'
                                }`}
                            >
                                <h3 className="font-bold">{method.name}</h3>
                                <p className="text-sm">{method.description}</p>
                            </button>
                        ))}
                    </div>

                    {/* Training Ground */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        {pets.map(pet => (
                            <div key={pet.id} className="mb-8 relative">
                                <div className="flex items-center gap-4">
                                    {getPetIcon(pet.type)}
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-green-500 transition-all duration-300"
                                                style={{ width: `${pet.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    {pet.progress === 100 && (
                                        <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                                    )}
                                </div>
                                
                                {particles.map((particle, i) => (
                                    <div
                                        key={i}
                                        className="absolute animate-ping"
                                        style={{
                                            left: `${particle.x}%`,
                                            top: `${particle.y}%`
                                        }}
                                    >
                                        {pet.progress < 50 ? <X className="text-red-400" /> : <Heart className="text-pink-400" />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}