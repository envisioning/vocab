'use client'
import { useState, useEffect } from 'react'
import { Box, Bot, Brain, Sun, Moon, TreePine, Wind, Coffee, Pizza, Book, Zap, PlayCircle, PauseCircle, RefreshCcw } from 'lucide-react'

interface WorldState {
    botState: 'idle' | 'thinking' | 'moving' | 'acting'
    itemStates: {
        coffee: { temperature: number; location: string }
        pizza: { temperature: number; location: string }
        book: { isOpen: boolean; location: string }
    }
    timeOfDay: 'day' | 'night'
    environmentStates: {
        roomTemp: number
        lightLevel: number
        noise: number
    }
    selectedAction: string | null
    actionInProgress: boolean
}

const LOCATIONS = ['desk', 'shelf', 'table']
const POSSIBLE_ACTIONS = [
    { name: 'Drink Coffee', icon: Coffee },
    { name: 'Read Book', icon: Book },
    { name: 'Eat Pizza', icon: Pizza }
]

const FrameProblemDemo = () => {
    const [isSimulating, setIsSimulating] = useState(true)
    const [worldState, setWorldState] = useState<WorldState>({
        botState: 'idle',
        itemStates: {
            coffee: { temperature: 90, location: 'desk' },
            pizza: { temperature: 85, location: 'table' },
            book: { isOpen: false, location: 'shelf' }
        },
        timeOfDay: 'day',
        environmentStates: {
            roomTemp: 72,
            lightLevel: 100,
            noise: 20
        },
        selectedAction: null,
        actionInProgress: false
    })

    const [stateChanges, setStateChanges] = useState<string[]>([])
    const [unchangedStates, setUnchangedStates] = useState<string[]>([])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isSimulating) {
            interval = setInterval(() => {
                setWorldState(prev => ({
                    ...prev,
                    environmentStates: {
                        ...prev.environmentStates,
                        lightLevel: prev.timeOfDay === 'day' ?
                            Math.min(100, prev.environmentStates.lightLevel + (Math.random() * 5)) :
                            Math.max(20, prev.environmentStates.lightLevel - (Math.random() * 5)),
                        noise: Math.max(10, Math.min(90, prev.environmentStates.noise + (Math.random() * 10 - 5)))
                    },
                    itemStates: {
                        ...prev.itemStates,
                        coffee: {
                            ...prev.itemStates.coffee,
                            temperature: Math.max(72, prev.itemStates.coffee.temperature - 0.5)
                        },
                        pizza: {
                            ...prev.itemStates.pizza,
                            temperature: Math.max(72, prev.itemStates.pizza.temperature - 0.3)
                        }
                    }
                }))
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isSimulating])

    const performAction = (actionName: string) => {
        if (worldState.actionInProgress) return

        setWorldState(prev => ({
            ...prev,
            botState: 'thinking' as const,
            selectedAction: actionName,
            actionInProgress: true
        }))
        const changedStates: string[] = []
        const unchangedStatesList: string[] = []

        setTimeout(() => {
            setWorldState(prev => {
                const newState: WorldState = {
                    ...prev,
                    botState: 'acting' as const
                }

                switch (actionName) {
                    case 'Drink Coffee':
                        changedStates.push('Coffee temperature', 'Bot state', 'Coffee location')
                        unchangedStatesList.push('Book state', 'Pizza temperature', 'Room noise')
                        newState.itemStates.coffee.temperature = Math.max(72, prev.itemStates.coffee.temperature - 20)
                        break
                    case 'Read Book':
                        changedStates.push('Book state', 'Bot state', 'Noise level')
                        unchangedStatesList.push('Coffee temperature', 'Pizza state', 'Light level')
                        newState.itemStates.book.isOpen = !prev.itemStates.book.isOpen
                        newState.environmentStates.noise = Math.max(10, prev.environmentStates.noise - 10)
                        break
                    case 'Eat Pizza':
                        changedStates.push('Pizza temperature', 'Bot state', 'Pizza location')
                        unchangedStatesList.push('Book state', 'Coffee temperature', 'Room temperature')
                        newState.itemStates.pizza.temperature = Math.max(72, prev.itemStates.pizza.temperature - 15)
                        break
                }

                return newState
            })

            setStateChanges(changedStates)
            setUnchangedStates(unchangedStatesList)

            setTimeout(() => {
                setWorldState(prev => ({
                    ...prev,
                    botState: 'idle' as const,
                    actionInProgress: false
                }))
                setStateChanges([])
                setUnchangedStates([])
            }, 3000)
        }, 1500)
    }

    const toggleDayNight = () => {
        setWorldState(prev => ({
            ...prev,
            timeOfDay: prev.timeOfDay === 'day' ? 'night' : 'day',
            environmentStates: {
                ...prev.environmentStates,
                lightLevel: prev.timeOfDay === 'day' ? 20 : 100
            }
        }))
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">The Frame Problem in AI</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsSimulating(prev => !prev)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                        aria-label={isSimulating ? 'Pause simulation' : 'Start simulation'}
                    >
                        {isSimulating ?
                            <PauseCircle className="w-6 h-6 text-blue-600" /> :
                            <PlayCircle className="w-6 h-6 text-blue-600" />
                        }
                    </button>
                    <button
                        onClick={toggleDayNight}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                    >
                        {worldState.timeOfDay === 'day' ?
                            <Sun className="w-6 h-6 text-yellow-500" /> :
                            <Moon className="w-6 h-6 text-gray-600" />
                        }
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-3">Environment State</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Light Level:</span>
                            <span className="font-mono">{Math.round(worldState.environmentStates.lightLevel)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Room Temperature:</span>
                            <span className="font-mono">{worldState.environmentStates.roomTemp}°F</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Noise Level:</span>
                            <span className="font-mono">{Math.round(worldState.environmentStates.noise)}%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-3">Item States</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Coffee:</span>
                            <span className="font-mono">{Math.round(worldState.itemStates.coffee.temperature)}°F</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pizza:</span>
                            <span className="font-mono">{Math.round(worldState.itemStates.pizza.temperature)}°F</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Book:</span>
                            <span className="font-mono">{worldState.itemStates.book.isOpen ? 'Open' : 'Closed'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Bot className={`w-8 h-8 ${worldState.botState === 'thinking' ? 'text-yellow-500 animate-pulse' :
                            worldState.botState === 'acting' ? 'text-green-500 animate-bounce' :
                                'text-blue-600'
                        }`} />
                    {worldState.botState === 'thinking' && <Brain className="w-6 h-6 text-yellow-500 animate-pulse" />}
                    {worldState.botState === 'acting' && <Zap className="w-6 h-6 text-green-500 animate-bounce" />}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    {POSSIBLE_ACTIONS.map(action => {
                        const Icon = action.icon
                        return (
                            <button
                                key={action.name}
                                onClick={() => performAction(action.name)}
                                disabled={worldState.actionInProgress}
                                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors duration-300 ${worldState.actionInProgress
                                        ? 'bg-gray-100 cursor-not-allowed'
                                        : 'bg-white hover:bg-blue-50'
                                    }`}
                            >
                                <Icon className="w-6 h-6 text-blue-600" />
                                <span className="text-sm">{action.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Frame Problem Demonstration</h3>
                {stateChanges.length > 0 && (
                    <div className="mb-2">
                        <p className="text-sm text-green-600 mb-1">Changed states:</p>
                        <ul className="text-sm list-disc list-inside">
                            {stateChanges.map(state => (
                                <li key={state}>{state}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {unchangedStates.length > 0 && (
                    <div>
                        <p className="text-sm text-blue-600 mb-1">Unchanged states (Frame Problem):</p>
                        <ul className="text-sm list-disc list-inside">
                            {unchangedStates.map(state => (
                                <li key={state}>{state}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {!stateChanges.length && !unchangedStates.length && (
                    <p className="text-sm text-gray-500">
                        Select an action to see how it affects different states in the environment.
                        Notice how many states remain unchanged (the frame problem) while only relevant states are updated.
                    </p>
                )}
            </div>
        </div>
    )
}

export default FrameProblemDemo