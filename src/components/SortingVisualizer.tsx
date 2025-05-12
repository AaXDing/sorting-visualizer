import React, { useState, useEffect, useCallback } from 'react';
import { bubbleSortSteps } from '../algorithms/bubbleSort';
import { mergeSortSteps } from '../algorithms/mergeSort';
import { selectionSortSteps } from '../algorithms/selectionSort';
import { insertionSortSteps } from '../algorithms/insertionSort';
import { quickSortSteps } from '../algorithms/quickSort';

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

// Pseudo code mapping for each algorithm
const PSEUDO_CODE: Record<SortingAlgorithm, string[]> = {
  bubble: [
    'for i from 0 to n-1',
    '    for j from 0 to n-i-2',
    '        if arr[j] > arr[j+1]',
    '            swap arr[j] and arr[j+1]'
  ],
  selection: [
    'for i from 0 to n-1',
    '    minIndex = i',
    '    for j from i+1 to n-1',
    '        if arr[j] < arr[minIndex]',
    '            minIndex = j',
    '    swap arr[i] and arr[minIndex]'
  ],
  insertion: [
    'for i from 1 to n-1',
    '    j = i',
    '    while j > 0 and arr[j-1] > arr[j]',
    '        swap arr[j] and arr[j-1]',
    '        j = j - 1'
  ],
  quick: [
    'function quickSort(arr, start, end):',
    '    if start >= end: return',
    '    pivotIndex = partition(arr, start, end)',
    '    quickSort(arr, start, pivotIndex-1)',
    '    quickSort(arr, pivotIndex+1, end)',
    '',
    'function partition(arr, start, end):',
    '    pivot = arr[end]',
    '    i = start',
    '    for j from start to end-1:',
    '        if arr[j] < pivot:',
    '            swap arr[i] and arr[j]',
    '            i = i + 1',
    '    swap arr[i] and arr[end]',
    '    return i'
  ],
  merge: [
    'function mergeSort(arr, start, end):',
    '    if end - start <= 1: return',
    '    mid = (start + end) // 2',
    '    mergeSort(arr, start, mid)',
    '    mergeSort(arr, mid, end)',
    '    merge(arr, start, mid, end)',
    '',
    'function merge(arr, start, mid, end):',
    '    left = arr[start:mid]',
    '    right = arr[mid:end]',
    '    i = start, l = 0, r = 0',
    '    while l < len(left) and r < len(right):',
    '        if left[l] <= right[r]:',
    '            arr[i] = left[l]',
    '            l += 1',
    '        else:',
    '            arr[i] = right[r]',
    '            r += 1',
    '        i += 1',
    '    while l < len(left):',
    '        arr[i] = left[l]',
    '        l += 1; i += 1',
    '    while r < len(right):',
    '        arr[i] = right[r]',
    '        r += 1; i += 1'
  ]
};

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  arraySize = 20,
  minValue = 5,
  maxValue = 100,
}) => {
  const [array, setArray] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState<Bar[][]>([]);
  const [lineSteps, setLineSteps] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');

  const generateNewArray = useCallback(() => {
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSortingSteps([]);
    setLineSteps([]);
    const newArray: Bar[] = Array.from({ length: arraySize }, () => ({
      value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
      color: COLOR_DEFAULT,
    }));
    setArray(newArray);
  }, [arraySize, maxValue, minValue]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const bubbleSort = useCallback(() => {
    const steps = bubbleSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps.map(s => s.bars));
    setLineSteps(steps.map(s => s.line));
    setIsSorting(true);
  }, [array]);

  const mergeSort = useCallback(() => {
    const steps = mergeSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps);
    setIsSorting(true);
  }, [array]);

  const selectionSort = useCallback(() => {
    const steps = selectionSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps);
    setIsSorting(true);
  }, [array]);

  const insertionSort = useCallback(() => {
    const steps = insertionSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
    setSortingSteps(steps);
    setIsSorting(true);
  }, [array]);

  const quickSort = useCallback(() => {
    const steps = quickSortSteps(array, COLOR_DEFAULT, COLOR_COMPARE, COLOR_SORTED);
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
      case 'selection':
        selectionSort();
        break;
      case 'insertion':
        insertionSort();
        break;
      case 'quick':
        quickSort();
        break;
      case 'merge':
        mergeSort();
        break;
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

  const currentLine = selectedAlgorithm === 'bubble' && lineSteps.length > 0 ? lineSteps[currentStep] : null;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Pseudo code display */}
      <div className="w-full max-w-4xl mb-4">
        <div className="bg-gray-900 text-white rounded-lg p-4 font-mono text-sm overflow-x-auto shadow">
          <div className="mb-2 font-bold text-blue-300">{selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)} Sort Pseudo Code</div>
          <pre className="whitespace-pre-wrap">
            {PSEUDO_CODE[selectedAlgorithm].map((line, idx) => (
              <div
                key={idx}
                className={selectedAlgorithm === 'bubble' && idx === currentLine ? 'bg-yellow-400 text-gray-900 rounded px-1' : ''}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
      {/* Debug output */}
      {/* <div className="text-xs text-gray-500 mb-2">Array length: {array.length} | Values: [{array.map(bar => bar.value).join(', ')}]</div> */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={generateNewArray}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Generate New Array
        </button>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value as SortingAlgorithm)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 border-0 shadow-sm transition-colors duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
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