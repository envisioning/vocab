"use client"
import { useState, useEffect } from "react"
import { Hospital, ClipboardCheck, Activity, TableProperties, Stethoscope, Database, FileCheck, AlertTriangle } from "lucide-react"

interface Dataset {
  id: number
  name: string
  missingValues: number[]
  totalValues: number
  type: "numeric" | "categorical"
}

interface TreatmentMethod {
  id: number
  name: string
  description: string
  icon: JSX.Element
  suitable: "numeric" | "categorical" | "both"
}

const DataHospital = () => {
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<TreatmentMethod | null>(null)
  const [treatmentComplete, setTreatmentComplete] = useState(false)
  const [healthScore, setHealthScore] = useState(0)

  const datasets: Dataset[] = [
    {
      id: 1,
      name: "Student Grades",
      missingValues: [3, 7, 12],
      totalValues: 20,
      type: "numeric"
    },
    {
      id: 2,
      name: "Favorite Colors",
      missingValues: [2, 8, 15],
      totalValues: 20,
      type: "categorical"
    }
  ]

  const treatmentMethods: TreatmentMethod[] = [
    {
      id: 1,
      name: "Mean Imputation",
      description: "Replace missing values with the average",
      icon: <Activity className="w-6 h-6" />,
      suitable: "numeric"
    },
    {
      id: 2, 
      name: "Mode Imputation",
      description: "Replace with most common value",
      icon: <TableProperties className="w-6 h-6" />,
      suitable: "both"
    }
  ]

  useEffect(() => {
    if (activeDataset) {
      const score = ((activeDataset.totalValues - activeDataset.missingValues.length) / activeDataset.totalValues) * 100
      setHealthScore(score)
    }
    return () => setHealthScore(0)
  }, [activeDataset])

  const handleDatasetAdmission = (dataset: Dataset) => {
    setActiveDataset(dataset)
    setSelectedMethod(null)
    setTreatmentComplete(false)
  }

  const handleTreatment = () => {
    if (selectedMethod && activeDataset) {
      setTreatmentComplete(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <header className="flex items-center gap-3 mb-8">
        <Hospital className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">The Data Hospital</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section aria-label="Dataset Admission" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Patient Admission
          </h2>
          
          <div className="space-y-4">
            {datasets.map(dataset => (
              <button
                key={dataset.id}
                onClick={() => handleDatasetAdmission(dataset)}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  activeDataset?.id === dataset.id 
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                aria-pressed={activeDataset?.id === dataset.id}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{dataset.name}</span>
                  <Database className="w-5 h-5" />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Health: {((dataset.totalValues - dataset.missingValues.length) / dataset.totalValues * 100).toFixed(0)}%
                </div>
              </button>
            ))}
          </div>
        </section>

        {activeDataset && (
          <section aria-label="Treatment Selection" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Treatment Selection
            </h2>

            <div className="space-y-4">
              {treatmentMethods
                .filter(method => method.suitable === activeDataset.type || method.suitable === "both")
                .map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      selectedMethod?.id === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    aria-pressed={selectedMethod?.id === method.id}
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div className="text-left">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {selectedMethod && (
              <button
                onClick={handleTreatment}
                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Begin treatment"
              >
                Begin Treatment
              </button>
            )}
          </section>
        )}

        {treatmentComplete && (
          <section aria-label="Treatment Results" className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Treatment Results
            </h2>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-700">Treatment Successful</div>
                <div className="text-sm text-green-600">Dataset health restored to 100%</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-green-500" />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default DataHospital