import type { Bar } from "../components/SortingVisualizer";

export function quickSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): Bar[][] {
  const COLOR_PIVOT = '#f59e42'; // orange
  const steps: Bar[][] = [];
  const arr = array.map(bar => ({ ...bar }));

  function quickSort(start: number, end: number) {
    if (start >= end) return;
    let pivotIdx = partition(start, end);
    quickSort(start, pivotIdx - 1);
    quickSort(pivotIdx + 1, end);
  }

  function partition(start: number, end: number) {
    let pivot = arr[end];
    let i = start;
    for (let j = start; j < end; j++) {
      steps.push(arr.map((bar, idx) => ({
        ...bar,
        color: idx === j ? COLOR_COMPARE : idx === end ? COLOR_PIVOT : COLOR_DEFAULT,
      })));
      if (arr[j].value < pivot.value) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    [arr[i], arr[end]] = [arr[end], arr[i]];
    // Mark pivot as sorted
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: idx === i ? COLOR_SORTED : COLOR_DEFAULT,
    })));
    return i;
  }

  quickSort(0, arr.length - 1);
  // Mark all as sorted at the end
  steps.push(arr.map(bar => ({ ...bar, color: COLOR_SORTED })));
  return steps;
} 