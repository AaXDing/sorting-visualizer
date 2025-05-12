import React, { useState, useEffect, useCallback } from 'react';
import { bubbleSortSteps } from '../algorithms/bubbleSort';
import { mergeSortSteps } from '../algorithms/mergeSort';

export interface Bar {
  value: number;
  color: string; // Now a hex color code
}

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

interface SortingVisualizerProps {
  arraySize?: number;
  minValue?: number;
  maxValue?: number;
}

const COLOR_DEFAULT = '#3b82f6'; // blue-500
const COLOR_COMPARE = '#ef4444'; // red-500
const COLOR_SORTED = '#22c55e'; // green-500

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  arraySize = 50,
  minValue = 5,
  maxValue = 100,
}) => {
  const [array, setArray] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState<Bar[][]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');

  const generateNewArray = useCallback(() => {
    const newArray: Bar[] = Array.from({ length: arraySize }, () => ({
      value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      color: COLOR_DEFAULT,
    }));
    setArray(newArray);
    setCurrentStep(0);
    setSortingSteps([]);
  }, [arraySize, maxValue, minValue]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const bubbleSort = useCallback(() => {
    const steps = bubbleSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps);
    setIsSorting(true);
  }, [array]);

  const mergeSort = useCallback(() => {
    const steps = mergeSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps);
    setIsSorting(true);
  }, [array]);

  const handleNextStep = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setArray(sortingSteps[currentStep + 1]);
    } else {
      setIsSorting(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const startSorting = () => {
    switch (selectedAlgorithm) {
      case 'bubble':
        bubbleSort();
        break;
      case 'merge':
        mergeSort();
        break;
      // Add other sorting algorithms here as they are implemented
      default:
        bubbleSort();
    }
  };

  useEffect(() => {
    if (isSorting && !isPaused && currentStep < sortingSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setArray(sortingSteps[currentStep + 1]);
      }, 100);
      return () => clearTimeout(timer);
    } else if (isSorting && currentStep >= sortingSteps.length - 1) {
      setIsSorting(false);
    }
  }, [isSorting, isPaused, currentStep, sortingSteps]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Debug output */}
      <div className="text-xs text-gray-500 mb-2">Array length: {array.length} | Values: [{array.map(bar => bar.value).join(', ')}]</div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={generateNewArray}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSorting}
        >
          Generate New Array
        </button>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value as SortingAlgorithm)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 border-0 shadow-sm transition-colors duration-150"
          disabled={isSorting}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
        </select>
        <button
          onClick={isSorting ? handlePause : startSorting}
          className={`px-4 py-2 text-white rounded ${
            isSorting 
              ? isPaused 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isSorting ? (isPaused ? 'Resume' : 'Pause') : 'Start Sorting'}
        </button>
        <button
          onClick={handleNextStep}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={!isSorting || !isPaused}
        >
          Next Step
        </button>
      </div>
      
      <div className="flex items-end gap-x-0.5 h-[400px] w-full max-w-4xl border-2 border-gray-300 rounded-lg p-4 bg-white">
        {array.map((bar, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              marginLeft: array.length > 500 ? '1px' : '0.2%',
              marginRight: array.length > 500 ? '1px' : '0.2%',
              height: `${(bar.value / maxValue) * 100}%`,
              minHeight: '4px',
              backgroundColor: bar.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer; 