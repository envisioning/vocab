"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

const DataImputationDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [mean, setMean] = useState(0);

  useEffect(() => {
    // Generate random dataset on component mount
    const generateData = () => {
      // First generate all values
      const data = Array(5)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          value: Math.floor(Math.random() * 50) + 25,
        }));

      // Randomly select two indices to be missing
      const missingIndices = new Set();
      while (missingIndices.size < 2) {
        missingIndices.add(Math.floor(Math.random() * 5));
      }

      // Set those indices to null
      missingIndices.forEach((index) => {
        data[index].value = null;
      });

      // Calculate mean from non-null values
      const validValues = data.filter((item) => item.value !== null);
      const calculatedMean = Math.round(
        validValues.reduce((acc, curr) => acc + curr.value, 0) /
          validValues.length
      );

      setDataset(data);
      setMean(calculatedMean);
    };

    generateData();
  }, []);

  // Imputed dataset
  const imputedData = dataset.map((item) => ({
    ...item,
    value: item.value === null ? mean : item.value,
  }));

  const steps = [
    {
      title: "Original Dataset",
      description: "Here's our dataset with missing values (shown in red)",
      data: dataset,
    },
    {
      title: "Calculate Mean",
      description: `The mean of the existing values is ${mean}`,
      data: dataset,
    },
    {
      title: "Imputed Dataset",
      description: "Missing values are replaced with the mean",
      data: imputedData,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Data Imputation Demo
            <button
              className="ml-2 inline-flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            ></button>
          </h2>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {steps[currentStep].title}
        </h3>
        <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {steps[currentStep].data.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg text-center ${
                item.value === null
                  ? "bg-red-100 border-2 border-red-300"
                  : currentStep === 2 && dataset[item.id - 1].value === null
                  ? "bg-green-100 border-2 border-green-300"
                  : "bg-gray-100"
              }`}
            >
              <div className="text-lg font-semibold">
                {item.value === null ? (
                  <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
                ) : (
                  item.value
                )}
              </div>
              <div className="text-sm text-gray-500">Value {item.id}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-2 rounded ${
            currentStep === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <button
          onClick={() => {
            if (currentStep === steps.length - 1) {
              setCurrentStep(0);
              const generateData = () => {
                const data = Array(5)
                  .fill(null)
                  .map((_, index) => ({
                    id: index + 1,
                    value: Math.floor(Math.random() * 50) + 25,
                  }));

                const missingIndices = new Set();
                while (missingIndices.size < 2) {
                  missingIndices.add(Math.floor(Math.random() * 5));
                }

                missingIndices.forEach((index) => {
                  data[index].value = null;
                });

                const validValues = data.filter((item) => item.value !== null);
                const calculatedMean = Math.round(
                  validValues.reduce((acc, curr) => acc + curr.value, 0) /
                    validValues.length
                );

                setDataset(data);
                setMean(calculatedMean);
              };
              generateData();
            } else {
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
            }
          }}
          className="flex items-center px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          {currentStep === steps.length - 1 ? "Try New Dataset" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DataImputationDemo;
