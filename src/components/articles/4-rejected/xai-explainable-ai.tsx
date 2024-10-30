"use client"
import { useState, useEffect } from "react"
import { Scale, User, DollarSign, Clock, ThumbsUp, ThumbsDown, Medal, Briefcase } from "lucide-react"

interface Case {
  id: number
  name: string
  income: number
  creditScore: number
  employmentYears: number
  loanAmount: number
}

interface Factor {
  name: string
  weight: number
  icon: JSX.Element
  value: number
}

interface ComponentProps {}

const CASES: Case[] = [
  {
    id: 1,
    name: "Alex Smith",
    income: 45000,
    creditScore: 680,
    employmentYears: 3,
    loanAmount: 10000
  }
]

const XAIJudge = ({}: ComponentProps) => {
  const [currentCase, setCurrentCase] = useState<Case>(CASES[0])
  const [factors, setFactors] = useState<Factor[]>([
    {
      name: "Income",
      weight: 0.4,
      icon: <DollarSign className="w-6 h-6" />,
      value: 0
    },
    {
      name: "Credit Score",
      weight: 0.3,
      icon: <Medal className="w-6 h-6" />,
      value: 0
    },
    {
      name: "Employment",
      weight: 0.3,
      icon: <Briefcase className="w-6 h-6" />,
      value: 0
    }
  ])
  const [decision, setDecision] = useState<boolean>(false)
  const [explaining, setExplaining] = useState<boolean>(false)

  useEffect(() => {
    calculateFactorValues()
    return () => {
      setFactors([])
    }
  }, [currentCase])

  const calculateFactorValues = () => {
    const newFactors = factors.map(factor => {
      let value = 0
      switch (factor.name) {
        case "Income":
          value = currentCase.income >= 40000 ? 1 : currentCase.income / 40000
          break
        case "Credit Score":
          value = currentCase.creditScore >= 700 ? 1 : currentCase.creditScore / 700
          break
        case "Employment":
          value = currentCase.employmentYears >= 5 ? 1 : currentCase.employmentYears / 5
          break
      }
      return { ...factor, value }
    })
    setFactors(newFactors)
    
    const weightedSum = newFactors.reduce((sum, factor) => 
      sum + factor.value * factor.weight, 0
    )
    setDecision(weightedSum >= 0.7)
  }

  const handleWeightChange = (index: number, newWeight: number) => {
    const newFactors = factors.map((factor, i) => {
      if (i === index) return { ...factor, weight: newWeight }
      return factor
    })
    setFactors(newFactors)
    calculateFactorValues()
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-8 h-8 text-blue-500" />
          <h2 className="text-xl font-bold">{currentCase.name}'s Loan Application</h2>
        </div>
        <Scale className="w-8 h-8 text-blue-500" />
      </div>

      <div className="space-y-6">
        {factors.map((factor, index) => (
          <div key={factor.name} className="flex items-center gap-4">
            {factor.icon}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>{factor.name}</span>
                <span className="text-sm text-gray-600">
                  Weight: {(factor.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${factor.value * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={factor.weight}
                onChange={(e) => handleWeightChange(index, parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        {decision ? (
          <ThumbsUp className="w-12 h-12 text-green-500" />
        ) : (
          <ThumbsDown className="w-12 h-12 text-gray-500" />
        )}
        <div className="text-lg font-semibold">
          Loan {decision ? "Approved" : "Denied"}
        </div>
      </div>
    </div>
  )
}

export default XAIJudge