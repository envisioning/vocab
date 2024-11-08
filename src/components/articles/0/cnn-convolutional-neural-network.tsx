"use client"

import React, { useState, useEffect } from "react"
import { Image, Filter, ArrowRight, Maximize2, Grid, Layers, Info, ChevronDown, Brain, Zap, ScanEye } from "lucide-react"

interface ComponentProps {}

type ConvStage = "input" | "conv" | "pool" | "output"

const CNN_STAGES: ConvStage[] = ["input", "conv", "pool", "output"]

const SAMPLE_IMAGE = [
  [0,1,1,0],
  [1,0,0,1],
  [1,0,0,1], 
  [0,1,1,0]
]

const CNNVisualizer = ({}: ComponentProps) => {
  const [currentStage, setCurrentStage] = useState<ConvStage>("input")
  const [showInfo, setShowInfo] = useState(false)
  const [highlight, setHighlight] = useState<{x:number,y:number}>({x:0,y:0})
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        const currentIndex = CNN_STAGES.indexOf(prev)
        return CNN_STAGES[(currentIndex + 1) % CNN_STAGES.length]
      })
      setHighlight(prev => ({
        x: (prev.x + 1) % 3,
        y: prev.y === 2 && prev.x === 2 ? (prev.y + 1) % 3 : prev.y
      }))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const renderPixel = (value: number, x: number, y: number) => (
    <div 
      key={`${x}-${y}`}
      className={`
        w-6 h-6 md:w-8 md:h-8 border border-gray-400
        ${value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}
        ${highlight.x === x && highlight.y === y ? 'ring-2 ring-green-400' : ''}
        transition-all duration-300
      `}
    />
  )

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          CNN Visualizer
        </h2>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          <Info className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg text-sm md:text-base">
          <p className="text-gray-700 dark:text-gray-200">
            CNNs process images through layers: convolution (feature detection), 
            pooling (dimension reduction), and output generation. Watch as our sample
            image transforms through each stage.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 md:gap-8">
        <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 flex items-center justify-center">
              <Image className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-4 gap-0.5 md:gap-1">
              {SAMPLE_IMAGE.map((row, y) => 
                row.map((val, x) => renderPixel(val, x, y))
              )}
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs md:text-sm text-blue-800 dark:text-blue-100">
              Input Image
            </div>
          </div>

          <div className="pb-10">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-blue-500 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-8 flex items-center justify-center">
              <Filter className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-3 gap-0.5 md:gap-1">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i}
                  className={`
                    w-6 h-6 md:w-8 md:h-8 border border-gray-400 
                    ${currentStage === "conv" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"}
                    transition-colors duration-300
                  `}
                />
              ))}
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs md:text-sm text-blue-800 dark:text-blue-100">
              Convolution
            </div>
          </div>

          <div className="pb-10">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-blue-500 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-8 flex items-center justify-center">
              <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-0.5 md:gap-1">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className={`
                    w-6 h-6 md:w-8 md:h-8 border border-gray-400
                    ${currentStage === "pool" ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"}
                    transition-colors duration-300
                  `}
                />
              ))}
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs md:text-sm text-blue-800 dark:text-blue-100">
              Pooling
            </div>
          </div>

          <div className="pb-10">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-blue-500 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-8 flex items-center justify-center">
              <Grid className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-1 gap-0.5 md:gap-1">
              {[...Array(2)].map((_, i) => (
                <div 
                  key={i}
                  className={`
                    w-6 h-6 md:w-8 md:h-8 border border-gray-400
                    ${currentStage === "output" ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-700"}
                    transition-colors duration-300
                  `}
                />
              ))}
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs md:text-sm text-blue-800 dark:text-blue-100">
              Classification
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl mt-4 md:mt-8 px-2 md:px-0">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-blue-500 dark:text-blue-400" />
                <span className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100">
                  Understanding CNNs in AI
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`
              overflow-hidden transition-all duration-200 ease-in-out
              ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="p-4 md:p-5 space-y-4 md:space-y-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start gap-3 md:gap-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 mt-0.5 text-blue-500" />
                  <div>
                    <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">How CNNs Work</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
                      Convolutional Neural Networks (CNNs) are a revolutionary AI architecture specifically designed for processing grid-like data, such as images. This visualization demonstrates how CNNs analyze images layer by layer, similar to how our brains process visual information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <ScanEye className="w-5 h-5 md:w-6 md:h-6 mt-0.5 text-blue-500" />
                  <div>
                    <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">Learning Through Visualization</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
                      Each step in the animation represents a key CNN operation:
                    </p>
                    <ul className="mt-2 md:mt-3 space-y-2">
                      <li className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                        <span><span className="font-medium">Input Image</span>: The raw pixel data that enters the network</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                        <span><span className="font-medium">Convolution</span>: Detects features like edges, textures, and patterns</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                        <span><span className="font-medium">Pooling</span>: Reduces the image size while preserving important features</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                        <span><span className="font-medium">Classification</span>: Makes the final decision about what the image contains</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  By watching this visualization, you can better understand how AI "sees" and processes images, breaking down complex visual information into manageable pieces that lead to accurate classifications.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CNNVisualizer