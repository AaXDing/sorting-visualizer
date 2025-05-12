import type { Bar } from "../components/SortingVisualizer";

export function insertionSortSteps(
  array: Bar[],
  COLOR_DEFAULT: string,
  COLOR_COMPARE: string,
  COLOR_SORTED: string
): Bar[][] {
  const steps: Bar[][] = [];
  const arr = array.map(bar => ({ ...bar }));
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1].value > arr[j].value) {
      steps.push(arr.map((bar, idx) => ({
        ...bar,
        color: idx === j || idx === j - 1 ? COLOR_COMPARE : idx < i ? COLOR_SORTED : COLOR_DEFAULT,
      })));
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      j--;
    }
    steps.push(arr.map((bar, idx) => ({
      ...bar,
      color: idx <= i ? COLOR_SORTED : COLOR_DEFAULT,
    })));
  }
  steps.push(arr.map(bar => ({ ...bar, color: COLOR_SORTED })));
  return steps;
} 